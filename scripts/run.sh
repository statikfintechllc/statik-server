#!/usr/bin/env bash
# Statik-Server Enhanced Startup Script
# Handles VS Code server + mesh VPN + domain broadcasting
set -e

# Configuration
STATIK_HOME="$HOME/.statik-server"
SCRIPT_DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PORT=${STATIK_PORT:-8080}
HTTPS_PORT=${STATIK_HTTPS_PORT:-8443}
MESH_PORT=${STATIK_MESH_PORT:-8444}
DOMAIN=${STATIK_DOMAIN:-$(hostname).statik.local}

# Detect public IP for global mesh access
detect_public_ip() {
    local public_ip=""
    
    # Try multiple methods to get public IP
    if command -v curl >/dev/null 2>&1; then
        public_ip=$(curl -s --connect-timeout 5 ifconfig.me 2>/dev/null || 
                   curl -s --connect-timeout 5 ipinfo.io/ip 2>/dev/null ||
                   curl -s --connect-timeout 5 checkip.amazonaws.com 2>/dev/null)
    fi
    
    # Fallback to local IP if public detection fails
    if [[ -z "$public_ip" ]] || [[ "$public_ip" =~ ^192\.168\. ]] || [[ "$public_ip" =~ ^10\. ]] || [[ "$public_ip" =~ ^172\.(1[6-9]|2[0-9]|3[0-1])\. ]]; then
        public_ip=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "127.0.0.1")
    fi
    
    echo "$public_ip"
}

PUBLIC_IP=$(detect_public_ip)
# Use public IP for global access, with separate ports for VS Code and mesh
MESH_SERVER_URL=${STATIK_MESH_URL:-"https://$PUBLIC_IP:$MESH_PORT"}

# Colors
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
NC='\033[0m'

# Logging
log() { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; exit 1; }

# Open required ports for global access
open_ports() {
    local ports=(8443 50443 3478)
    if command -v ufw >/dev/null 2>&1; then
        for port in "${ports[@]}"; do
            if ! sudo ufw status | grep -q "$port/tcp"; then
                echo -e "${CYAN}🔧 Opening port $port/tcp with ufw...${NC}"
                sudo ufw allow "$port/tcp" || warn "Failed to open port $port/tcp with ufw."
            fi
        done
    else
        warn "ufw not found. Please ensure ports 8443, 50443, and 3478 are open in your firewall manually."
    fi
}
# Ensure directories exist
mkdir -p "$STATIK_HOME"/{config,keys,logs,data,extensions}

# Check for required files
check_dependencies() {
    local missing=()
    
    # Check for VS Code CLI
    if [[ ! -f "$REPO_DIR/lib/code" ]]; then
        missing+=("VS Code CLI")
    fi
    
    # Check for certificates
    if [[ ! -f "$STATIK_HOME/keys/server.crt" ]]; then
        missing+=("SSL certificates")
    fi
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        warn "Missing components: ${missing[*]}"
        echo "Run './install.sh' to set up all dependencies."
        exit 1
    fi
}

# Generate QR code for mobile access
generate_qr() {
    local url="$1"
    if command -v qrencode >/dev/null 2>&1; then
        echo -e "\n${CYAN}📱 Mobile Access QR Code:${NC}"
        qrencode -t ansiutf8 "$url"
        echo -e "${BLUE}Scan to access from mobile device${NC}\n"
    fi
}

# Start mesh VPN using existing Tailscale connection (like Mobile-Developer)
start_mesh() {
    log "Checking Tailscale mesh connection..."
    
    # Check if Tailscale is installed system-wide
    if command -v tailscale >/dev/null 2>&1; then
        # Use system Tailscale
        TAILSCALE_CMD="tailscale"
    elif [[ -f "$REPO_DIR/bin/tailscale" ]]; then
        # Use our built Tailscale
        TAILSCALE_CMD="$REPO_DIR/bin/tailscale"
    else
        warn "Tailscale not found. Install Tailscale or run './install.sh' to build it."
        return 1
    fi
    
    # Get Tailscale IP address
    local tailscale_ip=""
    tailscale_ip=$($TAILSCALE_CMD ip -4 2>/dev/null | head -n1)
    
    if [[ -z "$tailscale_ip" ]]; then
        warn "Tailscale not connected. Run 'sudo tailscale up' to connect to your tailnet first."
        log "Falling back to local IP access only..."
        return 1
    else
        log "Tailscale connected: $tailscale_ip"
        log "Mesh VPN ready - VS Code will be accessible via Tailscale mesh"
        
        # Store Tailscale IP for use in other functions
        echo "$tailscale_ip" > "$STATIK_HOME/tailscale_ip"
        
        # Save connection details  
        cat > "$STATIK_HOME/config/tailscale-connection.json" << EOF
{
    "tailscale_ip": "$tailscale_ip",
    "vs_code_url": "http://$tailscale_ip:$PORT",
    "https_url": "https://$tailscale_ip:$HTTPS_PORT",
    "setup_time": "$(date -Iseconds)",
    "type": "tailscale"
}
EOF
        return 0
    fi
}

# Start HTTPS proxy for VS Code
start_https_proxy() {
    if command -v socat >/dev/null 2>&1; then
        log "Starting HTTPS proxy for VS Code on port $HTTPS_PORT..."
        
        # Check if we have Tailscale IP for mesh access
        local bind_address="0.0.0.0"
        if [[ -f "$STATIK_HOME/tailscale_ip" ]]; then
            local tailscale_ip=$(cat "$STATIK_HOME/tailscale_ip")
            log "Binding HTTPS proxy to Tailscale IP: $tailscale_ip"
        fi
        
        socat TCP-LISTEN:$HTTPS_PORT,fork,reuseaddr,bind=$bind_address \
            OPENSSL:localhost:$PORT,cert="$STATIK_HOME/keys/server.crt",key="$STATIK_HOME/keys/server.key",verify=0 >/dev/null 2>&1 &
        
        PROXY_PID=$!
        echo $PROXY_PID > "$STATIK_HOME/proxy.pid"
        log "VS Code HTTPS proxy started (PID: $PROXY_PID)"
    fi
}

# Check firewall and port accessibility for global mesh
check_global_access() {
    log "Checking global mesh accessibility..."
    
    # List of required ports for global access
    local required_ports=("$HTTPS_PORT" "$MESH_PORT" "50443" "3478")
    local warnings=()
    
    for port in "${required_ports[@]}"; do
        # Check if port is listening
        if ! netstat -tuln 2>/dev/null | grep -q ":$port "; then
            if [[ "$port" == "$HTTPS_PORT" ]]; then
                warnings+=("HTTPS port $port not yet listening (will be available after startup)")
            else
                warnings+=("Mesh port $port not listening")
            fi
        fi
        
        # Basic connectivity test (if public IP is not local)
        if [[ "$PUBLIC_IP" != "127.0.0.1" ]] && [[ ! "$PUBLIC_IP" =~ ^192\.168\. ]] && [[ ! "$PUBLIC_IP" =~ ^10\. ]]; then
            # Only test if we have a public IP
            if command -v nc >/dev/null 2>&1; then
                if ! timeout 3 nc -z "$PUBLIC_IP" "$port" 2>/dev/null; then
                    warnings+=("Port $port may not be accessible from internet (check firewall/router)")
                fi
            fi
        fi
    done
    
    # Display warnings if any
    if [[ ${#warnings[@]} -gt 0 ]]; then
        warn "Global access warnings:"
        for warning in "${warnings[@]}"; do
            echo "  ⚠️  $warning"
        done
        echo ""
        echo "For global access, ensure these ports are open:"
        echo "  - $HTTPS_PORT (HTTPS/Web interface)"
        echo "  - 3478 (STUN for NAT traversal)"
        echo ""
    else
        log "Global mesh ports appear accessible ✅"
    fi
}

# Main startup function
main() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                   🚀 STATIK-SERVER STARTUP                      ║"
    echo "║              Sovereign AI Development Environment               ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    open_ports
    check_dependencies
    check_global_access
    start_mesh
    start_https_proxy
    
    log "Starting VS Code server with workspace..."
    
    # Determine workspace directory to serve
    WORKSPACE_DIR="${STATIK_WORKSPACE:-$REPO_DIR}"
    if [[ -d "$REPO_DIR/src" ]]; then
        WORKSPACE_DIR="$REPO_DIR"
        log "Serving entire statik-server repository including /src"
    elif [[ -n "$1" && -d "$1" ]]; then
        WORKSPACE_DIR="$1"
        log "Serving custom workspace: $WORKSPACE_DIR"
    else
        WORKSPACE_DIR="$REPO_DIR"
        log "Serving default workspace: $WORKSPACE_DIR"
    fi
    
    # GitHub token handling
    GITHUB_TOKEN=""
    if [[ -f "$STATIK_HOME/config/github-token" ]]; then
        GITHUB_TOKEN=$(cat "$STATIK_HOME/config/github-token")
    fi
    
    # Export GitHub token for Copilot
    if [[ -n "$GITHUB_TOKEN" ]]; then
        export GITHUB_TOKEN
        log "GitHub Copilot enabled"
    else
        warn "No GitHub token found. Copilot will require authentication on first use."
    fi
    
    # Change to workspace directory before starting VS Code server
    cd "$WORKSPACE_DIR"
    log "Working directory: $(pwd)"
    
    # Start VS Code server with correct arguments - serving the actual workspace
    "$REPO_DIR/lib/code" serve-web \
      --host 0.0.0.0 \
      --port $PORT \
      --without-connection-token \
      --accept-server-license-terms &
    
    SERVER_PID=$!
    echo $SERVER_PID > "$STATIK_HOME/statik-server.pid"
    
    # Wait for server to start
    sleep 3
    
    echo -e "\n${GREEN}🎉 STATIK-SERVER RUNNING! 🎉${NC}\n"
    
    echo -e "${CYAN}📁 Serving Workspace:${NC} ${YELLOW}$WORKSPACE_DIR${NC}"
    echo -e "${CYAN}🗂️  Available Files:${NC}"
    if [[ -d "$WORKSPACE_DIR/src" ]]; then
        echo -e "  ${GREEN}✅ /src directory available${NC}"
    fi
    if [[ -f "$WORKSPACE_DIR/package.json" ]]; then
        echo -e "  ${GREEN}✅ package.json detected${NC}"
    fi
    if [[ -f "$WORKSPACE_DIR/README.md" ]]; then
        echo -e "  ${GREEN}✅ README.md available${NC}"
    fi
    echo ""
    
    echo -e "${CYAN}🌐 Access URLs:${NC}"
    echo -e "  ${BLUE}Local:${NC}      http://localhost:$PORT"
    echo -e "  ${BLUE}Network:${NC}    http://$(hostname -I | awk '{print $1}'):$PORT"
    echo -e "  ${BLUE}Secure:${NC}     https://localhost:$HTTPS_PORT"
    
    # Show Tailscale access if available
    if [[ -f "$STATIK_HOME/tailscale_ip" ]]; then
        local tailscale_ip=$(cat "$STATIK_HOME/tailscale_ip")
        echo -e "  ${GREEN}🌍 Tailscale:${NC}  https://$tailscale_ip:$HTTPS_PORT"
        echo -e "  ${GREEN}🌍 Tailscale:${NC}  http://$tailscale_ip:$PORT"
    fi
    echo ""
    
    # Show mesh connection instructions
    if [[ -f "$STATIK_HOME/tailscale_ip" ]]; then
        local tailscale_ip=$(cat "$STATIK_HOME/tailscale_ip")
        
        echo -e "${CYAN}🔗 Mesh Access (Already Connected):${NC}"
        echo -e "  ${GREEN}✅ Connected to tailnet${NC}"
        echo -e "  ${GREEN}✅ Access from any Tailscale device:${NC} https://$tailscale_ip:$HTTPS_PORT"
        echo -e "  ${YELLOW}   Add new devices to your tailnet via Tailscale admin console${NC}"
        echo ""
    else
        echo -e "${CYAN}🔗 Mesh Setup:${NC}"
        echo -e "  ${GREEN}1. Install Tailscale:${NC} curl -fsSL https://tailscale.com/install.sh | sh"
        echo -e "  ${GREEN}2. Connect to tailnet:${NC} sudo tailscale up"
        echo -e "  ${GREEN}3. Restart statik-server${NC} to enable mesh access"
        echo ""
    fi
    
    echo -e "${CYAN}🔧 Service Information:${NC}"
    echo -e "  ${YELLOW}VS Code Server:${NC}  PID $SERVER_PID (Port $PORT)"
    if [[ -f "$STATIK_HOME/tailscale_ip" ]]; then
        echo -e "  ${YELLOW}Mesh VPN:${NC}       Tailscale (IP: $(cat "$STATIK_HOME/tailscale_ip"))"
    fi
    if [[ -f "$STATIK_HOME/proxy.pid" ]]; then
        echo -e "  ${YELLOW}HTTPS Proxy:${NC}    PID $(cat "$STATIK_HOME/proxy.pid") (Port $HTTPS_PORT)"
    fi
    echo ""
    
    echo -e "${CYAN}📱 Commands:${NC}"
    echo -e "  ${YELLOW}statik-cli status${NC}    # Check detailed status"
    echo -e "  ${YELLOW}statik-cli logs${NC}      # View logs"
    echo -e "  ${YELLOW}statik-cli stop${NC}      # Stop server"
    echo -e "  ${YELLOW}tailscale status${NC}     # Check mesh status"
    echo ""
    
    # Generate QR codes
    generate_qr "http://localhost:$PORT"
    
    # Log startup
    echo "$(date): Statik-Server started (PID: $SERVER_PID)" >> "$STATIK_HOME/logs/statik-server.log"
    
    # Check global access
    check_global_access
    
    # Keep running if not backgrounded
    if [[ "${1:-}" != "--daemon" ]]; then
        echo -e "${GREEN}Press Ctrl+C to stop the server${NC}"
        wait $SERVER_PID
    fi
}

main "$@"
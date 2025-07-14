# !/usr/bin/env bash
# Statik-Server One-Command Installer
# Usage: ./install.sh
# Creates a fully self-installing statik-server environment with mesh VPN, VS Code, and GitHub Copilot

set -e

# Colors for output
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
PURPLE='\033[1;35m'
NC='\033[0m' # No Color

# Configuration
STATIK_HOME="$HOME/.statik-server"
INSTALL_DIR="/opt/statik-server"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons"

# Detect platform
PLATFORM=""
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
else
    echo -e "${RED}❌ Unsupported platform: $OSTYPE${NC}"
    exit 1
fi

# Print header
print_header() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 STATIK-SERVER INSTALLER                    ║"
    echo "║              Sovereign AI Development Environment                ║"
    echo "║                                                                  ║"
    echo "║  ✨ Official VS Code Server + GitHub Copilot                     ║"
    echo "║  🌐 Mesh VPN with Headscale Integration                          ║"
    echo "║  🔐 Auto-generated Keys & Certificates                           ║"
    echo "║  📱 Mobile Access via QR Codes                                   ║"
    echo "║  🎯 Zero Configuration Required                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

git clone https://github.com/statikfintechllc/statik-server.git
cd statik-server

# Progress indicator
progress() {
    local current=$1
    local total=$2
    local desc=$3
    local percentage=$((current * 100 / total))
    local bar_length=50
    local filled_length=$((percentage * bar_length / 100))
    
    printf "\r${BLUE}[%3d%%] ${GREEN}" $percentage
    for ((i=0; i<filled_length; i++)); do printf "█"; done
    for ((i=filled_length; i<bar_length; i++)); do printf "░"; done
    printf " ${CYAN}%s${NC}" "$desc"
}

# Logging
log() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "Do not run this script as root. It will request sudo when needed."
    fi
}

# Check system requirements
check_requirements() {
    progress 1 20 "Checking system requirements..."
    
    # Check for required tools
    local missing_tools=()
    
    for tool in curl wget git unzip; do
        if ! command -v $tool >/dev/null 2>&1; then
            missing_tools+=($tool)
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        error "Missing required tools: ${missing_tools[*]}. Please install them first."
    fi
    
    # Check disk space (require 2GB)
    local available_space=$(df . | tail -1 | awk '{print $4}')
    if [[ $available_space -lt 2097152 ]]; then
        error "Insufficient disk space. Need at least 2GB available."
    fi
    
    progress 2 20 "System requirements check complete"
}

# Install system dependencies
install_dependencies() {
    progress 3 20 "Installing system dependencies..."
    
    if [[ "$PLATFORM" == "linux" ]]; then
        # Detect Linux distribution
        if command -v apt >/dev/null 2>&1; then
            sudo apt update >/dev/null 2>&1
            sudo apt install -y nodejs npm golang-go docker.io socat openssl qrencode >/dev/null 2>&1
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y nodejs npm golang docker socat openssl qrencode >/dev/null 2>&1
        elif command -v pacman >/dev/null 2>&1; then
            sudo pacman -S --noconfirm nodejs npm go docker socat openssl qrencode >/dev/null 2>&1
        else
            warn "Unknown package manager. Please install: nodejs, npm, go, docker, socat, openssl, qrencode manually."
        fi
    elif [[ "$PLATFORM" == "macos" ]]; then
        # Install with Homebrew
        if ! command -v brew >/dev/null 2>&1; then
            error "Homebrew is required on macOS. Install it from https://brew.sh"
        fi
        brew install node go docker socat openssl qrencode >/dev/null 2>&1
    fi
    
    # Install pnpm globally
    if ! command -v pnpm >/dev/null 2>&1; then
        npm install -g pnpm >/dev/null 2>&1
    fi
    
    progress 4 20 "Dependencies installation complete"
}

# Create directory structure
setup_directories() {
    progress 5 20 "Setting up directory structure..."
    
    # Create statik directories
    mkdir -p "$STATIK_HOME"/{config,keys,logs,data,extensions}
    mkdir -p "$BIN_DIR"
    mkdir -p "$DESKTOP_DIR"
    mkdir -p "$ICON_DIR"
    
    # Create docs directory and move documentation
    mkdir -p docs/{user,development,mesh}
    
    progress 6 20 "Directory structure created"
}

# Download VS Code CLI
install_vscode_cli() {
    progress 7 20 "Installing VS Code CLI..."
    
    local vscode_dir="./lib"
    mkdir -p "$vscode_dir"
    
    if [[ "$PLATFORM" == "linux" ]]; then
        local vscode_url="https://update.code.visualstudio.com/latest/cli-alpine-x64/stable"
    elif [[ "$PLATFORM" == "macos" ]]; then
        local vscode_url="https://update.code.visualstudio.com/latest/cli-darwin-x64/stable"
    fi
    
    if [[ ! -f "$vscode_dir/code" ]]; then
        curl -sSL "$vscode_url" -o "$vscode_dir/vscode-cli.tar.gz"
        tar -xzf "$vscode_dir/vscode-cli.tar.gz" -C "$vscode_dir"
        rm "$vscode_dir/vscode-cli.tar.gz"
        chmod +x "$vscode_dir/code"
    fi
    
    progress 8 20 "VS Code CLI installation complete"
}

# Build mesh VPN (headscale)
build_mesh() {
    progress 9 20 "Building mesh VPN components..."
    
    # Check if headscale already exists
    if [[ -f "./lib/headscale" ]]; then
        echo "  ✅ Headscale binary already exists"
        progress 10 20 "Mesh VPN components ready"
        return 0
    fi
    
    # If mesh sources exist, try to build
    if [[ -d "./internal/mesh" ]]; then
        cd ./internal/mesh
        if [[ -f "go.mod" ]]; then
            echo "  🔧 Compiling mesh VPN from source..."
            go build -o ../../lib/headscale ./cmd/headscale >/dev/null 2>&1
            go build -o ../../lib/statik-meshd ./cmd/headscale >/dev/null 2>&1
        fi
        cd - >/dev/null
    else
        # Download precompiled headscale if not available
        echo "  📥 Downloading headscale binary..."
        local headscale_version="0.26.1"
        local download_url="https://github.com/juanfont/headscale/releases/download/v${headscale_version}/headscale_${headscale_version}_linux_amd64"
        
        if command -v curl >/dev/null 2>&1; then
            curl -L -o "./lib/headscale" "$download_url" >/dev/null 2>&1
        elif command -v wget >/dev/null 2>&1; then
            wget -O "./lib/headscale" "$download_url" >/dev/null 2>&1
        else
            echo "  ⚠️  Could not download headscale (no curl/wget), mesh VPN will be disabled"
            progress 10 20 "Mesh VPN build skipped"
            return 0
        fi
        
        if [[ -f "./lib/headscale" ]]; then
            chmod +x "./lib/headscale"
            echo "  ✅ Headscale binary downloaded and ready"
        fi
    fi
    
    progress 10 20 "Mesh VPN build complete"
}

# Generate certificates and keys
generate_keys() {
    progress 11 20 "Generating certificates and authentication keys..."
    
    local cert_dir="$STATIK_HOME/keys"
    local domain_name="statik.local"
    
    # Generate self-signed certificate for HTTPS and mesh VPN
    if [[ ! -f "$cert_dir/server.crt" ]]; then
        echo "  🔑 Generating SSL certificate..."
        openssl req -x509 -newkey rsa:4096 -keyout "$cert_dir/server.key" -out "$cert_dir/server.crt" \
            -days 365 -nodes -subj "/CN=$domain_name" >/dev/null 2>&1
        
        if [[ $? -eq 0 ]]; then
            echo "  ✅ SSL certificate generated"
        else
            echo "  ❌ Failed to generate SSL certificate"
            exit 1
        fi
    fi
    
    # Generate mesh preauth key
    if [[ ! -f "$cert_dir/preauth.key" ]]; then
        echo "  🔑 Generating mesh preauth key..."
        openssl rand -hex 32 > "$cert_dir/preauth.key"
    fi
    
    # Generate API keys
    if [[ ! -f "$cert_dir/api.key" ]]; then
        echo "  🔑 Generating API key..."
        openssl rand -hex 16 > "$cert_dir/api.key"
    fi
    
    # Generate noise private key for headscale
    if [[ ! -f "$cert_dir/noise.key" ]]; then
        echo "  🔑 Generating noise private key for mesh VPN..."
        if [[ -f "lib/headscale" ]]; then
            ./lib/headscale generate private-key > "$cert_dir/noise.key"
        else
            # Fallback: generate a random key with proper format
            echo "privkey:$(openssl rand -hex 32)" > "$cert_dir/noise.key"
        fi
    fi
    
    # Generate DERP private key for mesh VPN
    if [[ ! -f "$cert_dir/derp.key" ]]; then
        echo "  🔑 Generating DERP private key for mesh VPN..."
        echo "privkey:$(openssl rand -hex 32)" > "$cert_dir/derp.key"
    fi
    
    # Note: Auto-connect key will be generated at first startup
    echo "  🚀 Auto-connect mesh key will be generated on first startup"
    
    # Set proper permissions on all keys
    chmod 600 "$cert_dir"/* 2>/dev/null
    echo "  🔒 Key permissions secured"
    
    progress 12 20 "Key generation complete"
}

# Initialize mesh VPN database
initialize_mesh() {
    progress 13 20 "Initializing mesh VPN database..."
    
    if [[ -f "$STATIK_HOME/../lib/headscale" ]]; then
        echo "  🗄️ Setting up headscale database..."
        
        # Create headscale config directory if it doesn't exist
        mkdir -p "$STATIK_HOME/config"
        
        # Initialize database by running headscale with minimal config
        cat > "$STATIK_HOME/config/temp-headscale.yaml" << EOF
server_url: https://localhost:8443
listen_addr: 0.0.0.0:50443
metrics_listen_addr: 127.0.0.1:9090
private_key_path: $STATIK_HOME/keys/server.key
tls_cert_path: $STATIK_HOME/keys/server.crt
db_type: sqlite3
db_path: $STATIK_HOME/data/headscale.db
log:
  level: info
ip_prefixes:
  - fd7a:115c:a1e0::/48
  - 100.64.0.0/10
dns_config:
  magic_dns: true
  base_domain: statik.local
EOF
        
        # Initialize database
        if "$STATIK_HOME/../lib/headscale" -c "$STATIK_HOME/config/temp-headscale.yaml" users create statik >/dev/null 2>&1; then
            echo "  ✅ Mesh database initialized with default user 'statik'"
        else
            echo "  ⚠️ Mesh database will be initialized on first startup"
        fi
        
        # Clean up temp config
        rm -f "$STATIK_HOME/config/temp-headscale.yaml"
    else
        echo "  ⚠️ Headscale not found, mesh will be configured on first run"
    fi
    
    progress 14 20 "Mesh VPN initialization complete"
}

# Setup GitHub Copilot
setup_copilot() {
    progress 15 20 "Setting up GitHub Copilot integration..."
    
    echo -e "\n${CYAN}🤖 GitHub Copilot Setup${NC}"
    echo "To enable GitHub Copilot Chat in VS Code, you'll need to authenticate."
    echo "This will be done automatically when you first start the server."
    
    # Create copilot config
    cat > "$STATIK_HOME/config/copilot.json" << 'EOF'
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  },
  "github.copilot.chat.enable": true,
  "github.copilot.advanced": {
    "debug.overrideEngine": "copilot-chat",
    "debug.useNodeRuntime": true
  }
}
EOF
    
    progress 16 20 "GitHub Copilot configuration complete"
}

# Create launch scripts
create_launch_scripts() {
    progress 17 20 "Creating launch scripts..."
    
    # Create main statik command
    cat > "$BIN_DIR/statik" << 'EOF'
#!/usr/bin/env bash
# Statik-Server Main Launcher
set -e

STATIK_HOME="$HOME/.statik-server"
SCRIPT_DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
REPO_DIR="$(dirname "$SCRIPT_DIR")/statik-server"

# If in development, use repo scripts
if [[ -d "$REPO_DIR/scripts" ]]; then
    exec "$REPO_DIR/scripts/startup.sh" "$@"
else
    # Installed version
    exec "$STATIK_HOME/bin/startup.sh" "$@"
fi
EOF

    # Create CLI wrapper
    cat > "$BIN_DIR/statik-cli" << 'EOF'
#!/usr/bin/env bash
# Statik-Server CLI Wrapper
set -e

SCRIPT_DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")"
REPO_DIR="$(dirname "$SCRIPT_DIR")/statik-server"

# If in development, use repo CLI
if [[ -f "$REPO_DIR/app/cli/statik-cli" ]]; then
    exec "$REPO_DIR/app/cli/statik-cli" "$@"
else
    # Installed version
    exec "$HOME/.statik-server/bin/statik-cli" "$@"
fi
EOF

    chmod +x "$BIN_DIR/statik" "$BIN_DIR/statik-cli"
    
    progress 18 20 "Launch scripts created"
}

# Create desktop integration
create_desktop_integration() {
    progress 19 20 "Setting up desktop integration..."
    
    # Copy icon if it exists
    if [[ -f "./app/icons/statik-server.png" ]]; then
        cp "./app/icons/statik-server.png" "$ICON_DIR/"
    else
        # Create a simple icon placeholder
        echo "📡" > "$ICON_DIR/statik-server.txt"
    fi
    
    # Create desktop entry
    cat > "$DESKTOP_DIR/statik-server.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Statik Server
Comment=Sovereign AI Development Environment
Exec=$BIN_DIR/statik-cli gui
Icon=$ICON_DIR/statik-server.png
Terminal=false
Categories=Development;IDE;Network;
Keywords=vscode;development;mesh;vpn;ai;copilot;
StartupNotify=true
EOF
    
    progress 20 20 "Desktop integration complete"
}

# Main installation function
main() {
    print_header
    
    check_root
    check_requirements
    install_dependencies
    setup_directories
    install_vscode_cli
    build_mesh
    generate_keys
    initialize_mesh
    setup_copilot
    create_launch_scripts
    create_desktop_integration
    organize_docs
    create_readme
    
    echo -e "\n${GREEN}🎉 INSTALLATION COMPLETE! 🎉${NC}\n"
    
    echo -e "${CYAN}🚀 Quick Start:${NC}"
    echo -e "  ${YELLOW}statik${NC}                    # Start the server"
    echo -e "  ${YELLOW}statik-cli status${NC}         # Check status"
    echo -e "  ${YELLOW}statik-cli gui${NC}            # Interactive interface"
    echo ""
    echo -e "${CYAN}🌐 Access URLs:${NC}"
    echo -e "  ${BLUE}Local:${NC}     http://localhost:8080"
    echo -e "  ${BLUE}Network:${NC}   http://$(hostname -I | awk '{print $1}'):8080"
    echo -e "  ${BLUE}Secure:${NC}    https://$(hostname).statik.local:8443"
    echo ""
    echo -e "${CYAN}📖 Documentation:${NC} ./docs/"
    echo -e "${CYAN}🔧 Configuration:${NC} ~/.statik-server/"
    echo ""
    echo -e "${GREEN}Launch your sovereign AI development environment:${NC} ${YELLOW}statik${NC}"
}

# Run installation
main "$@"
# Run desktop app installer
if [[ -f "$(dirname "$0")/install-app.sh" ]]; then
    bash "$(dirname "$0")/install-app.sh"
fi

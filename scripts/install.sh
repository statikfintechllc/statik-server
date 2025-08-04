#!/usr/bin/env bash

if [[ ! -f "$0" || "$0" == "bash" || "$0" == "/dev/fd/63" ]]; then
    REMOTE_INSTALL=true
    REPO_DIR="$HOME/statik-server"
    echo "🌐 Remote installation detected - will clone repository to $REPO_DIR"

    # Clone the repository if not already present
    if [[ ! -d "$REPO_DIR/.git" ]]; then
        echo "📥 Cloning Gremlin ShadTail Trader repository..."
        git clone https://github.com/statikfintechllc/statik-server.git "$REPO_DIR"
    else
        echo "🔄 Updating existing repository..."
        cd "$REPO_DIR"
        git pull origin master
    fi

    # Execute the local install script
    echo "🚀 Building Application..."
    cd "$REPO_DIR"
    chmod +x scripts/install-all
    exec ./scripts/install.script "$@"
    exit $?
else
    REMOTE_INSTALL=false
    echo "📁 Local installation detected"
fi

echo "Building Stock Vscode"
# Build VS Code from source
build_vscode() {
    progress 14 "Building VS Code from source..."
    local vscode_dir="./lib/vscode"
    if [[ -d "$vscode_dir" ]]; then
        echo "  🔧 Installing VS Code dependencies..."
        cd "$vscode_dir"
        if command -v pnpm >/dev/null 2>&1; then
            pnpm install || npm install
        else
            npm install
        fi
        echo "  🔧 Compiling VS Code..."
        if command -v pnpm >/dev/null 2>&1; then
            pnpm run compile || npm run compile
        else
            npm run compile
        fi
        cd - >/dev/null
        echo "  ✅ VS Code build complete."
    else
        warn "VS Code source directory not found at $vscode_dir. Skipping build."
    fi
    progress 15 "VS Code build finished"
}

# Removed Tailscale build function - no longer needed
# Local networking will be handled without external VPN requirements
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
LOG_FILE="$HOME/.statik-server/logs/install.log"

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"
exec > >(tee -a "$LOG_FILE") 2>&1

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
    echo "║  🌐 Local Development Environment                                ║"
    echo "║  🔐 Auto-generated Keys & Certificates                           ║"
    echo "║  📱 Mobile Access via QR Codes                                   ║"
    echo "║  🎯 Zero Configuration Required                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}


# Update or Clone the repository
cd "$HOME"
if [[ -d "statik-server" ]]; then
    echo -e "${YELLOW}⚠️  Updating existing statik-server repository...${NC}"
    cd statik-server
    git pull origin master
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}❌ Failed to update statik-server repository. Please check your internet connection or repository status.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Repository updated successfully!${NC}"
else
    echo -e "${BLUE}📥 Cloning statik-server repository...${NC}"
    git clone https://github.com/statikfintechllc/statik-server.git
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}❌ Failed to clone statik-server repository. Please check your internet connection or repository status.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Repository cloned successfully!${NC}"
fi
cd "$HOME/statik-server"
echo -e "${BLUE}📂 Current directory: $(pwd)${NC}"

# Ensure the scripts directory exists
# Progress indicator
progress() {
    local current=$1
    local total=40
    local desc=$2
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
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') ${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') ${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') ${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
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
    progress 1 "Checking system requirements..."
    
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
    
    progress 2 "System requirements check complete"
}


# Install system dependencies
install_dependencies() {
    progress 3 "Installing system dependencies..."
    
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
    
    progress 8 "Dependencies installation complete"
}


# Create directory structure
setup_directories() {
    progress 9 "Setting up directory structure..."
    
    # Create statik directories
    mkdir -p "$STATIK_HOME"/{config,keys,logs,data,extensions}
    mkdir -p "$BIN_DIR"
    mkdir -p "$DESKTOP_DIR"
    mkdir -p "$ICON_DIR"
    
    # Create docs directory and move documentation
    mkdir -p docs/{user,development,mesh}
    
    progress 12 "Directory structure created"
}


# Download VS Code CLI
install_vscode_cli() {
    progress 13 "Installing VS Code CLI..."
    
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
    
    progress 16 "VS Code CLI installation complete"
}

# Build all frontend components
build_frontends() {
    progress 17 "Building frontend components..."
    
    # Build Node.js frontends if they exist
    if [[ -d "./src/browser" ]]; then
        echo "  🔧 Building browser frontend..."
        cd "./src/browser"
        if [[ -f "package.json" ]]; then
            pnpm install >/dev/null 2>&1
            pnpm build >/dev/null 2>&1
        fi
        cd - >/dev/null
    fi
    
    if [[ -d "./src/node" ]]; then
        echo "  🔧 Building Node.js backend..."
        cd "./src/node"
        if [[ -f "package.json" ]]; then
            pnpm install >/dev/null 2>&1
            pnpm build >/dev/null 2>&1
        fi
        cd - >/dev/null
    fi
    
    # Build any React/Next.js components
    if [[ -f "./package.json" ]]; then
        echo "  🔧 Building main project..."
        pnpm install >/dev/null 2>&1
        if grep -q "build" package.json; then
            pnpm build >/dev/null 2>&1
        fi
    fi
    
    progress 20 "Frontend build complete"
}



# Build local networking components (no external VPN)
build_mesh() {
    progress 21 "Setting up local networking components..."
    
    echo "  ✅ Local networking components ready"
    progress 24 "Local networking setup complete"
}


# Generate certificates and keys
generate_keys() {
    progress 25 "Generating certificates and authentication keys..."
    
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
    
    # Generate general encryption key for local services
    if [[ ! -f "$cert_dir/encryption.key" ]]; then
        echo "  🔑 Generating encryption key for local services..."
        openssl rand -hex 32 > "$cert_dir/encryption.key"
    fi
    
    # Note: Auto-connect key will be generated at first startup
    echo "  🚀 Auto-connect mesh key will be generated on first startup"
    
    # Set proper permissions on all keys
    chmod 600 "$cert_dir"/* 2>/dev/null
    echo "  🔒 Key permissions secured"
    
    progress 28 "Key generation complete"
}


# Initialize mesh VPN database
# Initialize local configuration
initialize_local_config() {
    progress 29 "Initializing local configuration..."
    
    echo "  🗄️ Setting up local configuration..."
    
    # Create local config directory if it doesn't exist
    mkdir -p "$STATIK_HOME/config"
    
    # Create local service configuration
    cat > "$STATIK_HOME/config/local.json" << EOF
{
  "version": 1,
  "hostname": "statik-server",
  "local_mode": true
}
EOF
    
    echo "  ✅ Local configuration initialized"
    
    progress 32 "Local configuration complete"
}

# Setup GitHub Copilot
setup_copilot() {
    progress 33 "Setting up GitHub Copilot integration..."
    
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
    
    progress 36 "GitHub Copilot configuration complete"
}


# Create launch scripts
create_launch_scripts() {
    progress 37 "Creating launch scripts..."
    
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
    
    progress 38 "Launch scripts created"
}

# Create desktop integration
create_desktop_integration() {
    progress 39 "Setting up desktop integration..."
    
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
    
    progress 40 "Desktop integration complete"
}

# Setup local development access
setup_global_access() {
    echo -e "\n${CYAN}🌍 Setting up local development access...${NC}"
    
    echo -e "${GREEN}✅ Local access ready!${NC}"
    echo -e "  ${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "  ${GREEN}VS Code:${NC} http://localhost:8080"
    echo -e "  ${GREEN}GremlinGPT:${NC} http://localhost:7777"
}

# Main installation function
main() {
    print_header
    
    check_root
    check_requirements
    install_dependencies
    setup_directories
    install_vscode_cli
    build_vscode
    build_frontends
    build_mesh
    generate_keys
    initialize_local_config
    setup_copilot
    create_launch_scripts
    create_desktop_integration
    setup_global_access
    
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

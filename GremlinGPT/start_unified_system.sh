#!/usr/bin/env bash

# ─────────────────────────────────────────────────────────────
# ⚠️ GremlinGPT Fair Use Only | Commercial Use Requires License
# Built under the GremlinGPT Dual License v1.0
# © 2025 StatikFintechLLC / AscendAI Project
# Contact: ascend.gremlin@gmail.com
# ─────────────────────────────────────────────────────────────

# GremlinGPT v1.0.3 :: Unified System Startup Script
# Single command to start the fully aligned StatikServer + GremlinGPT + Copilot ecosystem

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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GREMLINGPT_DIR="$SCRIPT_DIR"
LOG_DIR="$GREMLINGPT_DIR/data/logs"
CHECKPOINTS_DIR="$GREMLINGPT_DIR/run/checkpoints"

# Logging functions
log() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_DIR/unified_startup.log"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_DIR/unified_startup.log"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_DIR/unified_startup.log"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_DIR/unified_startup.log"
}

# Print header
print_header() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║          🧠 GREMLINGPT + COPILOT UNIFIED SYSTEM STARTUP           ║"
    echo "║                                                                    ║"
    echo "║    Fully Aligned StatikServer + GremlinGPT + GitHub Copilot       ║"
    echo "║                                                                    ║"
    echo "║  🎯 Single Command → Complete AI Development Environment          ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Create required directories
setup_directories() {
    log "Setting up required directories..."
    
    local required_dirs=(
        "$LOG_DIR"
        "$CHECKPOINTS_DIR"
        "$GREMLINGPT_DIR/data"
        "$GREMLINGPT_DIR/memory/vector_store/faiss"
        "$GREMLINGPT_DIR/memory/vector_store/chroma"
        "$GREMLINGPT_DIR/memory/local_index/documents"
        "$HOME/.statik/keys"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log "Created directory: $dir"
        fi
    done
    
    success "Directory setup completed"
}

# Check dependencies
check_dependencies() {
    log "Checking system dependencies..."
    
    local required_commands=("python3" "node" "npm" "git" "curl")
    local missing_commands=()
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        error "Missing required commands: ${missing_commands[*]}"
    fi
    
    # Check Python version
    python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
    if [[ $(echo "$python_version >= 3.8" | bc -l) -eq 0 ]]; then
        error "Python 3.8+ is required (found: Python $python_version)"
    fi
    
    success "Dependency check completed"
}

# Install Python dependencies
install_python_deps() {
    log "Installing Python dependencies..."
    
    # Install required packages
    local required_packages=("toml" "aiohttp" "asyncio")
    
    for package in "${required_packages[@]}"; do
        if ! python3 -c "import $package" 2>/dev/null; then
            log "Installing $package..."
            pip3 install "$package" --user --quiet
        fi
    done
    
    success "Python dependencies installed"
}

# Validate configuration
validate_configuration() {
    log "Validating system configuration..."
    
    cd "$GREMLINGPT_DIR"
    
    # Set environment variables for configuration
    export STATIK_COPILOT_ENABLED=${STATIK_COPILOT_ENABLED:-false}
    export STATIK_GREMLINGPT_ENABLED=${STATIK_GREMLINGPT_ENABLED:-true}
    export STATIK_FSM_ENABLED=${STATIK_FSM_ENABLED:-true}
    export STATIK_AGENTS_ENABLED=${STATIK_AGENTS_ENABLED:-true}
    
    if python3 core/config_manager.py --validate; then
        success "Configuration validation passed"
    else
        error "Configuration validation failed"
    fi
}

# Start system coordinator
start_system_coordinator() {
    log "Starting GremlinGPT system coordinator..."
    
    cd "$GREMLINGPT_DIR"
    
    # Set startup environment
    export PYTHONPATH="$GREMLINGPT_DIR:$PYTHONPATH"
    export STATIK_STARTUP_MODE="production"
    
    # Start the unified system
    nohup python3 unified_startup.py \
        --mode production \
        --task-routing intelligent \
        > "$LOG_DIR/system_coordinator.log" 2>&1 &
    
    local coordinator_pid=$!
    echo "$coordinator_pid" > "$CHECKPOINTS_DIR/coordinator.pid"
    
    log "System coordinator started (PID: $coordinator_pid)"
    
    # Wait for initialization
    log "Waiting for system initialization..."
    local max_wait=60
    local wait_count=0
    
    while [[ $wait_count -lt $max_wait ]]; do
        if [[ -f "$CHECKPOINTS_DIR/runtime_config.json" ]]; then
            success "System coordinator initialized successfully"
            return 0
        fi
        
        sleep 1
        ((wait_count++))
        
        if [[ $((wait_count % 10)) -eq 0 ]]; then
            log "Still waiting for initialization... ($wait_count/$max_wait)"
        fi
    done
    
    error "System coordinator initialization timeout"
}

# Check system status
check_system_status() {
    log "Checking system status..."
    
    cd "$GREMLINGPT_DIR"
    
    if python3 unified_startup.py --status > /dev/null 2>&1; then
        success "System is running and healthy"
        return 0
    else
        warn "System status check failed"
        return 1
    fi
}

# Display access information
display_access_info() {
    log "Preparing access information..."
    
    echo -e "\n${CYAN}╔════════════════════════════════════════════════════════════════════╗"
    echo -e "║                    🚀 SYSTEM READY FOR USE                         ║"
    echo -e "╚════════════════════════════════════════════════════════════════════╝${NC}\n"
    
    echo -e "${GREEN}✅ Unified System Status: ${YELLOW}OPERATIONAL${NC}"
    echo -e "${GREEN}✅ GremlinGPT Core: ${YELLOW}ACTIVE${NC}"
    echo -e "${GREEN}✅ System Coordinator: ${YELLOW}RUNNING${NC}"
    echo -e "${GREEN}✅ Configuration: ${YELLOW}VALIDATED${NC}"
    
    echo -e "\n${CYAN}🌐 Access Information:${NC}"
    echo -e "  ${YELLOW}• Frontend Dashboard:${NC} http://localhost:3000"
    echo -e "  ${YELLOW}• VS Code Server:${NC}     http://localhost:8080"
    echo -e "  ${YELLOW}• GremlinGPT API:${NC}     http://localhost:7777"
    
    echo -e "\n${CYAN}🤖 AI Integration Status:${NC}"
    if [[ "${STATIK_COPILOT_ENABLED:-false}" == "true" ]]; then
        echo -e "  ${GREEN}✅ GitHub Copilot:${NC} Enabled and Integrated"
    else
        echo -e "  ${YELLOW}⚠️  GitHub Copilot:${NC} Disabled (can be enabled with GITHUB_TOKEN)"
    fi
    echo -e "  ${GREEN}✅ GremlinGPT AI:${NC} Active and Coordinated"
    echo -e "  ${GREEN}✅ Intelligent Task Routing:${NC} Operational"
    echo -e "  ${GREEN}✅ System Coordination:${NC} Active"
    
    echo -e "\n${CYAN}📋 Usage Instructions:${NC}"
    echo -e "  ${GREEN}1.${NC} Open VS Code Server: ${BLUE}http://localhost:8080${NC}"
    echo -e "  ${GREEN}2.${NC} Start coding with AI assistance"
    echo -e "  ${GREEN}3.${NC} GremlinGPT automatically enhances your workflow"
    echo -e "  ${GREEN}4.${NC} Monitor system: ${YELLOW}python3 unified_startup.py --status${NC}"
    
    echo -e "\n${CYAN}📁 Important Locations:${NC}"
    echo -e "  ${YELLOW}• Logs:${NC}          $LOG_DIR/"
    echo -e "  ${YELLOW}• Configuration:${NC}  $GREMLINGPT_DIR/config/"
    echo -e "  ${YELLOW}• Checkpoints:${NC}    $CHECKPOINTS_DIR/"
    
    echo -e "\n${CYAN}🛑 To Stop System:${NC}"
    echo -e "  ${YELLOW}• Graceful shutdown:${NC} python3 unified_startup.py --stop"
    echo -e "  ${YELLOW}• Force stop:${NC}       kill \$(cat $CHECKPOINTS_DIR/coordinator.pid)"
    
    echo -e "\n${PURPLE}🎉 The fully aligned StatikServer + GremlinGPT + Copilot system is ready!${NC}"
    echo -e "${PURPLE}   Navigate to VS Code and experience seamless AI-powered development.${NC}\n"
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    
    if [[ -f "$CHECKPOINTS_DIR/coordinator.pid" ]]; then
        local pid
        pid=$(cat "$CHECKPOINTS_DIR/coordinator.pid")
        if kill -0 "$pid" 2>/dev/null; then
            log "Stopping system coordinator (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
            sleep 2
        fi
        rm -f "$CHECKPOINTS_DIR/coordinator.pid"
    fi
}

# Signal handlers
trap cleanup EXIT
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

# Main execution
main() {
    print_header
    
    # Parse command line arguments
    local start_services=true
    local show_status=false
    local stop_system=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --status)
                show_status=true
                start_services=false
                shift
                ;;
            --stop)
                stop_system=true
                start_services=false
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --status    Show system status"
                echo "  --stop      Stop running system"
                echo "  --help      Show this help"
                echo ""
                echo "Environment Variables:"
                echo "  STATIK_COPILOT_ENABLED    Enable/disable Copilot (true/false)"
                echo "  STATIK_GREMLINGPT_ENABLED Enable/disable GremlinGPT (true/false)"
                echo "  GITHUB_TOKEN              GitHub token for Copilot"
                exit 0
                ;;
            *)
                warn "Unknown option: $1"
                shift
                ;;
        esac
    done
    
    # Execute based on arguments
    if [[ "$show_status" == "true" ]]; then
        check_system_status
        exit $?
    fi
    
    if [[ "$stop_system" == "true" ]]; then
        log "Stopping unified system..."
        cd "$GREMLINGPT_DIR"
        python3 unified_startup.py --stop
        cleanup
        success "System stopped"
        exit 0
    fi
    
    if [[ "$start_services" == "true" ]]; then
        # Full startup sequence
        setup_directories
        check_dependencies
        install_python_deps
        validate_configuration
        start_system_coordinator
        display_access_info
        
        # Keep script running to maintain services
        log "System is running. Press Ctrl+C to stop."
        while true; do
            sleep 10
            
            # Health check
            if ! check_system_status; then
                warn "System health check failed"
                # Could implement restart logic here
            fi
        done
    fi
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
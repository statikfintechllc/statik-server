#!/usr/bin/env bash

# ─────────────────────────────────────────────────────────────
# StatikServer + GremlinGPT + Copilot Unified Startup
# Single command to start the complete aligned ecosystem
# ─────────────────────────────────────────────────────────────

set -e

# Colors
GREEN='\033[1;32m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GREMLINGPT_DIR="$SCRIPT_DIR/GremlinGPT"

print_header() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                 🚀 STATIK-SERVER UNIFIED STARTUP                 ║"
    echo "║                                                                  ║"
    echo "║         GremlinGPT + GitHub Copilot + VS Code Server            ║"
    echo "║                  Fully Aligned AI Environment                   ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
}

# Check if we're in the right directory
if [[ ! -d "$GREMLINGPT_DIR" ]]; then
    echo -e "${RED}Error: GremlinGPT directory not found at $GREMLINGPT_DIR${NC}"
    echo "Please run this script from the statik-server root directory"
    exit 1
fi

print_header

echo -e "${CYAN}🔧 Starting StatikServer + GremlinGPT + Copilot Integration...${NC}\n"

# Change to GremlinGPT directory
cd "$GREMLINGPT_DIR"

# Check if unified startup script exists
if [[ ! -f "start_unified_system.sh" ]]; then
    echo -e "${RED}Error: Unified startup script not found${NC}"
    exit 1
fi

# Make sure the script is executable
chmod +x start_unified_system.sh

# Pass all arguments to the unified startup script
echo -e "${YELLOW}🎯 Launching unified system...${NC}\n"
exec ./start_unified_system.sh "$@"
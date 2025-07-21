#!/usr/bin/env python3

# ─────────────────────────────────────────────────────────────
# ⚠️ GremlinGPT Fair Use Only | Commercial Use Requires License
# Built under the GremlinGPT Dual License v1.0
# © 2025 StatikFintechLLC / AscendAI Project
# Contact: ascend.gremlin@gmail.com
# ─────────────────────────────────────────────────────────────

# GremlinGPT v1.0.3 :: Unified Startup Script
# Single command to start the fully aligned StatikServer + GremlinGPT + Copilot ecosystem

import os
import sys
import asyncio
import argparse
import signal
import time
from pathlib import Path
from typing import Dict, Any, Optional

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

try:
    from core.system_coordinator import (
        UnifiedSystemCoordinator, 
        SystemConfiguration, 
        get_system_coordinator,
        initialize_unified_statik_system,
        create_default_system_config
    )
    from backend.globals import CFG, logger, resolve_path
    from utils.logging_config import setup_module_logger
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running from the GremlinGPT directory")
    sys.exit(1)

# Initialize startup logger
startup_logger = setup_module_logger("startup", "unified_startup")

class UnifiedStatikStartup:
    """
    Unified Startup Manager for StatikServer + GremlinGPT + Copilot
    
    This class orchestrates the complete system startup, ensuring all components
    are properly initialized and aligned.
    """
    
    def __init__(self, config: Optional[SystemConfiguration] = None):
        self.config = config or create_default_system_config()
        self.coordinator = None
        self.running = False
        self.startup_mode = "production"  # production, development, debug
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        startup_logger.info("[STARTUP] Unified Statik startup manager initialized")
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        startup_logger.info(f"[STARTUP] Received signal {signum}, initiating shutdown...")
        self.running = False
        if self.coordinator:
            asyncio.create_task(self.coordinator.shutdown_system())
    
    async def start_system(self, mode: str = "production") -> bool:
        """Start the complete unified system"""
        try:
            self.startup_mode = mode
            startup_logger.info(f"[STARTUP] Starting unified system in {mode} mode...")
            
            self._print_startup_header()
            
            # Pre-startup checks
            if not await self._pre_startup_checks():
                startup_logger.error("[STARTUP] Pre-startup checks failed")
                return False
            
            # Initialize system coordinator
            startup_logger.info("[STARTUP] Initializing system coordinator...")
            self.coordinator = await initialize_unified_statik_system(self.config)
            
            if not self.coordinator:
                startup_logger.error("[STARTUP] Failed to initialize system coordinator")
                return False
            
            # Wait for system initialization
            startup_logger.info("[STARTUP] Waiting for system initialization...")
            initialization_timeout = 60  # seconds
            start_time = time.time()
            
            while (time.time() - start_time) < initialization_timeout:
                status = await self.coordinator.get_system_status()
                if status.get("system_state") == "running":
                    break
                await asyncio.sleep(1)
            else:
                startup_logger.error("[STARTUP] System initialization timeout")
                return False
            
            # Post-startup setup
            await self._post_startup_setup()
            
            self.running = True
            startup_logger.info("[STARTUP] Unified system startup completed successfully")
            
            # Display system status
            await self._display_system_status()
            
            return True
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] System startup failed: {e}")
            return False
    
    async def _pre_startup_checks(self) -> bool:
        """Perform pre-startup system checks"""
        try:
            startup_logger.info("[STARTUP] Performing pre-startup checks...")
            
            checks_passed = True
            
            # Check Python environment
            if sys.version_info < (3, 8):
                startup_logger.error("[STARTUP] Python 3.8+ required")
                checks_passed = False
            
            # Check required directories
            required_dirs = [
                "backend", "core", "agent_core", "memory", 
                "nlp_engine", "data", "run/checkpoints"
            ]
            
            for dir_name in required_dirs:
                dir_path = Path(dir_name)
                if not dir_path.exists():
                    startup_logger.warning(f"[STARTUP] Creating missing directory: {dir_name}")
                    dir_path.mkdir(parents=True, exist_ok=True)
            
            # Check configuration
            if not Path("config/config.toml").exists():
                startup_logger.warning("[STARTUP] Configuration file not found, using defaults")
            
            # Check for Copilot authentication if enabled
            if self.config.enable_copilot:
                copilot_auth = Path.home() / ".statik/keys/github-token"
                if not copilot_auth.exists():
                    startup_logger.warning("[STARTUP] GitHub Copilot token not found, Copilot features may be limited")
            
            startup_logger.info(f"[STARTUP] Pre-startup checks {'passed' if checks_passed else 'failed'}")
            return checks_passed
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] Pre-startup checks error: {e}")
            return False
    
    async def _post_startup_setup(self):
        """Perform post-startup setup tasks"""
        try:
            startup_logger.info("[STARTUP] Performing post-startup setup...")
            
            # Create runtime configuration file
            await self._create_runtime_config()
            
            # Setup system monitoring
            await self._setup_system_monitoring()
            
            # Initialize VS Code integration if enabled
            if self.config.enable_vscode_integration:
                await self._setup_vscode_integration()
            
            startup_logger.info("[STARTUP] Post-startup setup completed")
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] Post-startup setup error: {e}")
    
    async def _create_runtime_config(self):
        """Create runtime configuration file"""
        try:
            runtime_config = {
                "system": {
                    "startup_time": time.time(),
                    "startup_mode": self.startup_mode,
                    "coordinator_id": self.coordinator.coordinator_id,
                    "configuration": {
                        "enable_gremlingpt": self.config.enable_gremlingpt,
                        "enable_copilot": self.config.enable_copilot,
                        "enable_fsm": self.config.enable_fsm,
                        "enable_agents": self.config.enable_agents,
                        "copilot_integration_mode": self.config.copilot_integration_mode,
                        "task_routing_mode": self.config.task_routing_mode
                    }
                },
                "services": {
                    "frontend_url": "http://localhost:3000",
                    "vscode_url": "http://localhost:8080",
                    "gremlingpt_dashboard": "http://localhost:7777",
                    "api_endpoints": {
                        "status": "/api/system/status",
                        "health": "/api/health",
                        "tasks": "/api/tasks"
                    }
                },
                "integration": {
                    "copilot_enabled": self.config.enable_copilot,
                    "fsm_agent_coordination": True,
                    "intelligent_task_routing": True
                }
            }
            
            runtime_config_file = Path("run/checkpoints/runtime_config.json")
            runtime_config_file.parent.mkdir(parents=True, exist_ok=True)
            
            import json
            with open(runtime_config_file, 'w') as f:
                json.dump(runtime_config, f, indent=2)
            
            startup_logger.info("[STARTUP] Runtime configuration created")
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] Runtime config creation failed: {e}")
    
    async def _setup_system_monitoring(self):
        """Setup system monitoring and health checks"""
        try:
            # Create monitoring configuration
            monitoring_config = {
                "health_check_interval": self.config.health_check_interval,
                "alerts_enabled": True,
                "metrics_collection": True,
                "log_aggregation": True
            }
            
            # Save monitoring config
            monitoring_file = Path("run/checkpoints/monitoring_config.json")
            import json
            with open(monitoring_file, 'w') as f:
                json.dump(monitoring_config, f, indent=2)
            
            startup_logger.info("[STARTUP] System monitoring configured")
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] System monitoring setup failed: {e}")
    
    async def _setup_vscode_integration(self):
        """Setup VS Code integration"""
        try:
            # Check if VS Code server is running
            try:
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    async with session.get("http://localhost:8080", timeout=5) as response:
                        if response.status == 200:
                            startup_logger.info("[STARTUP] VS Code server detected and accessible")
                        else:
                            startup_logger.warning("[STARTUP] VS Code server responded with non-200 status")
            except:
                startup_logger.warning("[STARTUP] VS Code server not accessible on localhost:8080")
            
            # Create VS Code workspace configuration
            vscode_config = {
                "gremlingpt": {
                    "enabled": True,
                    "coordinator_integration": True,
                    "copilot_enhancement": self.config.enable_copilot
                },
                "extensions": {
                    "recommended": [
                        "GitHub.copilot",
                        "GitHub.copilot-chat",
                        "ms-python.python"
                    ]
                }
            }
            
            vscode_config_file = Path("run/checkpoints/vscode_config.json")
            import json
            with open(vscode_config_file, 'w') as f:
                json.dump(vscode_config, f, indent=2)
            
            startup_logger.info("[STARTUP] VS Code integration configured")
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] VS Code integration setup failed: {e}")
    
    async def _display_system_status(self):
        """Display comprehensive system status"""
        try:
            status = await self.coordinator.get_system_status()
            
            print("\n" + "="*80)
            print("🚀 STATIK-SERVER + GREMLINGPT + COPILOT - UNIFIED SYSTEM READY")
            print("="*80)
            
            print(f"\n📊 System Status: {status.get('system_state', 'unknown').upper()}")
            print(f"🆔 Coordinator ID: {status.get('coordinator_id', 'unknown')}")
            print(f"⏱️  Startup Mode: {self.startup_mode}")
            
            # Component status
            components = status.get('components', {})
            healthy_count = sum(1 for c in components.values() if c.get('healthy', False))
            total_count = len(components)
            
            print(f"\n🔧 Components: {healthy_count}/{total_count} healthy")
            for name, comp in components.items():
                status_icon = "✅" if comp.get('healthy', False) else "❌"
                print(f"  {status_icon} {name}: {comp.get('state', 'unknown')}")
            
            # Configuration
            config = status.get('configuration', {})
            print(f"\n⚙️  Configuration:")
            print(f"  • GremlinGPT: {'✅' if config.get('enable_gremlingpt') else '❌'}")
            print(f"  • GitHub Copilot: {'✅' if config.get('enable_copilot') else '❌'}")
            print(f"  • FSM System: {'✅' if config.get('enable_fsm') else '❌'}")
            print(f"  • Agent System: {'✅' if config.get('enable_agents') else '❌'}")
            print(f"  • Copilot Mode: {config.get('copilot_integration_mode', 'unknown')}")
            print(f"  • Task Routing: {config.get('task_routing_mode', 'unknown')}")
            
            # Access URLs
            print(f"\n🌐 Access URLs:")
            print(f"  • Frontend Dashboard: http://localhost:3000")
            print(f"  • VS Code Server: http://localhost:8080")
            print(f"  • GremlinGPT Dashboard: http://localhost:7777")
            
            # Integration Status
            health_summary = status.get('health_summary', {})
            overall_health = health_summary.get('overall_health', 'unknown')
            health_icon = "✅" if overall_health == "healthy" else "⚠️" if overall_health == "degraded" else "❌"
            
            print(f"\n{health_icon} Overall System Health: {overall_health.upper()}")
            
            # Usage instructions
            print(f"\n📋 Next Steps:")
            print(f"  1. Open VS Code: http://localhost:8080")
            print(f"  2. Use GitHub Copilot for AI assistance")
            print(f"  3. GremlinGPT will automatically enhance your workflow")
            print(f"  4. Monitor system status with: python unified_startup.py --status")
            
            print("\n" + "="*80)
            print("System is ready! Press Ctrl+C to shutdown gracefully.")
            print("="*80 + "\n")
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] Status display failed: {e}")
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get current system status"""
        if self.coordinator:
            return await self.coordinator.get_system_status()
        else:
            return {"error": "System not initialized"}
    
    async def stop_system(self):
        """Stop the unified system"""
        try:
            startup_logger.info("[STARTUP] Stopping unified system...")
            self.running = False
            
            if self.coordinator:
                await self.coordinator.shutdown_system()
            
            startup_logger.info("[STARTUP] System stopped successfully")
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] System stop error: {e}")
    
    async def run_interactive_mode(self):
        """Run system in interactive mode"""
        try:
            startup_logger.info("[STARTUP] Starting interactive mode...")
            
            while self.running:
                try:
                    # Keep system running and handle any coordination tasks
                    if self.coordinator:
                        # Perform periodic status checks
                        status = await self.coordinator.get_system_status()
                        
                        # Check for system health issues
                        health_summary = status.get('health_summary', {})
                        if health_summary.get('overall_health') == 'degraded':
                            startup_logger.warning("[STARTUP] System health degraded, monitoring...")
                    
                    await asyncio.sleep(10)  # Check every 10 seconds
                    
                except KeyboardInterrupt:
                    startup_logger.info("[STARTUP] Keyboard interrupt received")
                    break
                except Exception as e:
                    startup_logger.error(f"[STARTUP] Interactive mode error: {e}")
                    await asyncio.sleep(5)
            
            await self.stop_system()
            
        except Exception as e:
            startup_logger.error(f"[STARTUP] Interactive mode failed: {e}")
    
    def _print_startup_header(self):
        """Print startup header"""
        print("\n" + "="*80)
        print("🧠 GREMLINGPT + COPILOT UNIFIED SYSTEM STARTUP")
        print("="*80)
        print("🎯 Aligning all components for seamless AI development...")
        print(f"⚙️  Mode: {self.startup_mode}")
        print(f"🔧 Components: GremlinGPT + GitHub Copilot + VS Code + FSM + Agents")
        print("="*80 + "\n")


async def main():
    """Main startup function"""
    parser = argparse.ArgumentParser(description="Unified StatikServer + GremlinGPT + Copilot Startup")
    parser.add_argument("--mode", choices=["production", "development", "debug"], 
                       default="production", help="Startup mode")
    parser.add_argument("--status", action="store_true", help="Show system status")
    parser.add_argument("--stop", action="store_true", help="Stop running system")
    parser.add_argument("--config", help="Path to configuration file")
    parser.add_argument("--no-copilot", action="store_true", help="Disable Copilot integration")
    parser.add_argument("--no-agents", action="store_true", help="Disable agent system")
    parser.add_argument("--task-routing", choices=["simple", "intelligent", "ml_based"],
                       default="intelligent", help="Task routing mode")
    
    args = parser.parse_args()
    
    try:
        # Create configuration
        config = create_default_system_config()
        
        # Apply command line overrides
        if args.no_copilot:
            config.enable_copilot = False
        if args.no_agents:
            config.enable_agents = False
        config.task_routing_mode = args.task_routing
        
        # Initialize startup manager
        startup_manager = UnifiedStatikStartup(config)
        
        if args.status:
            # Show status of running system
            status = await startup_manager.get_system_status()
            print("System Status:")
            import json
            print(json.dumps(status, indent=2, default=str))
            return
        
        if args.stop:
            # Stop running system
            await startup_manager.stop_system()
            print("System stopped")
            return
        
        # Start the unified system
        success = await startup_manager.start_system(args.mode)
        
        if not success:
            print("❌ System startup failed!")
            sys.exit(1)
        
        # Run in interactive mode
        await startup_manager.run_interactive_mode()
        
    except KeyboardInterrupt:
        print("\n🛑 Startup interrupted by user")
    except Exception as e:
        print(f"❌ Startup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Shutdown complete")
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)
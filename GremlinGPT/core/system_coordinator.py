#!/usr/bin/env python3

# ─────────────────────────────────────────────────────────────
# ⚠️ GremlinGPT Fair Use Only | Commercial Use Requires License
# Built under the GremlinGPT Dual License v1.0
# © 2025 StatikFintechLLC / AscendAI Project
# Contact: ascend.gremlin@gmail.com
# ─────────────────────────────────────────────────────────────

# GremlinGPT v1.0.3 :: Unified System Coordinator
# Central orchestrator that aligns all components: FSM, Agents, Copilot, VS Code

import os
import sys
import json
import time
import asyncio
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum

# Add project root to path for imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Simple logger to avoid circular imports
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
coordinator_logger = logging.getLogger("system_coordinator")

# Try to import backend globals, but handle gracefully if not available
try:
    from backend.globals import CFG, logger, resolve_path, DATA_DIR
except ImportError:
    coordinator_logger.warning("Backend globals not available, using defaults")
    CFG = {}
    resolve_path = lambda x: x
    DATA_DIR = "data"


class SystemState(Enum):
    """System-wide state enumeration"""
    INITIALIZING = "initializing"
    STARTING = "starting"
    RUNNING = "running"
    DEGRADED = "degraded"
    STOPPING = "stopping"
    STOPPED = "stopped"
    ERROR = "error"


@dataclass
class ComponentStatus:
    """Status information for a system component"""
    name: str
    state: str
    healthy: bool
    last_heartbeat: Optional[datetime] = None
    error_message: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    pid: Optional[int] = None


@dataclass
class SystemConfiguration:
    """Unified system configuration"""
    enable_gremlingpt: bool = True
    enable_copilot: bool = True
    enable_fsm: bool = True
    enable_agents: bool = True
    enable_vscode_integration: bool = True
    copilot_integration_mode: str = "enhanced"  # basic, enhanced, autonomous
    task_routing_mode: str = "intelligent"  # simple, intelligent, ml_based
    auto_start_components: List[str] = None
    health_check_interval: int = 30
    max_retry_attempts: int = 3
    

class UnifiedSystemCoordinator:
    """
    Unified System Coordinator for StatikServer + GremlinGPT + Copilot Integration
    
    This class serves as the central nervous system that:
    1. Coordinates all components (VSCode, GremlinGPT, Copilot, FSM, Agents)
    2. Routes tasks intelligently between systems
    3. Manages system health and monitoring
    4. Handles graceful startup/shutdown
    5. Provides unified configuration and status reporting
    """
    
    def __init__(self, config: Optional[SystemConfiguration] = None):
        self.config = config or SystemConfiguration()
        self.state = SystemState.INITIALIZING
        self.components: Dict[str, ComponentStatus] = {}
        self.task_queue = asyncio.Queue()
        self.event_bus = {}
        self.health_check_task = None
        self.coordinator_id = f"coordinator_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Component references
        self.fsm_system = None
        self.agent_system = None
        self.orchestrator = None
        self.copilot_integration = None
        self.vscode_server = None
        
        # State persistence
        self.state_file = Path("run/checkpoints/coordinator_state.json")
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Threading
        self.running = False
        self.async_loop = None
        self.async_thread = None
        self.coordination_lock = threading.Lock()
        
        coordinator_logger.info(f"[COORDINATOR] Initialized: {self.coordinator_id}")
        
        # Set default auto-start components if not specified
        if self.config.auto_start_components is None:
            self.config.auto_start_components = [
                "gremlingpt_core", "fsm_system", "agent_system", 
                "copilot_integration", "health_monitor"
            ]
    
    async def initialize_system(self) -> bool:
        """Initialize the complete unified system"""
        try:
            coordinator_logger.info("[COORDINATOR] Starting system initialization...")
            self.state = SystemState.STARTING
            
            # Load previous state if available
            await self._load_previous_state()
            
            # Initialize core components
            success = True
            
            if self.config.enable_gremlingpt:
                success &= await self._initialize_gremlingpt_core()
            
            if self.config.enable_fsm:
                success &= await self._initialize_fsm_system()
                
            if self.config.enable_agents:
                success &= await self._initialize_agent_system()
                
            if self.config.enable_copilot:
                success &= await self._initialize_copilot_integration()
                
            if self.config.enable_vscode_integration:
                success &= await self._initialize_vscode_integration()
            
            # Start task routing
            await self._initialize_task_routing()
            
            # Start health monitoring
            await self._start_health_monitoring()
            
            # Start inter-component communication
            await self._setup_component_communication()
            
            if success:
                self.state = SystemState.RUNNING
                coordinator_logger.info("[COORDINATOR] System initialization completed successfully")
                await self._save_state()
                return True
            else:
                self.state = SystemState.ERROR
                coordinator_logger.error("[COORDINATOR] System initialization failed")
                return False
                
        except Exception as e:
            self.state = SystemState.ERROR
            coordinator_logger.error(f"[COORDINATOR] Initialization error: {e}")
            return False
    
    async def _initialize_gremlingpt_core(self) -> bool:
        """Initialize GremlinGPT core components"""
        try:
            coordinator_logger.info("[COORDINATOR] Initializing GremlinGPT core...")
            
            # Import and initialize orchestrator
            from core.orchestrator import get_global_orchestrator
            self.orchestrator = get_global_orchestrator()
            
            self.components["gremlingpt_core"] = ComponentStatus(
                name="gremlingpt_core",
                state="running",
                healthy=True,
                last_heartbeat=datetime.now(timezone.utc)
            )
            
            coordinator_logger.info("[COORDINATOR] GremlinGPT core initialized")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] GremlinGPT core initialization failed: {e}")
            self.components["gremlingpt_core"] = ComponentStatus(
                name="gremlingpt_core",
                state="error",
                healthy=False,
                error_message=str(e)
            )
            return False
    
    async def _initialize_fsm_system(self) -> bool:
        """Initialize FSM system with coordinator integration"""
        try:
            coordinator_logger.info("[COORDINATOR] Initializing FSM system...")
            
            # Import FSM components
            from agent_core import fsm
            
            # Store original FSM functions for integration
            self.original_fsm_loop = fsm.fsm_loop
            self.original_route_task = getattr(fsm, 'route_task', None)
            
            # Wrap FSM loop with coordinator integration
            fsm.fsm_loop = self._coordinated_fsm_loop
            
            self.fsm_system = fsm
            
            self.components["fsm_system"] = ComponentStatus(
                name="fsm_system",
                state="running",
                healthy=True,
                last_heartbeat=datetime.now(timezone.utc)
            )
            
            coordinator_logger.info("[COORDINATOR] FSM system initialized and integrated")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] FSM system initialization failed: {e}")
            self.components["fsm_system"] = ComponentStatus(
                name="fsm_system",
                state="error",
                healthy=False,
                error_message=str(e)
            )
            return False
    
    async def _initialize_agent_system(self) -> bool:
        """Initialize agent system"""
        try:
            coordinator_logger.info("[COORDINATOR] Initializing agent system...")
            
            # Import and initialize agent coordinator
            from core.integration import get_unified_system
            self.agent_system = get_unified_system()
            
            # Initialize the unified system
            await self.agent_system.initialize_unified_system()
            
            self.components["agent_system"] = ComponentStatus(
                name="agent_system",
                state="running",
                healthy=True,
                last_heartbeat=datetime.now(timezone.utc)
            )
            
            coordinator_logger.info("[COORDINATOR] Agent system initialized")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Agent system initialization failed: {e}")
            self.components["agent_system"] = ComponentStatus(
                name="agent_system",
                state="error",
                healthy=False,
                error_message=str(e)
            )
            return False
    
    async def _initialize_copilot_integration(self) -> bool:
        """Initialize Copilot integration"""
        try:
            coordinator_logger.info("[COORDINATOR] Initializing Copilot integration...")
            
            # Create Copilot integration adapter
            self.copilot_integration = CopilotIntegrationAdapter(self)
            await self.copilot_integration.initialize()
            
            self.components["copilot_integration"] = ComponentStatus(
                name="copilot_integration",
                state="running",
                healthy=True,
                last_heartbeat=datetime.now(timezone.utc)
            )
            
            coordinator_logger.info("[COORDINATOR] Copilot integration initialized")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Copilot integration failed: {e}")
            self.components["copilot_integration"] = ComponentStatus(
                name="copilot_integration",
                state="error",
                healthy=False,
                error_message=str(e)
            )
            return False
    
    async def _initialize_vscode_integration(self) -> bool:
        """Initialize VS Code server integration"""
        try:
            coordinator_logger.info("[COORDINATOR] Initializing VS Code integration...")
            
            # Check if VS Code server is running
            vscode_status = await self._check_vscode_server_status()
            
            self.components["vscode_server"] = ComponentStatus(
                name="vscode_server",
                state="running" if vscode_status else "stopped",
                healthy=vscode_status,
                last_heartbeat=datetime.now(timezone.utc)
            )
            
            coordinator_logger.info(f"[COORDINATOR] VS Code integration initialized (status: {vscode_status})")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] VS Code integration failed: {e}")
            self.components["vscode_server"] = ComponentStatus(
                name="vscode_server",
                state="error",
                healthy=False,
                error_message=str(e)
            )
            return False
    
    async def _initialize_task_routing(self) -> bool:
        """Initialize intelligent task routing"""
        try:
            coordinator_logger.info("[COORDINATOR] Initializing task routing...")
            
            # Create task router based on configuration
            self.task_router = TaskRouter(self, mode=self.config.task_routing_mode)
            await self.task_router.initialize()
            
            coordinator_logger.info("[COORDINATOR] Task routing initialized")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Task routing initialization failed: {e}")
            return False
    
    async def _start_health_monitoring(self) -> bool:
        """Start system health monitoring"""
        try:
            coordinator_logger.info("[COORDINATOR] Starting health monitoring...")
            
            self.health_check_task = asyncio.create_task(self._health_check_loop())
            
            self.components["health_monitor"] = ComponentStatus(
                name="health_monitor",
                state="running",
                healthy=True,
                last_heartbeat=datetime.now(timezone.utc)
            )
            
            coordinator_logger.info("[COORDINATOR] Health monitoring started")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Health monitoring startup failed: {e}")
            return False
    
    async def _setup_component_communication(self) -> bool:
        """Setup inter-component communication channels"""
        try:
            coordinator_logger.info("[COORDINATOR] Setting up component communication...")
            
            # Initialize event bus for component communication
            self.event_bus = {
                "fsm_to_agents": asyncio.Queue(),
                "agents_to_fsm": asyncio.Queue(),
                "copilot_to_gremlin": asyncio.Queue(),
                "gremlin_to_copilot": asyncio.Queue(),
                "system_events": asyncio.Queue()
            }
            
            # Start communication processors
            asyncio.create_task(self._process_communication_channels())
            
            coordinator_logger.info("[COORDINATOR] Component communication setup completed")
            return True
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Component communication setup failed: {e}")
            return False
    
    def _coordinated_fsm_loop(self):
        """FSM loop wrapper that integrates with coordinator"""
        try:
            # Pre-FSM coordination check
            if self.task_router:
                self.task_router.handle_pre_fsm_cycle()
            
            # Execute original FSM loop
            result = self.original_fsm_loop() if self.original_fsm_loop else None
            
            # Post-FSM coordination
            if self.task_router:
                self.task_router.handle_post_fsm_cycle(result)
            
            # Update FSM component heartbeat
            if "fsm_system" in self.components:
                self.components["fsm_system"].last_heartbeat = datetime.now(timezone.utc)
            
            return result
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Coordinated FSM loop error: {e}")
            # Fallback to original FSM loop
            return self.original_fsm_loop() if self.original_fsm_loop else None
    
    async def _health_check_loop(self):
        """Continuous health monitoring loop"""
        while self.running:
            try:
                await self._perform_health_checks()
                await asyncio.sleep(self.config.health_check_interval)
            except Exception as e:
                coordinator_logger.error(f"[COORDINATOR] Health check error: {e}")
                await asyncio.sleep(5)  # Brief pause before retry
    
    async def _perform_health_checks(self):
        """Perform health checks on all components"""
        now = datetime.now(timezone.utc)
        
        for component_name, status in self.components.items():
            try:
                # Check if component has recent heartbeat
                if status.last_heartbeat:
                    time_since_heartbeat = (now - status.last_heartbeat).total_seconds()
                    if time_since_heartbeat > (self.config.health_check_interval * 2):
                        status.healthy = False
                        status.error_message = f"No heartbeat for {time_since_heartbeat}s"
                
                # Component-specific health checks
                if component_name == "vscode_server":
                    vscode_healthy = await self._check_vscode_server_status()
                    status.healthy = vscode_healthy
                    status.state = "running" if vscode_healthy else "stopped"
                
                # Update component status
                if status.healthy and status.state in ["error", "stopped"]:
                    status.state = "running"
                elif not status.healthy and status.state == "running":
                    status.state = "degraded"
                    
            except Exception as e:
                coordinator_logger.error(f"[COORDINATOR] Health check failed for {component_name}: {e}")
                status.healthy = False
                status.error_message = str(e)
    
    async def _check_vscode_server_status(self) -> bool:
        """Check if VS Code server is running"""
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get("http://localhost:8080", timeout=5) as response:
                    return response.status == 200
        except:
            return False
    
    async def _process_communication_channels(self):
        """Process inter-component communication"""
        while self.running:
            try:
                # Process each communication channel
                for channel_name, queue in self.event_bus.items():
                    try:
                        # Non-blocking queue check
                        if not queue.empty():
                            message = await asyncio.wait_for(queue.get(), timeout=0.1)
                            await self._handle_component_message(channel_name, message)
                    except asyncio.TimeoutError:
                        continue  # No messages in this channel
                    except Exception as e:
                        coordinator_logger.error(f"[COORDINATOR] Communication error in {channel_name}: {e}")
                
                await asyncio.sleep(0.1)  # Brief pause
                
            except Exception as e:
                coordinator_logger.error(f"[COORDINATOR] Communication processing error: {e}")
                await asyncio.sleep(1)
    
    async def _handle_component_message(self, channel: str, message: Dict[str, Any]):
        """Handle messages between components"""
        try:
            if channel == "fsm_to_agents" and self.agent_system:
                # Route FSM tasks to appropriate agents
                await self.agent_system.inject_agent_task_to_fsm(message)
                
            elif channel == "agents_to_fsm" and self.fsm_system:
                # Route agent results back to FSM
                # Implementation depends on FSM task injection mechanism
                pass
                
            elif channel == "copilot_to_gremlin" and self.copilot_integration:
                # Handle Copilot suggestions to GremlinGPT
                await self.copilot_integration.handle_copilot_to_gremlin(message)
                
            elif channel == "gremlin_to_copilot" and self.copilot_integration:
                # Handle GremlinGPT context to Copilot
                await self.copilot_integration.handle_gremlin_to_copilot(message)
                
            elif channel == "system_events":
                # Handle system-wide events
                await self._handle_system_event(message)
                
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Message handling error in {channel}: {e}")
    
    async def _handle_system_event(self, event: Dict[str, Any]):
        """Handle system-wide events"""
        event_type = event.get("type", "unknown")
        
        if event_type == "shutdown_request":
            coordinator_logger.info("[COORDINATOR] Shutdown request received")
            await self.shutdown_system()
            
        elif event_type == "restart_component":
            component_name = event.get("component")
            if component_name:
                await self._restart_component(component_name)
                
        elif event_type == "configuration_update":
            await self._reload_configuration(event.get("config", {}))
    
    async def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        try:
            status = {
                "coordinator_id": self.coordinator_id,
                "system_state": self.state.value,
                "uptime": time.time() - (self.components.get("gremlingpt_core", {}).last_heartbeat.timestamp() if self.components.get("gremlingpt_core", {}).last_heartbeat else time.time()),
                "components": {},
                "configuration": {
                    "enable_gremlingpt": self.config.enable_gremlingpt,
                    "enable_copilot": self.config.enable_copilot,
                    "enable_fsm": self.config.enable_fsm,
                    "enable_agents": self.config.enable_agents,
                    "copilot_integration_mode": self.config.copilot_integration_mode,
                    "task_routing_mode": self.config.task_routing_mode
                },
                "health_summary": {
                    "total_components": len(self.components),
                    "healthy_components": sum(1 for c in self.components.values() if c.healthy),
                    "degraded_components": sum(1 for c in self.components.values() if not c.healthy),
                    "overall_health": "healthy" if all(c.healthy for c in self.components.values()) else "degraded"
                },
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            # Add component details
            for name, component in self.components.items():
                status["components"][name] = {
                    "state": component.state,
                    "healthy": component.healthy,
                    "last_heartbeat": component.last_heartbeat.isoformat() if component.last_heartbeat else None,
                    "error_message": component.error_message,
                    "metrics": component.metrics,
                    "pid": component.pid
                }
            
            return status
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Status collection failed: {e}")
            return {"error": str(e), "timestamp": datetime.now(timezone.utc).isoformat()}
    
    async def execute_coordinated_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task through the coordinated system"""
        try:
            if self.task_router:
                return await self.task_router.route_task(task)
            else:
                return {"error": "Task router not available", "task": task}
                
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Task execution failed: {e}")
            return {"error": str(e), "task": task}
    
    async def shutdown_system(self):
        """Gracefully shutdown the entire system"""
        try:
            coordinator_logger.info("[COORDINATOR] Starting system shutdown...")
            self.state = SystemState.STOPPING
            self.running = False
            
            # Cancel health monitoring
            if self.health_check_task:
                self.health_check_task.cancel()
            
            # Shutdown components in reverse order
            if self.agent_system:
                await self.agent_system.shutdown_unified_system()
            
            if self.copilot_integration:
                await self.copilot_integration.shutdown()
            
            # Restore original FSM functions
            if self.fsm_system and hasattr(self, 'original_fsm_loop'):
                self.fsm_system.fsm_loop = self.original_fsm_loop
            
            # Save final state
            await self._save_state()
            
            self.state = SystemState.STOPPED
            coordinator_logger.info("[COORDINATOR] System shutdown completed")
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Shutdown error: {e}")
            self.state = SystemState.ERROR
    
    async def _save_state(self):
        """Save current system state"""
        try:
            state_data = {
                "coordinator_id": self.coordinator_id,
                "state": self.state.value,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "components": {
                    name: {
                        "state": comp.state,
                        "healthy": comp.healthy,
                        "last_heartbeat": comp.last_heartbeat.isoformat() if comp.last_heartbeat else None,
                        "error_message": comp.error_message
                    }
                    for name, comp in self.components.items()
                },
                "configuration": {
                    "enable_gremlingpt": self.config.enable_gremlingpt,
                    "enable_copilot": self.config.enable_copilot,
                    "enable_fsm": self.config.enable_fsm,
                    "enable_agents": self.config.enable_agents,
                    "copilot_integration_mode": self.config.copilot_integration_mode,
                    "task_routing_mode": self.config.task_routing_mode
                }
            }
            
            with open(self.state_file, 'w') as f:
                json.dump(state_data, f, indent=2)
                
            coordinator_logger.debug("[COORDINATOR] State saved successfully")
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] State save failed: {e}")
    
    async def _load_previous_state(self):
        """Load previous system state if available"""
        try:
            if self.state_file.exists():
                with open(self.state_file, 'r') as f:
                    state_data = json.load(f)
                
                coordinator_logger.info(f"[COORDINATOR] Loaded previous state from {state_data.get('timestamp', 'unknown')}")
                
        except Exception as e:
            coordinator_logger.warning(f"[COORDINATOR] Could not load previous state: {e}")
    
    def start_async_coordination(self):
        """Start async coordination in separate thread"""
        try:
            def run_async_loop():
                self.async_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(self.async_loop)
                self.running = True
                
                try:
                    # Initialize system
                    self.async_loop.run_until_complete(self.initialize_system())
                    
                    # Keep loop running
                    self.async_loop.run_forever()
                except Exception as e:
                    coordinator_logger.error(f"[COORDINATOR] Async loop error: {e}")
                finally:
                    self.async_loop.close()
            
            self.async_thread = threading.Thread(target=run_async_loop, daemon=True)
            self.async_thread.start()
            
            coordinator_logger.info("[COORDINATOR] Async coordination thread started")
            
        except Exception as e:
            coordinator_logger.error(f"[COORDINATOR] Async coordination startup failed: {e}")


class CopilotIntegrationAdapter:
    """Adapter for integrating GitHub Copilot with GremlinGPT"""
    
    def __init__(self, coordinator: UnifiedSystemCoordinator):
        self.coordinator = coordinator
        self.integration_mode = coordinator.config.copilot_integration_mode
        self.active = False
        
    async def initialize(self):
        """Initialize Copilot integration"""
        try:
            coordinator_logger.info(f"[COPILOT] Initializing integration (mode: {self.integration_mode})")
            
            # Check if Copilot is available in VS Code
            copilot_available = await self._check_copilot_availability()
            
            if copilot_available:
                self.active = True
                coordinator_logger.info("[COPILOT] Integration initialized successfully")
            else:
                coordinator_logger.warning("[COPILOT] Copilot not detected, integration disabled")
            
        except Exception as e:
            coordinator_logger.error(f"[COPILOT] Integration initialization failed: {e}")
    
    async def _check_copilot_availability(self) -> bool:
        """Check if Copilot is available"""
        try:
            # Check for Copilot configuration or authentication
            copilot_auth_file = Path.home() / ".statik/keys/github-token"
            return copilot_auth_file.exists()
        except:
            return False
    
    async def handle_copilot_to_gremlin(self, message: Dict[str, Any]):
        """Handle messages from Copilot to GremlinGPT"""
        try:
            if not self.active:
                return
            
            message_type = message.get("type", "suggestion")
            
            if message_type == "suggestion" and self.coordinator.agent_system:
                # Convert Copilot suggestion to GremlinGPT task
                gremlin_task = {
                    "type": "analyze_copilot_suggestion",
                    "source": "copilot",
                    "suggestion": message.get("content", ""),
                    "context": message.get("context", {}),
                    "priority": "normal"
                }
                
                # Route to appropriate agent
                await self.coordinator.agent_system.execute_unified_workflow(
                    "copilot_integration", gremlin_task
                )
                
        except Exception as e:
            coordinator_logger.error(f"[COPILOT] Copilot to GremlinGPT handling failed: {e}")
    
    async def handle_gremlin_to_copilot(self, message: Dict[str, Any]):
        """Handle messages from GremlinGPT to Copilot"""
        try:
            if not self.active:
                return
            
            # Enhance Copilot context with GremlinGPT insights
            context_enhancement = {
                "gremlin_analysis": message.get("analysis", {}),
                "system_state": message.get("system_state", {}),
                "recommendations": message.get("recommendations", [])
            }
            
            # Store context for Copilot access
            context_file = Path("run/checkpoints/copilot_context.json")
            with open(context_file, 'w') as f:
                json.dump(context_enhancement, f, indent=2)
                
        except Exception as e:
            coordinator_logger.error(f"[COPILOT] GremlinGPT to Copilot handling failed: {e}")
    
    async def shutdown(self):
        """Shutdown Copilot integration"""
        self.active = False
        coordinator_logger.info("[COPILOT] Integration shutdown completed")


class TaskRouter:
    """Intelligent task router for coordinated system"""
    
    def __init__(self, coordinator: UnifiedSystemCoordinator, mode: str = "intelligent"):
        self.coordinator = coordinator
        self.mode = mode
        self.routing_rules = {}
        self.task_history = []
        
    async def initialize(self):
        """Initialize task router"""
        try:
            coordinator_logger.info(f"[ROUTER] Initializing task router (mode: {self.mode})")
            
            # Load routing rules based on mode
            await self._load_routing_rules()
            
            coordinator_logger.info("[ROUTER] Task router initialized")
            
        except Exception as e:
            coordinator_logger.error(f"[ROUTER] Task router initialization failed: {e}")
    
    async def _load_routing_rules(self):
        """Load task routing rules"""
        try:
            # Define routing rules based on task types
            self.routing_rules = {
                "nlp_task": "agent_system",
                "trading_analysis": "agent_system", 
                "scraping_task": "fsm_system",
                "memory_task": "gremlingpt_core",
                "copilot_suggestion": "copilot_integration",
                "system_command": "coordinator",
                "default": "fsm_system"
            }
            
        except Exception as e:
            coordinator_logger.error(f"[ROUTER] Routing rules loading failed: {e}")
    
    async def route_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Route task to appropriate system component"""
        try:
            task_type = task.get("type", "default")
            target_system = self.routing_rules.get(task_type, self.routing_rules["default"])
            
            coordinator_logger.debug(f"[ROUTER] Routing {task_type} to {target_system}")
            
            # Route to appropriate system
            if target_system == "agent_system" and self.coordinator.agent_system:
                return await self.coordinator.agent_system.execute_unified_workflow(
                    task_type, task.get("data", {})
                )
            elif target_system == "fsm_system" and self.coordinator.fsm_system:
                # Route to FSM system
                return await self._route_to_fsm(task)
            elif target_system == "copilot_integration" and self.coordinator.copilot_integration:
                return await self._route_to_copilot(task)
            else:
                return {"error": f"Target system {target_system} not available", "task": task}
                
        except Exception as e:
            coordinator_logger.error(f"[ROUTER] Task routing failed: {e}")
            return {"error": str(e), "task": task}
    
    async def _route_to_fsm(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Route task to FSM system"""
        try:
            # Convert task to FSM format and inject
            fsm_task = {
                "type": task.get("type", "general"),
                "data": task.get("data", {}),
                "source": "coordinator",
                "priority": task.get("priority", "normal")
            }
            
            # Use existing FSM task injection mechanism
            from agent_core.fsm import enqueue_task
            enqueue_task(fsm_task)
            
            return {"status": "routed_to_fsm", "task": fsm_task}
            
        except Exception as e:
            return {"error": f"FSM routing failed: {e}", "task": task}
    
    async def _route_to_copilot(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Route task to Copilot integration"""
        try:
            if self.coordinator.copilot_integration:
                await self.coordinator.copilot_integration.handle_copilot_to_gremlin(task)
                return {"status": "routed_to_copilot", "task": task}
            else:
                return {"error": "Copilot integration not available", "task": task}
                
        except Exception as e:
            return {"error": f"Copilot routing failed: {e}", "task": task}
    
    def handle_pre_fsm_cycle(self):
        """Handle pre-FSM cycle coordination"""
        try:
            # Check for pending agent tasks to inject into FSM
            if self.coordinator.agent_system:
                # This would check for completed agent tasks to inject back to FSM
                pass
                
        except Exception as e:
            coordinator_logger.error(f"[ROUTER] Pre-FSM cycle handling failed: {e}")
    
    def handle_post_fsm_cycle(self, result):
        """Handle post-FSM cycle coordination"""
        try:
            # Analyze FSM cycle results for agent system feedback
            if result and self.coordinator.agent_system:
                # This would send FSM results to learning agents
                pass
                
        except Exception as e:
            coordinator_logger.error(f"[ROUTER] Post-FSM cycle handling failed: {e}")


# Global coordinator instance
_system_coordinator = None


def get_system_coordinator(config: Optional[SystemConfiguration] = None) -> UnifiedSystemCoordinator:
    """Get the global system coordinator instance"""
    global _system_coordinator
    if _system_coordinator is None:
        _system_coordinator = UnifiedSystemCoordinator(config)
    return _system_coordinator


async def initialize_unified_statik_system(config: Optional[SystemConfiguration] = None) -> UnifiedSystemCoordinator:
    """Initialize the complete unified Statik-Server system"""
    coordinator = get_system_coordinator(config)
    
    # Start async coordination
    coordinator.start_async_coordination()
    
    # Give coordination thread time to start
    await asyncio.sleep(2)
    
    return coordinator


def create_default_system_config() -> SystemConfiguration:
    """Create default system configuration"""
    return SystemConfiguration(
        enable_gremlingpt=True,
        enable_copilot=True,
        enable_fsm=True,
        enable_agents=True,
        enable_vscode_integration=True,
        copilot_integration_mode="enhanced",
        task_routing_mode="intelligent",
        auto_start_components=[
            "gremlingpt_core", "fsm_system", "agent_system", 
            "copilot_integration", "health_monitor"
        ],
        health_check_interval=30,
        max_retry_attempts=3
    )


if __name__ == "__main__":
    async def test_system_coordinator():
        """Test the unified system coordinator"""
        config = create_default_system_config()
        coordinator = await initialize_unified_statik_system(config)
        
        # Wait for initialization
        await asyncio.sleep(5)
        
        # Get system status
        status = await coordinator.get_system_status()
        print("System Status:")
        print(json.dumps(status, indent=2, default=str))
        
        # Test task execution
        test_task = {
            "type": "nlp_task",
            "data": {"text": "Test coordination between systems"},
            "priority": "normal"
        }
        
        result = await coordinator.execute_coordinated_task(test_task)
        print("\nTask Execution Result:")
        print(json.dumps(result, indent=2, default=str))
        
        # Shutdown
        await coordinator.shutdown_system()
    
    asyncio.run(test_system_coordinator())
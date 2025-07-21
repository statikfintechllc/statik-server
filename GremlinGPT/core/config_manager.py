#!/usr/bin/env python3

# ─────────────────────────────────────────────────────────────
# ⚠️ GremlinGPT Fair Use Only | Commercial Use Requires License
# Built under the GremlinGPT Dual License v1.0
# © 2025 StatikFintechLLC / AscendAI Project
# Contact: ascend.gremlin@gmail.com
# ─────────────────────────────────────────────────────────────

# GremlinGPT v1.0.3 :: Unified Configuration Manager
# Consolidates and manages all system configuration from multiple sources

import os
import sys
import json
import toml
from pathlib import Path
from typing import Dict, Any, Optional, Union, List
from dataclasses import dataclass, field
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Simple logger setup to avoid circular imports
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
config_logger = logging.getLogger("config_manager")


@dataclass
class VSCodeConfig:
    """VS Code specific configuration"""
    server_port: int = 8080
    auth_enabled: bool = False
    extensions_dir: str = "~/.vscode-server/extensions"
    user_data_dir: str = "~/.vscode-server"
    workspace_trust_disabled: bool = True
    telemetry_disabled: bool = True
    copilot_enabled: bool = True
    copilot_chat_enabled: bool = True


@dataclass
class CopilotConfig:
    """GitHub Copilot configuration"""
    enabled: bool = True
    auth_provider: str = "github"
    token_path: str = "~/.statik/keys/github-token"
    chat_enabled: bool = True
    advanced_features: bool = True
    integration_mode: str = "enhanced"  # basic, enhanced, autonomous
    gremlingpt_coordination: bool = True


@dataclass
class GremlinGPTConfig:
    """GremlinGPT system configuration"""
    enabled: bool = True
    fsm_enabled: bool = True
    agents_enabled: bool = True
    orchestrator_enabled: bool = True
    memory_enabled: bool = True
    nlp_enabled: bool = True
    trading_enabled: bool = True
    scraper_enabled: bool = True
    dashboard_enabled: bool = True
    api_port: int = 7777
    auto_start: bool = True


@dataclass
class NetworkConfig:
    """Network and connectivity configuration"""
    frontend_port: int = 3000
    vscode_port: int = 8080
    gremlingpt_port: int = 7777
    api_port: int = 8000
    tailscale_enabled: bool = True
    ngrok_enabled: bool = False
    cors_origins: List[str] = field(default_factory=lambda: ["*"])
    ssl_enabled: bool = False
    
    
@dataclass
class SystemPaths:
    """System paths configuration"""
    base_dir: str = "."
    data_dir: str = "data"
    logs_dir: str = "data/logs"
    config_dir: str = "config"
    memory_dir: str = "memory"
    models_dir: str = "nlp_engine"
    checkpoints_dir: str = "run/checkpoints"
    vector_store_path: str = "memory/vector_store"
    faiss_path: str = "memory/vector_store/faiss"
    chroma_path: str = "memory/vector_store/chroma"


@dataclass
class SecurityConfig:
    """Security configuration"""
    secret_key: str = "SFTi_default_key_change_in_production"
    session_cookie_name: str = "gremlin_session"
    auth_required: bool = False
    github_token_required: bool = True
    api_key_required: bool = False
    
    
@dataclass
class IntegrationConfig:
    """Integration configuration between components"""
    fsm_agent_coordination: bool = True
    copilot_gremlin_sync: bool = True
    intelligent_task_routing: bool = True
    auto_workflow_triggers: bool = True
    cross_component_communication: bool = True
    unified_logging: bool = True


class UnifiedConfigurationManager:
    """
    Unified Configuration Manager for StatikServer + GremlinGPT + Copilot
    
    This class consolidates configuration from multiple sources:
    1. config.toml (GremlinGPT main config)
    2. package.json (VS Code server config)
    3. Environment variables
    4. Command line arguments
    5. Runtime overrides
    
    Provides a single source of truth for system configuration.
    """
    
    def __init__(self, config_dir: Optional[str] = None):
        self.config_dir = Path(config_dir) if config_dir else Path("config")
        self.config_sources = {}
        self.unified_config = {}
        self.config_loaded = False
        self.config_file_paths = {
            "main_config": self.config_dir / "config.toml",
            "vscode_config": Path("package.json"),
            "runtime_config": Path("run/checkpoints/runtime_config.json"),
            "user_config": Path.home() / ".statik-server/config.json",
            "environment_config": None  # Loaded from env vars
        }
        
        # Component configurations
        self.vscode: VSCodeConfig = VSCodeConfig()
        self.copilot: CopilotConfig = CopilotConfig()
        self.gremlingpt: GremlinGPTConfig = GremlinGPTConfig()
        self.network: NetworkConfig = NetworkConfig()
        self.paths: SystemPaths = SystemPaths()
        self.security: SecurityConfig = SecurityConfig()
        self.integration: IntegrationConfig = IntegrationConfig()
        
        config_logger.info("[CONFIG] Unified configuration manager initialized")
    
    def load_configuration(self) -> bool:
        """Load configuration from all sources"""
        try:
            config_logger.info("[CONFIG] Loading configuration from all sources...")
            
            # Load from each source
            self._load_main_config()
            self._load_vscode_config()
            self._load_environment_config()
            self._load_runtime_config()
            self._load_user_config()
            
            # Merge configurations with precedence
            self._merge_configurations()
            
            # Apply merged config to component configurations
            self._apply_unified_config()
            
            # Validate configuration
            self._validate_configuration()
            
            # Create missing directories
            self._ensure_directories()
            
            self.config_loaded = True
            config_logger.info("[CONFIG] Configuration loaded successfully")
            return True
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Configuration loading failed: {e}")
            return False
    
    def _load_main_config(self):
        """Load main GremlinGPT configuration from config.toml"""
        try:
            if self.config_file_paths["main_config"].exists():
                with open(self.config_file_paths["main_config"], 'r') as f:
                    main_config = toml.load(f)
                
                self.config_sources["main"] = main_config
                config_logger.info("[CONFIG] Loaded main configuration from config.toml")
            else:
                config_logger.warning("[CONFIG] Main config.toml not found, using defaults")
                self.config_sources["main"] = {}
                
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to load main config: {e}")
            self.config_sources["main"] = {}
    
    def _load_vscode_config(self):
        """Load VS Code configuration from package.json"""
        try:
            if self.config_file_paths["vscode_config"].exists():
                with open(self.config_file_paths["vscode_config"], 'r') as f:
                    package_config = json.load(f)
                
                # Extract VS Code relevant configuration
                vscode_config = {
                    "name": package_config.get("name", "code-oss-dev"),
                    "version": package_config.get("version", "1.103.0"),
                    "scripts": package_config.get("scripts", {}),
                    "dependencies": package_config.get("dependencies", {})
                }
                
                self.config_sources["vscode"] = vscode_config
                config_logger.info("[CONFIG] Loaded VS Code configuration from package.json")
            else:
                config_logger.warning("[CONFIG] package.json not found")
                self.config_sources["vscode"] = {}
                
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to load VS Code config: {e}")
            self.config_sources["vscode"] = {}
    
    def _load_environment_config(self):
        """Load configuration from environment variables"""
        try:
            env_config = {}
            
            # Define environment variable mappings
            env_mappings = {
                "STATIK_COPILOT_ENABLED": ("copilot", "enabled"),
                "STATIK_GREMLINGPT_ENABLED": ("gremlingpt", "enabled"),
                "STATIK_FSM_ENABLED": ("gremlingpt", "fsm_enabled"),
                "STATIK_AGENTS_ENABLED": ("gremlingpt", "agents_enabled"),
                "STATIK_FRONTEND_PORT": ("network", "frontend_port"),
                "STATIK_VSCODE_PORT": ("network", "vscode_port"),
                "STATIK_GREMLINGPT_PORT": ("network", "gremlingpt_port"),
                "STATIK_API_PORT": ("network", "api_port"),
                "STATIK_SECRET_KEY": ("security", "secret_key"),
                "GITHUB_TOKEN": ("copilot", "github_token"),
                "STATIK_DEBUG": ("system", "debug"),
                "STATIK_LOG_LEVEL": ("system", "log_level"),
                "TAILSCALE_AUTHKEY": ("network", "tailscale_authkey"),
                "NGROK_AUTHTOKEN": ("network", "ngrok_authtoken")
            }
            
            for env_var, (section, key) in env_mappings.items():
                value = os.getenv(env_var)
                if value is not None:
                    if section not in env_config:
                        env_config[section] = {}
                    
                    # Type conversion
                    if key.endswith("_port") or key.endswith("_enabled"):
                        try:
                            if key.endswith("_enabled"):
                                env_config[section][key] = value.lower() in ("true", "1", "yes", "on")
                            else:
                                env_config[section][key] = int(value)
                        except ValueError:
                            env_config[section][key] = value
                    else:
                        env_config[section][key] = value
            
            self.config_sources["environment"] = env_config
            if env_config:
                config_logger.info(f"[CONFIG] Loaded {len(env_config)} environment variables")
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to load environment config: {e}")
            self.config_sources["environment"] = {}
    
    def _load_runtime_config(self):
        """Load runtime configuration"""
        try:
            if self.config_file_paths["runtime_config"].exists():
                with open(self.config_file_paths["runtime_config"], 'r') as f:
                    runtime_config = json.load(f)
                
                self.config_sources["runtime"] = runtime_config
                config_logger.info("[CONFIG] Loaded runtime configuration")
            else:
                self.config_sources["runtime"] = {}
                
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to load runtime config: {e}")
            self.config_sources["runtime"] = {}
    
    def _load_user_config(self):
        """Load user-specific configuration"""
        try:
            if self.config_file_paths["user_config"].exists():
                with open(self.config_file_paths["user_config"], 'r') as f:
                    user_config = json.load(f)
                
                self.config_sources["user"] = user_config
                config_logger.info("[CONFIG] Loaded user configuration")
            else:
                self.config_sources["user"] = {}
                
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to load user config: {e}")
            self.config_sources["user"] = {}
    
    def _merge_configurations(self):
        """Merge configurations with precedence order"""
        try:
            # Precedence order (highest to lowest):
            # 1. Environment variables
            # 2. Runtime config
            # 3. User config
            # 4. Main config
            # 5. VS Code config (for VS Code specific settings)
            
            self.unified_config = {}
            
            # Start with VS Code config (lowest precedence)
            self._deep_merge(self.unified_config, self.config_sources.get("vscode", {}))
            
            # Merge main config
            self._deep_merge(self.unified_config, self.config_sources.get("main", {}))
            
            # Merge user config
            self._deep_merge(self.unified_config, self.config_sources.get("user", {}))
            
            # Merge runtime config
            self._deep_merge(self.unified_config, self.config_sources.get("runtime", {}))
            
            # Merge environment config (highest precedence)
            self._deep_merge(self.unified_config, self.config_sources.get("environment", {}))
            
            config_logger.info("[CONFIG] Configuration sources merged successfully")
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Configuration merging failed: {e}")
    
    def _deep_merge(self, base: Dict[str, Any], override: Dict[str, Any]):
        """Deep merge two dictionaries"""
        for key, value in override.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._deep_merge(base[key], value)
            else:
                base[key] = value
    
    def _apply_unified_config(self):
        """Apply unified configuration to component configurations"""
        try:
            # Apply VS Code configuration
            vscode_config = self.unified_config.get("vscode", {})
            if "server_port" in vscode_config:
                self.vscode.server_port = vscode_config["server_port"]
            if "auth_enabled" in vscode_config:
                self.vscode.auth_enabled = vscode_config["auth_enabled"]
            
            # Apply Copilot configuration
            copilot_config = self.unified_config.get("copilot", {})
            if "enabled" in copilot_config:
                # Handle string to boolean conversion
                enabled_val = copilot_config["enabled"]
                if isinstance(enabled_val, str):
                    self.copilot.enabled = enabled_val.lower() in ("true", "1", "yes", "on")
                else:
                    self.copilot.enabled = bool(enabled_val)
            if "integration_mode" in copilot_config:
                self.copilot.integration_mode = copilot_config["integration_mode"]
            if "github_token" in copilot_config:
                # Store token securely
                self._store_github_token(copilot_config["github_token"])
            
            # Apply GremlinGPT configuration
            gremlingpt_config = self.unified_config.get("gremlingpt", {})
            if "enabled" in gremlingpt_config:
                self.gremlingpt.enabled = gremlingpt_config["enabled"]
            if "fsm_enabled" in gremlingpt_config:
                self.gremlingpt.fsm_enabled = gremlingpt_config["fsm_enabled"]
            if "agents_enabled" in gremlingpt_config:
                self.gremlingpt.agents_enabled = gremlingpt_config["agents_enabled"]
            
            # Apply Network configuration
            network_config = self.unified_config.get("network", {})
            if "frontend_port" in network_config:
                self.network.frontend_port = network_config["frontend_port"]
            if "vscode_port" in network_config:
                self.network.vscode_port = network_config["vscode_port"]
            if "gremlingpt_port" in network_config:
                self.network.gremlingpt_port = network_config["gremlingpt_port"]
            
            # Apply Paths configuration
            paths_config = self.unified_config.get("paths", {})
            for path_key in ["base_dir", "data_dir", "logs_dir", "config_dir", "memory_dir"]:
                if path_key in paths_config:
                    setattr(self.paths, path_key, paths_config[path_key])
            
            # Apply Security configuration
            security_config = self.unified_config.get("security", {})
            if "secret_key" in security_config:
                self.security.secret_key = security_config["secret_key"]
            if "session_cookie_name" in security_config:
                self.security.session_cookie_name = security_config["session_cookie_name"]
            
            # Apply Integration configuration
            integration_config = self.unified_config.get("integration", {})
            for integration_key in ["fsm_agent_coordination", "copilot_gremlin_sync", "intelligent_task_routing"]:
                if integration_key in integration_config:
                    setattr(self.integration, integration_key, integration_config[integration_key])
            
            config_logger.info("[CONFIG] Unified configuration applied to components")
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to apply unified configuration: {e}")
    
    def _store_github_token(self, token: str):
        """Securely store GitHub token"""
        try:
            token_dir = Path.home() / ".statik/keys"
            token_dir.mkdir(parents=True, exist_ok=True)
            
            token_file = token_dir / "github-token"
            with open(token_file, 'w') as f:
                f.write(token.strip())
            
            # Set secure permissions
            os.chmod(token_file, 0o600)
            
            config_logger.info("[CONFIG] GitHub token stored securely")
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to store GitHub token: {e}")
    
    def _validate_configuration(self):
        """Validate the merged configuration"""
        try:
            config_logger.info("[CONFIG] Validating configuration...")
            
            validation_errors = []
            
            # Validate port numbers
            ports = [
                self.network.frontend_port,
                self.network.vscode_port,
                self.network.gremlingpt_port,
                self.network.api_port
            ]
            
            for port in ports:
                if not (1024 <= port <= 65535):
                    validation_errors.append(f"Invalid port number: {port}")
            
            # Check for port conflicts
            if len(set(ports)) != len(ports):
                validation_errors.append("Port conflicts detected")
            
            # Validate required paths
            if not self.paths.base_dir:
                validation_errors.append("Base directory not specified")
            
            # Validate Copilot configuration if enabled
            if self.copilot.enabled:
                token_file = Path(self.copilot.token_path.replace("~", str(Path.home())))
                github_token_env = os.getenv("GITHUB_TOKEN")
                if not token_file.exists() and not github_token_env:
                    validation_errors.append("GitHub token not found for Copilot")
            
            if validation_errors:
                for error in validation_errors:
                    config_logger.error(f"[CONFIG] Validation error: {error}")
                return False
            
            config_logger.info("[CONFIG] Configuration validation passed")
            return True
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Configuration validation failed: {e}")
            return False
    
    def _ensure_directories(self):
        """Ensure all required directories exist"""
        try:
            directories = [
                self.paths.data_dir,
                self.paths.logs_dir,
                self.paths.config_dir,
                self.paths.memory_dir,
                self.paths.checkpoints_dir,
                self.paths.vector_store_path,
                self.paths.faiss_path,
                self.paths.chroma_path
            ]
            
            for directory in directories:
                dir_path = Path(directory)
                if not dir_path.exists():
                    dir_path.mkdir(parents=True, exist_ok=True)
                    config_logger.info(f"[CONFIG] Created directory: {directory}")
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Directory creation failed: {e}")
    
    def get_component_config(self, component: str) -> Dict[str, Any]:
        """Get configuration for a specific component"""
        component_configs = {
            "vscode": self.vscode.__dict__,
            "copilot": self.copilot.__dict__,
            "gremlingpt": self.gremlingpt.__dict__,
            "network": self.network.__dict__,
            "paths": self.paths.__dict__,
            "security": self.security.__dict__,
            "integration": self.integration.__dict__
        }
        
        return component_configs.get(component, {})
    
    def get_full_config(self) -> Dict[str, Any]:
        """Get the complete unified configuration"""
        return {
            "vscode": self.vscode.__dict__,
            "copilot": self.copilot.__dict__,
            "gremlingpt": self.gremlingpt.__dict__,
            "network": self.network.__dict__,
            "paths": self.paths.__dict__,
            "security": self.security.__dict__,
            "integration": self.integration.__dict__,
            "metadata": {
                "config_loaded": self.config_loaded,
                "sources_loaded": list(self.config_sources.keys()),
                "last_updated": datetime.now().isoformat()
            }
        }
    
    def save_configuration(self, filename: Optional[str] = None):
        """Save the current unified configuration"""
        try:
            if not filename:
                filename = "run/checkpoints/unified_config.json"
            
            config_file = Path(filename)
            config_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(config_file, 'w') as f:
                json.dump(self.get_full_config(), f, indent=2)
            
            config_logger.info(f"[CONFIG] Configuration saved to {filename}")
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Failed to save configuration: {e}")
    
    def update_configuration(self, updates: Dict[str, Any], save: bool = True):
        """Update configuration with new values"""
        try:
            # Apply updates to unified config
            self._deep_merge(self.unified_config, updates)
            
            # Re-apply to component configurations
            self._apply_unified_config()
            
            # Validate updated configuration
            if not self._validate_configuration():
                config_logger.error("[CONFIG] Configuration update validation failed")
                return False
            
            if save:
                self.save_configuration()
            
            config_logger.info("[CONFIG] Configuration updated successfully")
            return True
            
        except Exception as e:
            config_logger.error(f"[CONFIG] Configuration update failed: {e}")
            return False
    
    def export_for_component(self, component: str, format: str = "json") -> str:
        """Export configuration in component-specific format"""
        try:
            component_config = self.get_component_config(component)
            
            if format == "json":
                return json.dumps(component_config, indent=2)
            elif format == "toml":
                return toml.dumps(component_config)
            elif format == "env":
                # Export as environment variables
                env_vars = []
                for key, value in component_config.items():
                    env_key = f"STATIK_{component.upper()}_{key.upper()}"
                    env_vars.append(f"export {env_key}='{value}'")
                return "\n".join(env_vars)
            else:
                raise ValueError(f"Unsupported format: {format}")
                
        except Exception as e:
            config_logger.error(f"[CONFIG] Export failed for {component}: {e}")
            return ""


# Global configuration manager instance
_config_manager = None


def get_config_manager(config_dir: Optional[str] = None) -> UnifiedConfigurationManager:
    """Get the global configuration manager instance"""
    global _config_manager
    if _config_manager is None:
        _config_manager = UnifiedConfigurationManager(config_dir)
        _config_manager.load_configuration()
    return _config_manager


def load_unified_config(config_dir: Optional[str] = None) -> UnifiedConfigurationManager:
    """Load and return the unified configuration"""
    config_manager = get_config_manager(config_dir)
    return config_manager


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Unified Configuration Manager")
    parser.add_argument("--show", action="store_true", help="Show current configuration")
    parser.add_argument("--component", help="Show configuration for specific component")
    parser.add_argument("--export", choices=["json", "toml", "env"], help="Export configuration")
    parser.add_argument("--validate", action="store_true", help="Validate configuration")
    parser.add_argument("--save", help="Save configuration to file")
    
    args = parser.parse_args()
    
    # Load configuration
    config_manager = load_unified_config()
    
    if args.show:
        if args.component:
            config = config_manager.get_component_config(args.component)
            print(f"Configuration for {args.component}:")
        else:
            config = config_manager.get_full_config()
            print("Full unified configuration:")
        
        print(json.dumps(config, indent=2))
    
    elif args.export:
        if args.component:
            exported = config_manager.export_for_component(args.component, args.export)
            print(exported)
        else:
            config = config_manager.get_full_config()
            if args.export == "json":
                print(json.dumps(config, indent=2))
            elif args.export == "toml":
                print(toml.dumps(config))
    
    elif args.validate:
        if config_manager._validate_configuration():
            print("✅ Configuration is valid")
        else:
            print("❌ Configuration has errors")
            sys.exit(1)
    
    elif args.save:
        config_manager.save_configuration(args.save)
        print(f"Configuration saved to {args.save}")
    
    else:
        print("Unified Configuration Manager")
        print(f"Configuration loaded: {config_manager.config_loaded}")
        print(f"Sources: {', '.join(config_manager.config_sources.keys())}")
        print("Use --help for options")
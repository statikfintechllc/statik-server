#!/usr/bin/env python3

# ─────────────────────────────────────────────────────────────
# ⚠️ GremlinGPT Fair Use Only | Commercial Use Requires License
# Built under the GremlinGPT Dual License v1.0
# © 2025 StatikFintechLLC / AscendAI Project
# Contact: ascend.gremlin@gmail.com
# ─────────────────────────────────────────────────────────────

# GremlinGPT v1.0.3 :: Enhanced Copilot Integration Layer
# Bridges GitHub Copilot with GremlinGPT for seamless AI workflow

import os
import sys
import json
import asyncio
import time
from pathlib import Path
from typing import Dict, List, Any, Optional, Union, Callable
from dataclasses import dataclass
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Simple logger to avoid circular imports
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
copilot_logger = logging.getLogger("copilot_integration")

# Try to import backend globals, but handle gracefully if not available
try:
    from backend.globals import CFG, logger, resolve_path
except ImportError:
    copilot_logger.warning("Backend globals not available, using defaults")
    CFG = {}
    resolve_path = lambda x: x


@dataclass
class CopilotContext:
    """Context information for Copilot integration"""
    file_path: Optional[str] = None
    language: Optional[str] = None
    project_type: Optional[str] = None
    gremlin_analysis: Optional[Dict[str, Any]] = None
    system_state: Optional[Dict[str, Any]] = None
    active_tasks: Optional[List[Dict[str, Any]]] = None
    user_intent: Optional[str] = None
    session_id: Optional[str] = None


@dataclass
class CopilotSuggestion:
    """Copilot suggestion with enhanced context"""
    content: str
    confidence: float
    language: str
    context: CopilotContext
    gremlin_enhancement: Optional[Dict[str, Any]] = None
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc)


class CopilotEnhancementEngine:
    """
    Copilot Enhancement Engine
    
    Enhances GitHub Copilot suggestions with GremlinGPT intelligence:
    1. Context enrichment from GremlinGPT analysis
    2. System state awareness
    3. Task-aware suggestions
    4. Learning from user patterns
    """
    
    def __init__(self, coordinator=None):
        self.coordinator = coordinator
        self.context_cache = {}
        self.suggestion_history = []
        self.user_patterns = {}
        self.active_sessions = {}
        
        # Enhancement modes
        self.enhancement_modes = {
            "basic": self._basic_enhancement,
            "contextual": self._contextual_enhancement,
            "intelligent": self._intelligent_enhancement,
            "autonomous": self._autonomous_enhancement
        }
        
        self.current_mode = "intelligent"
        
        copilot_logger.info("[COPILOT] Enhancement engine initialized")
    
    async def enhance_suggestion(self, suggestion: CopilotSuggestion) -> CopilotSuggestion:
        """Enhance a Copilot suggestion with GremlinGPT intelligence"""
        try:
            enhancement_func = self.enhancement_modes.get(self.current_mode, self._basic_enhancement)
            enhanced_suggestion = await enhancement_func(suggestion)
            
            # Store suggestion for learning
            self.suggestion_history.append(enhanced_suggestion)
            self._update_user_patterns(enhanced_suggestion)
            
            copilot_logger.debug(f"[COPILOT] Enhanced suggestion in {self.current_mode} mode")
            return enhanced_suggestion
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Suggestion enhancement failed: {e}")
            return suggestion  # Return original if enhancement fails
    
    async def _basic_enhancement(self, suggestion: CopilotSuggestion) -> CopilotSuggestion:
        """Basic enhancement with minimal context"""
        try:
            # Add basic GremlinGPT branding/context
            enhancement = {
                "mode": "basic",
                "enhanced_by": "gremlingpt",
                "enhancement_time": datetime.now(timezone.utc).isoformat()
            }
            
            suggestion.gremlin_enhancement = enhancement
            return suggestion
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Basic enhancement failed: {e}")
            return suggestion
    
    async def _contextual_enhancement(self, suggestion: CopilotSuggestion) -> CopilotSuggestion:
        """Contextual enhancement with file and project awareness"""
        try:
            enhancement = {
                "mode": "contextual",
                "enhanced_by": "gremlingpt",
                "enhancement_time": datetime.now(timezone.utc).isoformat()
            }
            
            # Add file context if available
            if suggestion.context and suggestion.context.file_path:
                file_analysis = await self._analyze_file_context(suggestion.context.file_path)
                enhancement["file_analysis"] = file_analysis
            
            # Add project context
            project_analysis = await self._analyze_project_context()
            enhancement["project_analysis"] = project_analysis
            
            suggestion.gremlin_enhancement = enhancement
            return suggestion
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Contextual enhancement failed: {e}")
            return suggestion
    
    async def _intelligent_enhancement(self, suggestion: CopilotSuggestion) -> CopilotSuggestion:
        """Intelligent enhancement with GremlinGPT analysis integration"""
        try:
            enhancement = {
                "mode": "intelligent",
                "enhanced_by": "gremlingpt",
                "enhancement_time": datetime.now(timezone.utc).isoformat()
            }
            
            # Get current system state from coordinator
            if self.coordinator:
                system_status = await self.coordinator.get_system_status()
                enhancement["system_state"] = {
                    "health": system_status.get("health_summary", {}),
                    "active_components": system_status.get("components", {}),
                    "configuration": system_status.get("configuration", {})
                }
            
            # Analyze suggestion content with GremlinGPT
            content_analysis = await self._analyze_suggestion_content(suggestion.content, suggestion.language)
            enhancement["content_analysis"] = content_analysis
            
            # Add intelligent recommendations
            recommendations = await self._generate_intelligent_recommendations(suggestion)
            enhancement["recommendations"] = recommendations
            
            # Context-aware improvements
            if suggestion.context:
                context_improvements = await self._suggest_context_improvements(suggestion.context)
                enhancement["context_improvements"] = context_improvements
            
            suggestion.gremlin_enhancement = enhancement
            return suggestion
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Intelligent enhancement failed: {e}")
            return suggestion
    
    async def _autonomous_enhancement(self, suggestion: CopilotSuggestion) -> CopilotSuggestion:
        """Autonomous enhancement with proactive GremlinGPT integration"""
        try:
            enhancement = {
                "mode": "autonomous",
                "enhanced_by": "gremlingpt",
                "enhancement_time": datetime.now(timezone.utc).isoformat()
            }
            
            # Perform intelligent enhancement first
            suggestion = await self._intelligent_enhancement(suggestion)
            
            # Add autonomous features
            autonomous_analysis = await self._perform_autonomous_analysis(suggestion)
            enhancement["autonomous_analysis"] = autonomous_analysis
            
            # Proactive task suggestions
            proactive_tasks = await self._suggest_proactive_tasks(suggestion)
            enhancement["proactive_tasks"] = proactive_tasks
            
            # Auto-execute certain enhancements if configured
            auto_executed = await self._auto_execute_enhancements(suggestion)
            enhancement["auto_executed"] = auto_executed
            
            # Merge with existing enhancement
            if suggestion.gremlin_enhancement:
                suggestion.gremlin_enhancement.update(enhancement)
            else:
                suggestion.gremlin_enhancement = enhancement
            
            return suggestion
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Autonomous enhancement failed: {e}")
            return suggestion
    
    async def _analyze_file_context(self, file_path: str) -> Dict[str, Any]:
        """Analyze file context for enhancement"""
        try:
            file_info = {
                "path": file_path,
                "exists": False,
                "language": None,
                "size": 0,
                "last_modified": None
            }
            
            if Path(file_path).exists():
                file_stat = Path(file_path).stat()
                file_info.update({
                    "exists": True,
                    "size": file_stat.st_size,
                    "last_modified": datetime.fromtimestamp(file_stat.st_mtime).isoformat()
                })
                
                # Determine language from extension
                file_ext = Path(file_path).suffix.lower()
                language_map = {
                    ".py": "python",
                    ".js": "javascript", 
                    ".ts": "typescript",
                    ".tsx": "typescript-react",
                    ".jsx": "javascript-react",
                    ".java": "java",
                    ".cpp": "cpp",
                    ".c": "c",
                    ".go": "go",
                    ".rs": "rust",
                    ".php": "php",
                    ".rb": "ruby",
                    ".sh": "bash",
                    ".sql": "sql",
                    ".html": "html",
                    ".css": "css",
                    ".json": "json",
                    ".yaml": "yaml",
                    ".yml": "yaml",
                    ".toml": "toml",
                    ".md": "markdown"
                }
                file_info["language"] = language_map.get(file_ext, "unknown")
            
            return file_info
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] File context analysis failed: {e}")
            return {"error": str(e)}
    
    async def _analyze_project_context(self) -> Dict[str, Any]:
        """Analyze project context"""
        try:
            project_info = {
                "type": "unknown",
                "framework": None,
                "dependencies": [],
                "config_files": [],
                "gremlingpt_integrated": True
            }
            
            # Check for common project indicators
            project_indicators = {
                "package.json": "node_js",
                "requirements.txt": "python",
                "Cargo.toml": "rust",
                "go.mod": "go",
                "pom.xml": "java_maven",
                "build.gradle": "java_gradle",
                "composer.json": "php",
                "Gemfile": "ruby"
            }
            
            for file, proj_type in project_indicators.items():
                if Path(file).exists():
                    project_info["type"] = proj_type
                    break
            
            # Check for configuration files
            config_files = ["config.toml", "config.json", ".env", "settings.json"]
            project_info["config_files"] = [f for f in config_files if Path(f).exists()]
            
            return project_info
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Project context analysis failed: {e}")
            return {"error": str(e)}
    
    async def _analyze_suggestion_content(self, content: str, language: str) -> Dict[str, Any]:
        """Analyze suggestion content with GremlinGPT"""
        try:
            analysis = {
                "language": language,
                "content_length": len(content),
                "complexity": "unknown",
                "patterns": [],
                "potential_issues": [],
                "improvements": []
            }
            
            # Basic content analysis
            lines = content.split('\n')
            analysis["line_count"] = len(lines)
            
            # Language-specific analysis
            if language == "python":
                analysis.update(await self._analyze_python_content(content))
            elif language in ["javascript", "typescript"]:
                analysis.update(await self._analyze_js_content(content))
            
            # Security analysis
            security_analysis = await self._analyze_security_implications(content, language)
            analysis["security"] = security_analysis
            
            return analysis
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Content analysis failed: {e}")
            return {"error": str(e)}
    
    async def _analyze_python_content(self, content: str) -> Dict[str, Any]:
        """Analyze Python-specific content"""
        try:
            analysis = {}
            
            # Check for common patterns
            patterns = []
            if "import " in content:
                patterns.append("imports")
            if "def " in content:
                patterns.append("function_definition")
            if "class " in content:
                patterns.append("class_definition")
            if "async " in content:
                patterns.append("async_code")
            if "try:" in content:
                patterns.append("exception_handling")
            
            analysis["patterns"] = patterns
            
            # Check for potential issues
            issues = []
            if "print(" in content:
                issues.append("debug_print_detected")
            if "TODO" in content or "FIXME" in content:
                issues.append("todo_comments")
            
            analysis["potential_issues"] = issues
            
            return analysis
            
        except Exception as e:
            return {"error": str(e)}
    
    async def _analyze_js_content(self, content: str) -> Dict[str, Any]:
        """Analyze JavaScript/TypeScript content"""
        try:
            analysis = {}
            
            patterns = []
            if "function" in content or "=>" in content:
                patterns.append("function_definition")
            if "class " in content:
                patterns.append("class_definition")
            if "async " in content or "await " in content:
                patterns.append("async_code")
            if "import " in content or "require(" in content:
                patterns.append("imports")
            if "export " in content:
                patterns.append("exports")
            
            analysis["patterns"] = patterns
            
            issues = []
            if "console.log" in content:
                issues.append("debug_console_detected")
            if "var " in content:
                issues.append("var_usage_detected")
            
            analysis["potential_issues"] = issues
            
            return analysis
            
        except Exception as e:
            return {"error": str(e)}
    
    async def _analyze_security_implications(self, content: str, language: str) -> Dict[str, Any]:
        """Analyze security implications of code"""
        try:
            security_analysis = {
                "risk_level": "low",
                "issues": [],
                "recommendations": []
            }
            
            # Common security patterns
            high_risk_patterns = [
                "eval(", "exec(", "system(", "shell_exec", "passthru",
                "sql", "SELECT", "INSERT", "UPDATE", "DELETE",
                "password", "secret", "token", "key"
            ]
            
            medium_risk_patterns = [
                "input(", "raw_input(", "gets(", "scanf",
                "file_get_contents", "file_put_contents",
                "curl", "wget", "http"
            ]
            
            content_lower = content.lower()
            
            for pattern in high_risk_patterns:
                if pattern.lower() in content_lower:
                    security_analysis["issues"].append(f"High risk pattern detected: {pattern}")
                    security_analysis["risk_level"] = "high"
            
            for pattern in medium_risk_patterns:
                if pattern.lower() in content_lower:
                    security_analysis["issues"].append(f"Medium risk pattern detected: {pattern}")
                    if security_analysis["risk_level"] == "low":
                        security_analysis["risk_level"] = "medium"
            
            # Add recommendations based on findings
            if security_analysis["issues"]:
                security_analysis["recommendations"].extend([
                    "Review code for security vulnerabilities",
                    "Consider input validation and sanitization",
                    "Use parameterized queries for database operations",
                    "Avoid hardcoded secrets and credentials"
                ])
            
            return security_analysis
            
        except Exception as e:
            return {"error": str(e)}
    
    async def _generate_intelligent_recommendations(self, suggestion: CopilotSuggestion) -> List[str]:
        """Generate intelligent recommendations for the suggestion"""
        try:
            recommendations = []
            
            # Content-based recommendations
            if suggestion.gremlin_enhancement and "content_analysis" in suggestion.gremlin_enhancement:
                content_analysis = suggestion.gremlin_enhancement["content_analysis"]
                
                if "debug_print_detected" in content_analysis.get("potential_issues", []):
                    recommendations.append("Consider using logging instead of print statements")
                
                if "var_usage_detected" in content_analysis.get("potential_issues", []):
                    recommendations.append("Consider using 'let' or 'const' instead of 'var'")
                
                if content_analysis.get("security", {}).get("risk_level") != "low":
                    recommendations.append("Review code for security implications")
            
            # Context-based recommendations
            if suggestion.context:
                if suggestion.context.language == "python":
                    recommendations.append("Consider adding type hints for better code clarity")
                
                if suggestion.context.project_type and "node" in suggestion.context.project_type:
                    recommendations.append("Ensure proper error handling for async operations")
            
            # System state recommendations
            if self.coordinator:
                recommendations.append("GremlinGPT system is monitoring for optimization opportunities")
            
            return recommendations
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Recommendation generation failed: {e}")
            return []
    
    async def _suggest_context_improvements(self, context: CopilotContext) -> Dict[str, Any]:
        """Suggest improvements based on context"""
        try:
            improvements = {
                "file_organization": [],
                "project_structure": [],
                "development_workflow": []
            }
            
            # File organization improvements
            if context.file_path:
                file_path = Path(context.file_path)
                if len(file_path.parts) > 5:
                    improvements["file_organization"].append("Consider flattening deep directory structure")
                
                if not file_path.suffix:
                    improvements["file_organization"].append("Consider adding file extension for clarity")
            
            # Project structure improvements
            if context.project_type:
                if context.project_type == "python" and not Path("requirements.txt").exists():
                    improvements["project_structure"].append("Consider adding requirements.txt")
                
                if not Path(".gitignore").exists():
                    improvements["project_structure"].append("Consider adding .gitignore file")
            
            # Development workflow improvements
            improvements["development_workflow"].extend([
                "GremlinGPT can provide additional context and analysis",
                "Consider using integrated debugging tools",
                "Leverage AI-assisted code review capabilities"
            ])
            
            return improvements
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Context improvement suggestions failed: {e}")
            return {}
    
    async def _perform_autonomous_analysis(self, suggestion: CopilotSuggestion) -> Dict[str, Any]:
        """Perform autonomous analysis of the suggestion"""
        try:
            analysis = {
                "confidence_adjustment": 0.0,
                "alternative_approaches": [],
                "optimization_opportunities": [],
                "learning_insights": []
            }
            
            # Adjust confidence based on GremlinGPT analysis
            if suggestion.gremlin_enhancement:
                content_analysis = suggestion.gremlin_enhancement.get("content_analysis", {})
                security = content_analysis.get("security", {})
                
                if security.get("risk_level") == "high":
                    analysis["confidence_adjustment"] = -0.3
                elif security.get("risk_level") == "medium":
                    analysis["confidence_adjustment"] = -0.1
                else:
                    analysis["confidence_adjustment"] = 0.1
            
            # Suggest alternative approaches
            if suggestion.language == "python":
                analysis["alternative_approaches"].append("Consider using list comprehensions for better performance")
                analysis["alternative_approaches"].append("Explore asyncio for concurrent operations")
            
            # Identify optimization opportunities
            analysis["optimization_opportunities"].extend([
                "Code can be enhanced with GremlinGPT pattern analysis",
                "Consider performance profiling for optimization",
                "Review memory usage patterns"
            ])
            
            return analysis
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Autonomous analysis failed: {e}")
            return {}
    
    async def _suggest_proactive_tasks(self, suggestion: CopilotSuggestion) -> List[Dict[str, Any]]:
        """Suggest proactive tasks based on the suggestion"""
        try:
            tasks = []
            
            # Code quality tasks
            tasks.append({
                "type": "code_quality",
                "description": "Run GremlinGPT code analysis",
                "priority": "normal",
                "automated": True
            })
            
            # Testing tasks
            if "function" in suggestion.content.lower():
                tasks.append({
                    "type": "testing",
                    "description": "Generate unit tests for new function",
                    "priority": "high",
                    "automated": False
                })
            
            # Documentation tasks
            if "class " in suggestion.content:
                tasks.append({
                    "type": "documentation",
                    "description": "Add docstrings and type hints",
                    "priority": "normal",
                    "automated": False
                })
            
            # Security tasks
            if suggestion.gremlin_enhancement:
                security = suggestion.gremlin_enhancement.get("content_analysis", {}).get("security", {})
                if security.get("risk_level") != "low":
                    tasks.append({
                        "type": "security_review",
                        "description": "Conduct security review of code",
                        "priority": "high",
                        "automated": False
                    })
            
            return tasks
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Proactive task suggestion failed: {e}")
            return []
    
    async def _auto_execute_enhancements(self, suggestion: CopilotSuggestion) -> List[str]:
        """Auto-execute certain enhancements if configured"""
        try:
            executed = []
            
            # Auto-format code if needed
            if suggestion.language in ["python", "javascript", "typescript"]:
                # This would integrate with actual formatting tools
                executed.append("code_formatting_checked")
            
            # Auto-add security comments for high-risk code
            if suggestion.gremlin_enhancement:
                security = suggestion.gremlin_enhancement.get("content_analysis", {}).get("security", {})
                if security.get("risk_level") == "high":
                    executed.append("security_warning_added")
            
            # Auto-suggest imports
            if "import " in suggestion.content or "from " in suggestion.content:
                executed.append("import_analysis_completed")
            
            return executed
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Auto-execution failed: {e}")
            return []
    
    def _update_user_patterns(self, suggestion: CopilotSuggestion):
        """Update user patterns based on suggestion"""
        try:
            session_id = suggestion.context.session_id if suggestion.context else "default"
            
            if session_id not in self.user_patterns:
                self.user_patterns[session_id] = {
                    "languages": {},
                    "patterns": {},
                    "preferences": {}
                }
            
            # Track language usage
            if suggestion.language:
                lang_count = self.user_patterns[session_id]["languages"].get(suggestion.language, 0)
                self.user_patterns[session_id]["languages"][suggestion.language] = lang_count + 1
            
            # Track suggestion acceptance (would need feedback mechanism)
            # This is a placeholder for future implementation
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] User pattern update failed: {e}")
    
    async def get_context_for_copilot(self, file_path: str, user_intent: str = None) -> CopilotContext:
        """Get enhanced context for Copilot"""
        try:
            context = CopilotContext(
                file_path=file_path,
                user_intent=user_intent,
                session_id=f"session_{int(time.time())}"
            )
            
            # Analyze file
            if file_path:
                file_analysis = await self._analyze_file_context(file_path)
                context.language = file_analysis.get("language")
            
            # Get project analysis
            project_analysis = await self._analyze_project_context()
            context.project_type = project_analysis.get("type")
            
            # Get GremlinGPT analysis if coordinator available
            if self.coordinator:
                system_status = await self.coordinator.get_system_status()
                context.system_state = system_status
                
                # Get active tasks
                # This would integrate with actual task system
                context.active_tasks = []
            
            return context
            
        except Exception as e:
            copilot_logger.error(f"[COPILOT] Context generation failed: {e}")
            return CopilotContext()
    
    def set_enhancement_mode(self, mode: str):
        """Set the enhancement mode"""
        if mode in self.enhancement_modes:
            self.current_mode = mode
            copilot_logger.info(f"[COPILOT] Enhancement mode set to: {mode}")
        else:
            copilot_logger.warning(f"[COPILOT] Invalid enhancement mode: {mode}")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get enhancement statistics"""
        return {
            "total_suggestions": len(self.suggestion_history),
            "enhancement_mode": self.current_mode,
            "active_sessions": len(self.active_sessions),
            "user_patterns": self.user_patterns,
            "recent_suggestions": self.suggestion_history[-10:] if self.suggestion_history else []
        }


class VSCodeCopilotBridge:
    """
    Bridge between VS Code, Copilot, and GremlinGPT
    
    Facilitates communication and coordination between all systems
    """
    
    def __init__(self, coordinator=None):
        self.coordinator = coordinator
        self.enhancement_engine = CopilotEnhancementEngine(coordinator)
        self.active_sessions = {}
        self.context_cache = {}
        
        copilot_logger.info("[BRIDGE] VS Code Copilot bridge initialized")
    
    async def handle_copilot_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming Copilot requests"""
        try:
            request_type = request.get("type", "unknown")
            
            if request_type == "completion":
                return await self._handle_completion_request(request)
            elif request_type == "chat":
                return await self._handle_chat_request(request)
            elif request_type == "analysis":
                return await self._handle_analysis_request(request)
            else:
                return {"error": f"Unknown request type: {request_type}"}
                
        except Exception as e:
            copilot_logger.error(f"[BRIDGE] Request handling failed: {e}")
            return {"error": str(e)}
    
    async def _handle_completion_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle Copilot completion requests"""
        try:
            # Extract request information
            file_path = request.get("file_path")
            content = request.get("content", "")
            language = request.get("language", "unknown")
            
            # Get enhanced context
            context = await self.enhancement_engine.get_context_for_copilot(file_path)
            
            # Create suggestion object
            suggestion = CopilotSuggestion(
                content=content,
                confidence=request.get("confidence", 0.5),
                language=language,
                context=context
            )
            
            # Enhance suggestion
            enhanced_suggestion = await self.enhancement_engine.enhance_suggestion(suggestion)
            
            # Return enhanced response
            response = {
                "type": "completion_response",
                "original_content": content,
                "enhanced_content": enhanced_suggestion.content,
                "confidence": enhanced_suggestion.confidence,
                "enhancement": enhanced_suggestion.gremlin_enhancement,
                "recommendations": enhanced_suggestion.gremlin_enhancement.get("recommendations", []) if enhanced_suggestion.gremlin_enhancement else []
            }
            
            return response
            
        except Exception as e:
            copilot_logger.error(f"[BRIDGE] Completion request handling failed: {e}")
            return {"error": str(e)}
    
    async def _handle_chat_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle Copilot chat requests"""
        try:
            message = request.get("message", "")
            context = request.get("context", {})
            
            # Process chat message with GremlinGPT enhancement
            enhanced_response = await self._process_chat_message(message, context)
            
            return {
                "type": "chat_response",
                "response": enhanced_response.get("response", ""),
                "context": enhanced_response.get("context", {}),
                "gremlin_insights": enhanced_response.get("gremlin_insights", [])
            }
            
        except Exception as e:
            copilot_logger.error(f"[BRIDGE] Chat request handling failed: {e}")
            return {"error": str(e)}
    
    async def _handle_analysis_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle code analysis requests"""
        try:
            code = request.get("code", "")
            language = request.get("language", "unknown")
            
            # Perform enhanced analysis
            analysis = await self.enhancement_engine._analyze_suggestion_content(code, language)
            
            return {
                "type": "analysis_response",
                "analysis": analysis,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            copilot_logger.error(f"[BRIDGE] Analysis request handling failed: {e}")
            return {"error": str(e)}
    
    async def _process_chat_message(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process chat message with GremlinGPT enhancement"""
        try:
            response = {
                "response": "",
                "context": context,
                "gremlin_insights": []
            }
            
            # Analyze message intent
            if "help" in message.lower() or "how" in message.lower():
                response["gremlin_insights"].append("GremlinGPT can provide additional context and analysis")
            
            if "optimize" in message.lower() or "performance" in message.lower():
                response["gremlin_insights"].append("Consider using GremlinGPT performance analysis tools")
            
            if "security" in message.lower() or "safe" in message.lower():
                response["gremlin_insights"].append("GremlinGPT includes security analysis capabilities")
            
            # Add system context if available
            if self.coordinator:
                system_status = await self.coordinator.get_system_status()
                response["context"]["system_health"] = system_status.get("health_summary", {})
            
            # Generate response (simplified - would integrate with actual chat system)
            response["response"] = f"Enhanced by GremlinGPT: {message}"
            
            return response
            
        except Exception as e:
            copilot_logger.error(f"[BRIDGE] Chat message processing failed: {e}")
            return {"response": "Error processing message", "context": {}, "gremlin_insights": []}
    
    async def create_copilot_context_file(self, context: CopilotContext):
        """Create context file for Copilot to read"""
        try:
            context_data = {
                "gremlingpt_context": {
                    "system_active": True,
                    "enhancement_mode": self.enhancement_engine.current_mode,
                    "file_path": context.file_path,
                    "language": context.language,
                    "project_type": context.project_type,
                    "system_state": context.system_state,
                    "active_tasks": context.active_tasks,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            }
            
            context_file = Path("run/checkpoints/copilot_context.json")
            context_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(context_file, 'w') as f:
                json.dump(context_data, f, indent=2)
            
            copilot_logger.debug("[BRIDGE] Copilot context file created")
            
        except Exception as e:
            copilot_logger.error(f"[BRIDGE] Context file creation failed: {e}")


# Global enhancement engine instance
_enhancement_engine = None


def get_copilot_enhancement_engine(coordinator=None) -> CopilotEnhancementEngine:
    """Get the global Copilot enhancement engine instance"""
    global _enhancement_engine
    if _enhancement_engine is None:
        _enhancement_engine = CopilotEnhancementEngine(coordinator)
    return _enhancement_engine


def get_vscode_copilot_bridge(coordinator=None) -> VSCodeCopilotBridge:
    """Get VS Code Copilot bridge instance"""
    return VSCodeCopilotBridge(coordinator)


if __name__ == "__main__":
    async def test_copilot_integration():
        """Test Copilot integration"""
        # Create test enhancement engine
        engine = CopilotEnhancementEngine()
        
        # Test suggestion enhancement
        test_context = CopilotContext(
            file_path="test.py",
            language="python",
            project_type="python"
        )
        
        test_suggestion = CopilotSuggestion(
            content="def hello_world():\n    print('Hello, World!')",
            confidence=0.8,
            language="python",
            context=test_context
        )
        
        enhanced = await engine.enhance_suggestion(test_suggestion)
        
        print("Enhanced suggestion:")
        print(json.dumps({
            "content": enhanced.content,
            "enhancement": enhanced.gremlin_enhancement
        }, indent=2, default=str))
    
    asyncio.run(test_copilot_integration())
# 🤔 Frequently Asked Questions

Common questions and answers about Statik-Server.

## 🚀 Getting Started

### Q: What is Statik-Server?
**A:** Statik-Server is a sovereign AI development environment that combines VS Code, GitHub Copilot, and mesh VPN technology. It allows you to run your own VS Code server with AI assistance, accessible from anywhere through secure mesh networking.

### Q: Do I need to install VS Code separately?
**A:** No! Statik-Server includes the official VS Code CLI and server. You can use both the web interface and open the local VS Code desktop application.

### Q: Is this free to use?
**A:** Yes, Statik-Server is open source and free. However, GitHub Copilot requires a separate subscription from GitHub.

### Q: What platforms are supported?
**A:** Currently Linux and macOS. Windows support is planned for future releases.

## 🔧 Installation & Setup

### Q: How long does installation take?
**A:** Typically 5-10 minutes, depending on your internet connection and system specifications.

### Q: Can I install without root/sudo access?
**A:** The installer requires sudo for system dependencies. However, Statik-Server itself runs in user space.

### Q: What if the installation fails?
**A:** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues. Most problems are related to missing dependencies or network connectivity.

### Q: Can I customize the installation directory?
**A:** Currently, Statik-Server installs to `~/.statik-server`. Custom installation directories will be supported in future versions.

## 💻 VS Code Integration

### Q: What's the difference between local and web VS Code?
**A:** 
- **Local VS Code**: Native desktop application with full extension support
- **Web VS Code**: Browser-based, mobile-friendly, with web-compatible extensions

### Q: Can I use my existing VS Code extensions?
**A:** 
- **Local VS Code**: Yes, all extensions work
- **Web VS Code**: Only web-compatible extensions work

### Q: How do I sync settings between local and web VS Code?
**A:** Enable VS Code Settings Sync in both environments to keep settings, extensions, and keybindings synchronized.

### Q: Can I use VS Code remotely?
**A:** Yes! Use the mesh VPN to securely access your development environment from anywhere.

## 🤖 GitHub Copilot

### Q: Do I need a GitHub Copilot subscription?
**A:** Yes, you need an active GitHub Copilot subscription to use AI features.

### Q: How do I set up GitHub Copilot?
**A:** Run `statik-cli config token` and follow the authentication prompts in VS Code.

### Q: Why isn't Copilot working?
**A:** Check:
1. Valid GitHub Copilot subscription
2. Internet connectivity
3. Signed in to GitHub in VS Code
4. GitHub token configured: `statik-cli config`

### Q: Does Copilot work on mobile?
**A:** Yes! Copilot Chat works in the mobile web interface.

## 🌐 Mesh VPN & Networking

### Q: What is the mesh VPN for?
**A:** It allows secure global access to your development environment without port forwarding or complex networking setup.

### Q: How do I connect other devices?
**A:** 
1. Generate a key: `statik-cli mesh key`
2. Install Tailscale on the target device
3. Connect using the generated key

### Q: Is the mesh VPN secure?
**A:** Yes, it uses WireGuard encryption and operates independently of external services.

### Q: Can I use my existing Tailscale account?
**A:** Statik-Server uses Tailscale for mesh networking. You can use your existing Tailscale account or let the system manage the connection automatically.

## 📱 Mobile Access

### Q: Can I code on my phone?
**A:** Yes! The web VS Code interface is optimized for mobile devices and includes GitHub Copilot support.

### Q: How do I access Statik-Server from mobile?
**A:** Scan the QR code displayed on startup or connect via the mesh VPN.

### Q: Does mobile VS Code have all features?
**A:** Most features work on mobile, including file editing, terminal access, and Copilot Chat. Some desktop-specific features may be limited.

### Q: Can I use an external keyboard with mobile?
**A:** Yes! Bluetooth keyboards work great for extended mobile coding sessions.

## 🔐 Security & Privacy

### Q: Is my code secure?
**A:** Your code stays on your server. Only GitHub Copilot features send code snippets to GitHub for AI processing (per their privacy policy).

### Q: Why do I see certificate warnings?
**A:** Statik-Server uses self-signed certificates. These are secure but cause browser warnings. You can add the certificate to your trust store to eliminate warnings.

### Q: Can others access my development environment?
**A:** Only devices you explicitly connect to your mesh VPN can access your environment. Local network access depends on your firewall settings.

### Q: How do I secure my installation?
**A:** See the [Security Guide](./user/SECURITY.md) for comprehensive security practices.

## 🛠️ Troubleshooting

### Q: Statik-Server won't start
**A:** 
1. Check status: `statik-cli status`
2. View logs: `statik-cli logs`
3. Try restarting: `statik-cli restart`
4. Check port conflicts: `netstat -tlnp | grep :8080`

### Q: Can't access from browser
**A:** 
1. Verify server is running: `statik-cli status`
2. Check firewall settings
3. Try direct IP: `http://[your-ip]:8080`
4. For HTTPS: Accept security certificate

### Q: Mesh VPN not working
**A:** 
1. Check mesh status: `statik-cli mesh status`
2. Regenerate keys: `statik-cli mesh key`
3. Restart server: `statik-cli restart`
4. Verify device can reach server IP

### Q: Performance is slow
**A:** 
1. Check system resources: `statik-cli status`
2. Close unnecessary applications
3. Use local VS Code for better performance
4. Check network connectivity

## 🔄 Updates & Maintenance

### Q: How do I update Statik-Server?
**A:** Run the installation script again - it will update existing installations.

### Q: How often should I update?
**A:** Check for updates monthly or when new features are released.

### Q: Will updates break my configuration?
**A:** Updates preserve your configuration, keys, and settings.

### Q: How do I backup my configuration?
**A:** Backup the `~/.statik-server` directory, which contains all configuration and keys.

## 🚀 Advanced Usage

### Q: Can I run multiple instances?
**A:** Not currently supported. Each instance would conflict on ports and mesh configuration.

### Q: How do I integrate with my existing workflow?
**A:** Statik-Server works with any git repository and integrates with existing development workflows.

### Q: Can I customize the startup process?
**A:** Yes, you can modify scripts in the installation directory for custom startup behavior.

### Q: Is there an API?
**A:** A REST API is planned for future releases to enable automation and integration.

## 💡 Tips & Best Practices

### Q: How can I improve performance?
**A:** 
- Use local VS Code for intensive development
- Close unused browser tabs
- Connect via mesh VPN for remote access
- Use SSD storage for better I/O performance

### Q: What's the best mobile setup?
**A:** 
- Use external Bluetooth keyboard
- Connect tablet to external monitor
- Use dark mode to save battery
- Bookmark direct access URLs

### Q: How do I collaborate with others?
**A:** 
- Share mesh VPN access keys
- Use git for code collaboration
- Share project URLs for demonstrations
- Use VS Code Live Share (when available)

---

## 🔗 Still Need Help?

- 📖 [Full Documentation](./README.md)
- 🛠️ [Troubleshooting Guide](./TROUBLESHOOTING.md)
- 🐛 [Report Issues](https://github.com/statikfintechllc/statik-server/issues)
- 💬 [Community Support](https://github.com/statikfintechllc/statik-server/discussions)

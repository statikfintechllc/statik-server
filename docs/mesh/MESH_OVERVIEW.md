# Statik Mesh VPN Overview

Statik-Server includes an integrated mesh VPN based on Headscale, providing secure global access to your development environment.

## Features

- **Zero-config networking**: Automatically configured mesh
- **Self-signed certificates**: No external CA required
- **Preauth keys**: Simple device onboarding
- **Global access**: Connect from anywhere
- **Encrypted tunnels**: All traffic is encrypted

## Architecture

```
Device A ←→ Statik Server ←→ Device B
    ↑           ↓              ↑
    └─────── Mesh VPN ─────────┘
```

## Setup

The mesh is automatically configured during installation. No manual setup required.

## Adding Devices

1. Generate a preauth key:
```bash
statik-cli mesh key
# Local Development Environment

This documentation has been updated to reflect the removal of Tailscale mesh networking.

## Local Access

The Statik-Server now operates in local development mode.

1. Start the server:
```bash
./startall.sh
```

2. Connect your device locally:
```bash
# Access via local network
http://[server-ip]:8080
```

3. Access your development environment from your local network!

## Security

- All connections use WireGuard encryption
- Certificates are auto-generated and self-signed
- Keys are stored securely in `~/.statik-server/keys/`
- No external dependencies or cloud services

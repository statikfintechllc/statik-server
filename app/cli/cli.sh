#!/usr/bin/env bash
set -e

# List of popular terminal emulators
EMULATORS=(x-terminal-emulator gnome-terminal konsole xfce4-terminal lxterminal tilix mate-terminal)

# Detect preferred shell
USER_SHELL="$(getent passwd "$USER" | cut -d: -f7 2>/dev/null || echo "${SHELL:-/bin/bash}")"

function relaunch_in_terminal() {
    for TERM_APP in "${EMULATORS[@]}"; do
        if command -v "$TERM_APP" &>/dev/null; then
            # Prefer interactive+login if possible
            if [[ "$USER_SHELL" =~ (bash|zsh) ]]; then
                exec "$TERM_APP" -- "$USER_SHELL" -ilc "$0 $@"
            else
                exec "$TERM_APP" -- "$USER_SHELL" -ic "$0 $@"
            fi
            exit 0
        fi
    done
    echo "[ERROR] No graphical terminal emulator found. Exiting."
    exit 1
}

# Relaunch in graphical terminal if not already in one
if ! [ -t 0 ]; then
    relaunch_in_terminal "$@"
fi

# Run statik-cli interactively
SCRIPT_DIR="$(dirname "$0")"
CLI="$SCRIPT_DIR/statik-cli"
if [[ -f "$CLI" ]]; then
    bash -l "$CLI" "$@"
else
    echo "[ERROR] statik-cli not found at $CLI"
    exit 1
fi

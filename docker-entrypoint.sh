#!/bin/bash
set -e

# Start Xvfb
Xvfb $DISPLAY -screen 0 $RESOLUTION &

# Start fluxbox window manager
fluxbox &

# Start VNC server
x11vnc -display $DISPLAY -forever -shared -bg -nopw -quiet -xkb

# Start noVNC directly on port 8080
/opt/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 8080 &

# Execute the command passed to docker run
exec "$@"

#!/bin/bash
set -e

# Clean up any existing lock files
rm -f /tmp/.X*-lock
rm -f /tmp/.X11-unix/X*

# Start Xvfb with a different display number
export DISPLAY=:1
Xvfb $DISPLAY -screen 0 $RESOLUTION &

# Wait for Xvfb to start
sleep 3

# Start window manager
openbox &

# Wait for window manager to start
sleep 2

# Start VNC server
x11vnc -display $DISPLAY -forever -shared -nopw -quiet -xkb -rfbport 5900 &

# Wait for VNC server to start
sleep 2

# Start noVNC
/opt/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 8080 &

# Wait for noVNC to start
sleep 2

# Run the demo script
echo "Starting demo script..."
npm run start:demo

# Keep the container running
tail -f /dev/null

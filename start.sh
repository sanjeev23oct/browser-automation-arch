#!/bin/bash

# Clean up any existing lock files
rm -f /tmp/.X*-lock
rm -f /tmp/.X11-unix/X*

# Start Xvfb with a different display number
export DISPLAY=:1
Xvfb $DISPLAY -screen 0 $RESOLUTION &

# Wait for Xvfb to start
sleep 2

# Start window manager
openbox &

# Start VNC server in foreground mode
x11vnc -display $DISPLAY -forever -shared -nopw -quiet -xkb -rfbport 5900 &

# Wait for VNC server to start
sleep 2

# Start noVNC
/opt/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 8080 &

# Create a default config file if it doesn't exist
if [ ! -f /app/config.json ]; then
  echo '{
  "browser": {
    "headless": false,
    "slowMo": 50,
    "defaultTimeout": 30000
  },
  "credentials": {
    "google": {
      "email": "test@example.com",
      "password": "password123"
    }
  },
  "dataDir": "/app/data"
}' > /app/config.json
fi

# Execute the command passed to docker run
exec "$@"

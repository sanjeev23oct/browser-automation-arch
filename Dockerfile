FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Install minimal VNC server and dependencies for POC
RUN apt-get update && apt-get install -y \
    x11vnc \
    xvfb \
    fluxbox \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install lightweight noVNC (pre-packaged version)
RUN mkdir -p /opt/novnc \
    && apt-get update && apt-get install -y wget \
    && wget -qO- https://github.com/novnc/noVNC/archive/v1.3.0.tar.gz | tar xz --strip 1 -C /opt/novnc \
    && wget -qO- https://github.com/novnc/websockify/archive/v0.10.0.tar.gz | tar xz --strip 1 -C /opt/novnc/utils/websockify \
    && ln -s /opt/novnc/vnc.html /opt/novnc/index.html \
    && apt-get remove -y wget \
    && apt-get autoremove -y \
    && apt-get clean

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Set up environment variables
ENV DISPLAY=:99
ENV RESOLUTION=1280x720x24

# Expose ports for VNC and any web services
EXPOSE 5900
EXPOSE 3000

# Start script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

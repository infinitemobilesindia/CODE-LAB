FROM node:22-bookworm

WORKDIR /app

# Install CodeLab V1 language runtimes and compilers
RUN apt-get update && apt-get install -y \
    python3 \
    openjdk-21-jdk \
    gcc \
    g++ \
    golang \
    rustc \
    cargo \
    ruby \
    php-cli \
    && rm -rf /var/lib/apt/lists/*

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy backend
COPY . .

# Render provides PORT, but 10000 is our default
EXPOSE 10000

CMD ["npm", "start"]

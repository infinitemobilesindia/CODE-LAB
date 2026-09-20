FROM node:22-trixie

WORKDIR /app

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

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 10000

CMD ["npm", "start"]

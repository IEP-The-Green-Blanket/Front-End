# Gebruik de officiële Node 20 image
FROM node:20-slim

# Map instellen in de container
WORKDIR /app

# Kopieer package bestanden om dependencies te installeren
COPY package*.json ./

# Installeer dependencies
RUN npm install

# Kopieer de rest van je applicatie
COPY . .

# Bouw de applicatie (voor productie-omgevingen)
# RUN npm run build

# Stel de poort in (Next.js luistert hiernaar via de PORT variabele)
ENV PORT=8080
EXPOSE 8080

# Start de applicatie
CMD ["npm", "run", "dev"]
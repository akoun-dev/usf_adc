# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code
COPY . .

# Définition des arguments de build pour les variables d'environnement Vite
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Injection des variables dans le processus de build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Construction de l'application
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copie des fichiers construits vers le dossier Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration Nginx pour le routage SPA (Single Page Application)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Utilisation de l'image officielle Node.js
FROM node:18

# Définition du répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# DB connexion params
ENV DB_USER "myuser"
ENV DB_HOST "database"
ENV DB_NAME "mydb"
ENV DB_PASSWORD "mypassword"
ENV DB_PORT 5432

# Exposer le port du backend (11002 comme défini dans le code)
ENV PORT 11002
EXPOSE 11002

# Lancer le serveur
CMD ["node", "server.js"]

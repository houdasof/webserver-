# Étape 1 : Build du frontend avec Node.js
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . . 

RUN npm run build

# Étape 2 : Servir le frontend avec `serve`
FROM node:18

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build /app/build

EXPOSE 11003

CMD ["serve", "-s", "/app/build", "-l", "11003"]

# Verwende ein Basisimage (z.B. ein offizielles Node.js-Image)
FROM node:latest

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /app

# Kopiere die Abhängigkeitsdateien in den Container
COPY package.json package-lock.json /app/

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Bot-Code in den Container
COPY . /app

# Definiere den Befehl, um den Bot auszuführen und den Token als Argument zu übergeben
CMD ["node", "bot.js", "${TOKEN}"]
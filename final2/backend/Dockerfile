FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src
COPY ../frontend /app/frontend
RUN mkdir -p /app/uploads
ENV PORT=3000
EXPOSE 3000
CMD ["node","src/server.js"]

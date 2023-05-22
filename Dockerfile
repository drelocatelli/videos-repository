FROM node:alpine

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

EXPOSE 7005

CMD ["npm", "run", "preview"]

# docker compose up -d --build
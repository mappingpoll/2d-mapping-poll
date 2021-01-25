FROM node:14

WORKDIR /app

COPY ./client/package*.json ./client/

WORKDIR /app/client
RUN npm install

FROM docker.io/mongo
ENV MONGO_INITDB_ROOT_USERNAME admin
ENV MONGO_INITDB_ROOT_PASSWORD password
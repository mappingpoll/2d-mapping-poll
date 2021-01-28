FROM node:14 AS base

WORKDIR /app

COPY ./client/package*.json ./client/

WORKDIR /app/client
RUN npm install

COPY ./client .
RUN npm run build


FROM nginx
COPY ./client/nginx.conf /etc/nginx/nginx.conf
COPY --from=base app/client/build /etc/nginx/html

EXPOSE 8080 80
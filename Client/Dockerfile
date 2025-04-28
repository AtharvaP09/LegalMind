# Frontend Dockerfile
FROM node:20 as build

WORKDIR /app

COPY Client/package*.json ./
RUN npm install

COPY Client/ .
RUN npm run build

# Serve build with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

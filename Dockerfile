FROM node:20-alpine AS build

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:stable-alpine

# Удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем свой конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем билд фронта
COPY --from=build /app/build /usr/share/nginx/html
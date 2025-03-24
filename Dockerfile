# Этап сборки
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Этап запуска (Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# (опционально) Кастомный конфиг nginx:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
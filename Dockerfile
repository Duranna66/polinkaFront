# Этап 1: Сборка React-приложения
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

# Установка зависимостей и сборка
RUN npm install && npm run build

# Этап 2: Используем nginx для отдачи готового фронта
FROM nginx:stable-alpine

# Удалим дефолтный конфиг nginx (если хочешь свой)
RUN rm -rf /usr/share/nginx/html/*

# Копируем билд из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html
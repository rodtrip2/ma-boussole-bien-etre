FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nuxt generate

FROM nginx:alpine
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite bakes VITE_* vars into the bundle at build time, so this has to be a
# build arg rather than a runtime environment variable. Defaults to the
# backend's published host port, since the browser (not this container)
# is what actually calls the API.
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

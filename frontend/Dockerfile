# Stage 1: Build Vite React bundle
# cache-bust: v3
FROM node:20-alpine AS build

WORKDIR /app

# Declare build-time env vars for Vite
# These MUST be passed as --build-arg in Railway or docker build commands
# because Vite bakes VITE_* variables into the JS bundle at build time (not runtime)
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ARG VITE_VISION_API_URL=http://localhost:8001/api/v1/ml

# Expose them as env vars so Vite picks them up during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_VISION_API_URL=$VITE_VISION_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve static SPA with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

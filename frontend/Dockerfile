FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build

# "outputPath": "dist/frontend"

FROM nginx:latest

COPY --from=build /usr/local/app/dist/frontend/browser /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
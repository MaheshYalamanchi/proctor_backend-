### STAGE 1: Build ###
#FROM node:12.7-alpine AS build
FROM node:14.19.0 AS build
RUN npm config set registry http://registry.npmjs.org/ 

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

EXPOSE 3002

# CMD ["node","app.js"]
CMD ["node", "app.js"]
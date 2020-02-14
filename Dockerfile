#!/usr/bin/env node

FROM node:8

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

#RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3300

CMD [ "npm", "start" ]

FROM node:8.11.4-alpine


COPY package.json \
     package-lock.json \
     ./

RUN npm i

COPY index.js .

ENTRYPOINT node index.js

FROM node:latest

WORKDIR ./app
COPY package.json .
RUN npm install
COPY ./public ./public
COPY ./src ./src

ENTRYPOINT ["npm"]

CMD ["start"]
# https://boredhacking.com/next-js-docker-ecr/
# https://medium.com/@khwsc1/a-simple-react-next-js-app-development-on-docker-6f0bd3f78c2c
# https://medium.com/swlh/dockerize-your-next-js-application-91ade32baa6

FROM node:10-alpine

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]

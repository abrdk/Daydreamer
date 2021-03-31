FROM node:alpine

WORKDIR /var/www

COPY . .

ARG NODE_ENV
RUN if [[ "$NODE_ENV" == "production" ]] ; then \
        npm i ; \
        npx next build ; \
    fi

CMD [ "npx", "next", "start"]



#
#FROM node:alpine
#
#WORKDIR /var/www
#
#COPY . .
#
#RUN npm install
#RUN npm run build
#RUN rimraf node_modules
#
#CMD [ "npm", "run", "start"]

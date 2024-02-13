FROM node:14-alpine
USER node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm run build
EXPOSE 3000
CMD node dist
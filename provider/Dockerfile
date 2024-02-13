FROM node:20-alpine
USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node ./src ./src
RUN npm install
RUN npm run build
EXPOSE 3000
CMD node dist
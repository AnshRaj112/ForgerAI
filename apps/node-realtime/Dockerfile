FROM node:22-alpine

WORKDIR /app
COPY apps/node-realtime/package.json /app/package.json
RUN npm install

COPY apps/node-realtime/src /app/src

ENV PORT=4010
EXPOSE 4010

CMD ["npm", "run", "start"]

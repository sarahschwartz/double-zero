FROM node:22-slim

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY lerna.json .

COPY packages/api/package.json packages/api/package.json
COPY packages/app/package.json packages/app/package.json
COPY packages/data-fetcher/package.json packages/data-fetcher/package.json
COPY packages/private-rpc/package.json packages/private-rpc/package.json
COPY packages/proxy/package.json packages/proxy/package.json
COPY packages/worker/package.json packages/worker/package.json

RUN yarn install --all

COPY . .

RUN yarn build
FROM node:lts-alpine AS builder
WORKDIR /etc/app
COPY . ./
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git  openssh-client  openssh-keygen && \
  npm install --quiet node-gyp -g && yarn install && npm run build && rm -rf /usr/local/lib/node_modules/npm/ /usr/local/bin/npm


FROM node:lts-alpine AS dependencies
WORKDIR /etc/app
COPY . ./
RUN yarn install --production && yarn add pm2

FROM node:lts-alpine
WORKDIR /etc/app
COPY --from=dependencies /etc/app/node_modules ./node_modules
COPY --from=builder /etc/app/dist ./dist
COPY --from=builder /etc/app/package.json .
COPY --from=builder /etc/app/yarn.lock .
COPY --from=builder /etc/app/jest.config.json .
COPY --from=builder /etc/app/ecosystem.config.js .
COPY --from=builder /etc/app/static ./static
CMD npm run start:cloud
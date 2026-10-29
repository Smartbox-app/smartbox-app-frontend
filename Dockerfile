FROM node:22-alpine

ARG BRANCH=prod
ARG VITE_MAPBOX_ACCESS_TOKEN

WORKDIR /app

RUN apk add --no-cache tzdata \
  && cp /usr/share/zoneinfo/Europe/Warsaw /etc/localtime \
  && echo "Europe/Warsaw" > /etc/timezone \
  && corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages ./packages

RUN yarn install --frozen-lockfile

COPY . .

ENV VITE_MAPBOX_ACCESS_TOKEN=$VITE_MAPBOX_ACCESS_TOKEN

RUN yarn "build-${BRANCH}" && yarn build-ssr

ENV NODE_ENV=production \
  FE_FILES_PATH=/app/dist \
  ENABLE_X_SENDFILE=false \
  FRONTEND_PORT=3204

EXPOSE 3204

CMD ["node", "ssr/dist/index.js"]

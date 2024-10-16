# Create by this guide:
# https://www.txconsole.com/posts/how-to-containerize-nextjs-app-with-docker-build

FROM node:20-alpine AS deps
 
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

 
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Work only on google cloud build
# COPY /workspace/sa_key.json ./
 
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ARG PUBLIC_APP_NAME=garage51
ENV NEXT_PUBLIC_APP_NAME=$PUBLIC_APP_NAME
ENV GOOGLE_APPLICATION_CREDENTIALS=sa_key.json

# Setting the HOSTNAME is somehow required for binding the server to 0.0.0.0 (even though it is the default value).
# This allows to make requests to the API inside the container.
# This is mostly needed for data fetching from the API by server components.
ENV HOSTNAME=127.0.0.1

RUN yarn run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
 
RUN addgroup --system --gid 1001 nodegrp
RUN adduser --system --uid 1001 nodeuser
RUN mkdir -p -m 0755 /app/.next/cache
RUN chown nodeuser:nodegrp /app/.next/cache

# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/public ./public # todo: is this needed?
COPY --from=builder /app/package.json ./package.json
 
# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nodeuser:nodegrp /app/.next/standalone ./
COPY --from=builder --chown=nodeuser:nodegrp /app/.next/static ./.next/static

# to run docker container locally, uncomment this line
# COPY service-account-key.json .env.local ./
 
USER nodeuser

ENV PORT=3000
ENV GOOGLE_APPLICATION_CREDENTIALS=sa_key.json

# Setting the HOSTNAME is somehow required for binding the server to 0.0.0.0 (even though it is the default value).
# This allows to make requests to the API inside the container.
# This is mostly needed for data fetching from the API by server components.
ENV HOSTNAME=0.0.0.0

EXPOSE $PORT
CMD ["node", "server.js"]

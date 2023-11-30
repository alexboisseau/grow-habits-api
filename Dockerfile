###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy pnpm-lock.yaml
COPY --chown=node:node pnpm-lock.yaml ./

# Fetch prod dependencies
RUN pnpm fetch --prod

# Copy source code
COPY --chown=node:node . .

# Install dependencies and dev dependencies
RUN pnpm install

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18 As build
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

# Copy node_modules from development stage to access nest-cli dev dependency and can run build
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Build source code
RUN pnpm build

ENV NODE_ENV production

# Install only production dependencies
RUN pnpm install --prod

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy production dependencies and builded source code
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
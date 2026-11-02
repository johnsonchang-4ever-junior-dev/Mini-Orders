# ---------- Stage 1: install packages ----------
  FROM node:22-alpine AS dependencies
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  
  # ---------- Stage 2: build the app ----------
  FROM node:22-alpine AS builder
  WORKDIR /app
  COPY --from=dependencies /app/node_modules ./node_modules
  COPY . .
  
  # NEXT_PUBLIC_ values are baked into the browser code at BUILD time
  ARG NEXT_PUBLIC_USE_MOCK
  ARG NEXT_PUBLIC_API_URL
  ARG NEXT_PUBLIC_EVENTS_URL
  ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK
  ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
  ENV NEXT_PUBLIC_EVENTS_URL=$NEXT_PUBLIC_EVENTS_URL
  
  RUN npm run build
  
  # ---------- Stage 3: run (only what's needed) ----------
  FROM node:22-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  ENV HOSTNAME=0.0.0.0
  ENV PORT=3000
  
  # Copy only the built server + static files, owned by the non-root "node" user
  COPY --from=builder --chown=node:node /app/public ./public
  COPY --from=builder --chown=node:node /app/.next/standalone ./
  COPY --from=builder --chown=node:node /app/.next/static ./.next/static
  
  USER node
  EXPOSE 3000
  CMD ["node", "server.js"]

# dependencies, builder only --from= uses them
# Only the last stage (runner) becomes your final image. The other two are thrown away after the build.

# WORKDIR /app
# It’s mkdir /app && cd /app in one line inside container.

# RUN npm ci
# npm ci installs packages from package-lock.json, so /app/node_modules now exists in this stage.

# ARG is a build-time input, like a function parameter for the Dockerfile.
# ENV is an environment variable, the same as the ones in .env.local.
# $NEXT_PUBLIC_USE_MOCK reads the ARG’s value.

# chown means “change owner”,
# Without --chown, the copied files would be owned by root
  # COPY                       copy files
  # --from=builder             ...from the builder stage
  # --chown=node:node          ...and make user node / group node their owner
  # /app/.next/standalone      what to copy (inside builder)
  # ./                         where to put it (= /app in the runner stage)
# “If someone hacks the app, they get a normal user account that can only edit programs files, not root that can edit system files”
# App runs as root (no USER line):
#   attacker -> install tools (apk add ...), edit any file, read everything
#            -> plant code that steals every visitor's data
#            -> a much better position to attack the computer running Docker
  
# App runs as node (USER node):
#   attacker -> can't install programs, can't edit system files
#            -> stuck inside one tenant's room

# What is CMD?
#   RUN npm run build          -> during docker build   (once, result saved in the image)
#   CMD ["node", "server.js"]  -> during docker run     (every time the container starts)

# Why build in a separate stage?
# 1. A small, safe final image. The builder stage needs 690 MB of node_modules, TypeScript, ESLint and Vitest to build. The app only needs about 68 MB to run. runner copies only that 68 MB, so the build tools never reach the final image.
# 2. Faster rebuilds (layer caching). Docker remembers each step’s result. If a step’s inputs didn’t change, it reuses the old result
#   Stage dependencies:  COPY package.json package-lock.json  -> RUN npm ci
#   Stage builder:       COPY . .  (your code)                 -> RUN npm run build
# The story: you edit OrderItem.tsx and rebuild:
#   package.json didn’t change, so npm ci is reused from cache ⚡ (that saves about a minute).
#   Your code changed, so only npm run build runs again.
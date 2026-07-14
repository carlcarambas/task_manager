FROM node:20-alpine
WORKDIR /app

# Install dependencies before generating the Prisma client, matching the
# local dev flow exactly (npm ci, prisma generate, nest build). Kept as a
# single stage rather than a slim multi-stage build so devDependencies
# (ts-node, prisma CLI) stay available in the running container for
# `docker compose exec backend npm run seed` — same command as local dev.
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

# `db push` runs on every container start. It's idempotent against an
# already-current schema, so this only matters (and only touches data) the
# first time a fresh volume is mounted. --accept-data-loss is required
# because db push can't prompt interactively inside a container.
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && node dist/src/main"]

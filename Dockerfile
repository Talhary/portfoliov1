# Stage 1: Install dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm install

# Stage 2: Rebuild the source code only when needed
FROM node:24-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments
ARG DATABASE_URL
ARG UPLOADTHING_SECRET
ARG JWT_KEY
ARG AUTH_SECRET
ARG UPLOADTHING_APP_ID
ARG GMAIL_PASS
ARG GMAIL
ARG JWT_TOKEN
ARG BLOG_API_KEY
ARG UPLOADTHING_TOKEN
ARG MEDIA_DOWNLOAD_API_URL
ARG OPENAI_API_BASE
ARG OPENAI_API_KEY

# Set environment variables from build arguments for build-time availability
ENV DATABASE_URL=$DATABASE_URL
ENV UPLOADTHING_SECRET=$UPLOADTHING_SECRET
ENV JWT_KEY=$JWT_KEY
ENV AUTH_SECRET=$AUTH_SECRET
ENV UPLOADTHING_APP_ID=$UPLOADTHING_APP_ID
ENV GMAIL_PASS=$GMAIL_PASS
ENV GMAIL=$GMAIL
ENV JWT_TOKEN=$JWT_TOKEN
ENV BLOG_API_KEY=$BLOG_API_KEY
ENV UPLOADTHING_TOKEN=$UPLOADTHING_TOKEN
ENV MEDIA_DOWNLOAD_API_URL=$MEDIA_DOWNLOAD_API_URL
ENV OPENAI_API_BASE=$OPENAI_API_BASE
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Generate Prisma Client (crucial for build type safety and queries)
RUN npx prisma generate

RUN npm run build

# Stage 3: Runner
FROM node:24-alpine AS runner
RUN apk add --no-cache openssl ffmpeg poppler-utils tesseract-ocr libreoffice
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments for final runner image environment
ARG DATABASE_URL
ARG UPLOADTHING_SECRET
ARG JWT_KEY
ARG AUTH_SECRET
ARG UPLOADTHING_APP_ID
ARG GMAIL_PASS
ARG GMAIL
ARG JWT_TOKEN
ARG BLOG_API_KEY
ARG UPLOADTHING_TOKEN
ARG MEDIA_DOWNLOAD_API_URL
ARG OPENAI_API_BASE
ARG OPENAI_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV UPLOADTHING_SECRET=$UPLOADTHING_SECRET
ENV JWT_KEY=$JWT_KEY
ENV AUTH_SECRET=$AUTH_SECRET
ENV UPLOADTHING_APP_ID=$UPLOADTHING_APP_ID
ENV GMAIL_PASS=$GMAIL_PASS
ENV GMAIL=$GMAIL
ENV JWT_TOKEN=$JWT_TOKEN
ENV BLOG_API_KEY=$BLOG_API_KEY
ENV UPLOADTHING_TOKEN=$UPLOADTHING_TOKEN
ENV MEDIA_DOWNLOAD_API_URL=$MEDIA_DOWNLOAD_API_URL
ENV OPENAI_API_BASE=$OPENAI_API_BASE
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache & job file storage
RUN mkdir -p .next public/temp-jobs
RUN chown -R nextjs:nodejs .next public/temp-jobs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and engines to allow runner to perform migrations/queries
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

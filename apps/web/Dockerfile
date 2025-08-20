FROM public.ecr.aws/docker/library/node:22.18.0-slim AS base
RUN apt-get -y update && apt-get install -y curl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10.6.2


FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm add -g turbo@2.4.4
RUN turbo prune web --docker


FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=web...


FROM installer AS prod
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000
ENV NODE_ENV=production
ENV AWS_LWA_ENABLE_COMPRESSION=true

WORKDIR /app

COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public
COPY --from=installer /app/apps/web/run.sh ./apps/web/run.sh

RUN ln -s /tmp/cache ./apps/web/.next/cache

RUN chmod +x ./apps/web/run.sh

CMD ["/bin/sh", "./apps/web/run.sh"]


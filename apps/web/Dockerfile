FROM public.ecr.aws/docker/library/node:24.13.1-slim AS base
RUN apt-get -y update && apt-get install -y curl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10.30.0


FROM base AS builder
WORKDIR /app

# 変更頻度の低いファイルを先にコピー
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
COPY package.json ./

# パッケージ設定をコピー
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# アプリ設定をコピー
COPY apps/web/package.json ./apps/web/

# Turbo をインストール
RUN pnpm add -g turbo@2.8.10

# ソースコードをコピー（最後に）
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN turbo prune web --docker


FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .

RUN --mount=type=secret,id=X_MICROCMS_API_KEY,env=X_MICROCMS_API_KEY \
    echo "=== DEBUG: API key length: ${#X_MICROCMS_API_KEY} ===" && \
    curl -s -o /dev/null -w "=== DEBUG: microCMS API status: %{http_code} ===\n" \
      -H "X-MICROCMS-API-KEY: ${X_MICROCMS_API_KEY}" \
      "https://daisuke-tanabe.microcms.io/api/v1/projects" && \
    pnpm turbo run build --filter=web...


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


# Build the Vite app. An empty PocketBase URL makes the client use the
# browser's current origin, so both UI and API share the same address.
FROM node:24-alpine AS frontend-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_POCKETBASE_URL=
ENV VITE_POCKETBASE_URL=${VITE_POCKETBASE_URL}
RUN npm run build

# PocketBase serves the compiled frontend and its API from one origin.
FROM alpine:3.22 AS runtime

ARG PB_VERSION=0.41.1
ARG TARGETARCH=amd64
RUN apk add --no-cache ca-certificates curl unzip \
    && case "${TARGETARCH}" in \
      amd64) PB_ARCH=amd64 ;; \
      arm64) PB_ARCH=arm64 ;; \
      *) echo "Unsupported PocketBase architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac \
    && curl -fsSL "https://ganigeorgiev.com/meta/pocketbase/pocketbase/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${PB_ARCH}.zip" -o /tmp/pocketbase.zip \
    && unzip /tmp/pocketbase.zip -d /usr/local/bin \
    && rm /tmp/pocketbase.zip \
    && chmod +x /usr/local/bin/pocketbase

WORKDIR /pb
COPY --from=frontend-builder /app/dist /pb/pb_public
COPY --from=frontend-builder /app/pocketbase/pb_migrations /pb/pb_migrations

VOLUME ["/pb/pb_data"]
EXPOSE 8090
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8090/api/health || exit 1

CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--publicDir=/pb/pb_public", "--migrationsDir=/pb/pb_migrations"]

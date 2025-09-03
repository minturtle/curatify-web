# 멀티스테이지 빌드를 위한 베이스 이미지
FROM node:20-alpine AS base

# 의존성 설치 단계
FROM base AS deps
# 패키지 매니저 캐시를 무효화하기 위한 체크섬 파일 복사
COPY package.json package-lock.json* ./
RUN npm ci --only=production --ignore-scripts

# 개발 의존성 설치 단계
FROM base AS dev-deps
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# 빌드 단계
FROM base AS builder
WORKDIR /app
COPY --from=deps /node_modules ./node_modules
COPY --from=dev-deps /node_modules ./node_modules
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드
RUN npm run build

# 프로덕션 실행 단계
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 시스템 사용자 생성 (보안 강화)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드된 애플리케이션 복사
COPY --from=builder /app/public ./public

# Next.js 정적 파일 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 사용자 변경
USER nextjs

# 포트 노출
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 애플리케이션 실행
CMD ["node", "server.js"]

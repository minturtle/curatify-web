# Curatify Web

논문 관리 및 RSS 피드 수집 웹 애플리케이션

## 프로젝트 구조

```
Root/
├── app/                          # Next.js App Router 디렉터리
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   └── register/
│   ├── api/                      # API 라우트
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 홈페이지
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                       # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/                   # 레이아웃 관련 컴포넌트
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── forms/                    # 폼 관련 컴포넌트
│   └── charts/                   # 차트 컴포넌트
├── hooks/                        # 커스텀 React Hooks
├── lib/                          # 유틸리티 및 설정
│   ├── database/                 # 데이터베이스 관련
│   │   ├── config.ts             # MongoDB 설정 및 연결 관리
│   │   ├── connection.ts         # MongoDB 연결 관리
│   │   ├── entities/             # MongoDB 스키마
│   │   │   ├── User.ts
│   │   │   ├── Paper.ts
│   │   │   ├── RSSFeed.ts
│   │   │   └── RSSItem.ts
│   │   └── services/             # 데이터베이스 서비스
│   │       └── UserService.ts
│   ├── redis/                    # Redis 관련
│   │   └── client.ts             # Redis 클라이언트 설정
│   ├── utils.ts                  # 공통 유틸리티 함수
│   ├── constants.ts              # 상수 정의
│   ├── types.ts                  # TypeScript 타입 정의
│   ├── api.ts                    # API 클라이언트 설정
│   └── init.ts                   # 애플리케이션 초기화
├── services/                     # 비즈니스 로직 서비스
├── store/                        # 상태 관리 (선택사항)
│   ├── authStore.ts
├── styles/                       # 추가 스타일 파일
│   └── components.css
├── public/                       # 정적 파일
│   ├── images/
│   ├── icons/
│   └── documents/
├── tests/                        # 테스트 파일
│   ├── components/
│   ├── hooks/
│   └── services/
├── docs/                         # 문서
│   ├── api/
│   └── deployment/
├── .env.local                    # 환경 변수
├── .env.example                  # 환경 변수 예시
├── next.config.ts                # Next.js 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # 프로젝트 의존성
└── README.md                     # 프로젝트 문서
```

## 환경별 설정

### 개발환경 (Development)

- **데이터베이스**: MongoDB (로컬)
- **캐시/세션**: Redis
- **자동 동기화**: 활성화
- **로깅**: 활성화

### 운영환경 (Production)

- **데이터베이스**: MongoDB (클라우드)
- **캐시/세션**: Redis
- **자동 동기화**: 비활성화
- **로깅**: 비활성화

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

#### 개발환경

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# MongoDB 설정
MONGODB_URI=mongodb://admin:adminpassword@localhost:27017/curatify?authSource=admin

# Redis 설정
REDIS_URL=redis://localhost:6379

# 환경 설정
NODE_ENV=development
```

#### 운영환경

```bash
# MongoDB 설정 (클라우드)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/curatify

# Redis 설정
REDIS_URL=redis://your-redis-url:6379

# 환경 설정
NODE_ENV=production
```

### 3. Docker 컨테이너 실행

```bash
cd docker
docker-compose up -d
```

### 4. 애플리케이션 실행

```bash
npm run dev
```

## 데이터베이스 마이그레이션

### Oracle → MongoDB 마이그레이션 완료

프로젝트가 Oracle 데이터베이스에서 MongoDB로 성공적으로 마이그레이션되었습니다.

#### 주요 변경사항:

- **TypeORM → Mongoose**: ORM을 TypeORM에서 Mongoose로 변경
- **Oracle → MongoDB**: 관계형 데이터베이스에서 NoSQL 데이터베이스로 변경
- **연결 관리**: MongoDB 연결 풀링 및 이벤트 리스너 추가
- **환경 변수**: `MONGODB_URI` 환경 변수 사용

#### 새로운 기능:

- MongoDB 연결 상태 모니터링
- 자동 재연결 및 연결 풀 관리
- 프로세스 종료 시 자동 연결 정리
- 개발/운영 환경별 최적화된 설정

#### 사용법:

```typescript
import { ensureDatabaseConnection, isDatabaseConnected } from '@/lib/database/connection';

// 데이터베이스 연결 확인
await ensureDatabaseConnection();

// 연결 상태 확인
if (isDatabaseConnected()) {
  // 데이터베이스 작업 수행
}
```

## 실행

### 개발 서버

```bash
npm run dev
```

### 빌드

```bash
# 개발환경 빌드
npm run build:dev

# 운영환경 빌드
npm run build:prod
```

### 서버 시작

```bash
# 개발환경 서버
npm run start:dev

# 운영환경 서버
npm run start:prod
```

## 테스트

```bash
# 테스트 실행
npm run test

# 테스트 UI
npm run test:ui

# 테스트 커버리지
npm run test:coverage
```

## 주요 기능

- **사용자 인증**: 이메일/비밀번호 기반 회원가입 및 로그인
- **논문 관리**: 논문 정보 저장, 북마크, 노트 작성
- **RSS 피드**: RSS 피드 구독 및 자동 수집
- **세션 관리**: Redis 기반 세션 관리
- **AI 태스크**: Redis 기반 백그라운드 작업 큐

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: TypeORM, MySQL (개발), Oracle (운영)
- **Cache/Session**: Redis, ioredis
- **Authentication**: iron-session
- **Testing**: Vitest, Testing Library
- **UI Components**: Radix UI, Lucide React

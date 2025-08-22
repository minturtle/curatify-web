프로젝트 구조

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
│   ├── utils.ts                  # 공통 유틸리티 함수
│   ├── constants.ts              # 상수 정의
│   ├── types.ts                  # TypeScript 타입 정의
│   └── api.ts                    # API 클라이언트 설정
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

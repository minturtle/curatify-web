// MongoDB 시드 데이터 스크립트
// curatify 데이터베이스에 초기 데이터 삽입

db = db.getSiblingDB('curatify');

// 사용자 인증 (curatify_user로 로그인)
db.auth('curatify_user', 'curatify_password');

// 샘플 사용자 데이터
const users = [
  {
    _id: ObjectId(),
    email: 'admin@curatify.com',
    password: '$2b$10$example_hash_here', // bcrypt 해시
    name: '관리자',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    email: 'user@curatify.com',
    password: '$2b$10$example_hash_here', // bcrypt 해시
    name: '테스트 사용자',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 샘플 논문 카테고리 데이터
const paperCategories = [
  {
    _id: ObjectId(),
    name: '인공지능',
    description: 'AI 및 머신러닝 관련 논문',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: '웹 개발',
    description: '웹 기술 및 프레임워크 관련 논문',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: '데이터베이스',
    description: '데이터베이스 시스템 및 설계 관련 논문',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 샘플 논문 데이터
const papers = [
  {
    _id: ObjectId(),
    title: 'MongoDB를 활용한 대용량 데이터 처리 시스템',
    authors: '김철수, 이영희, 박민수',
    updateDate: new Date('2024-01-15'),
    url: 'https://example.com/paper1',
    abstract: '이 논문은 MongoDB를 활용하여 대용량 데이터를 효율적으로 처리하는 시스템을 제안합니다...',
    summary: 'MongoDB 기반 대용량 데이터 처리 시스템 설계 및 구현',
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryIds: [paperCategories[2]._id], // 데이터베이스 카테고리
    tags: ['MongoDB', '대용량데이터', '시스템설계']
  },
  {
    _id: ObjectId(),
    title: 'NoSQL 데이터베이스의 성능 최적화 기법',
    authors: '최지훈, 정수진',
    updateDate: new Date('2024-01-10'),
    url: 'https://example.com/paper2',
    abstract: 'NoSQL 데이터베이스의 성능을 최적화하기 위한 다양한 기법들을 분석하고 비교합니다...',
    summary: 'NoSQL DB 성능 최적화 기법 분석 및 비교',
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryIds: [paperCategories[2]._id], // 데이터베이스 카테고리
    tags: ['NoSQL', '성능최적화', '데이터베이스']
  }
];

// 샘플 RSS URL 데이터
const rssUrls = [
  {
    _id: ObjectId(),
    type: 'normal',
    url: 'https://rss.example.com/ai-news',
    userId: users[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    _id: ObjectId(),
    type: 'youtube',
    url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC123456789',
    userId: users[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }
];

// 샘플 RSS Feed 데이터
const rssFeeds = [
  {
    _id: ObjectId(),
    title: 'AI 기술의 최신 동향',
    summary: '인공지능 분야의 최신 연구 동향과 기술 발전에 대한 요약...',
    writedAt: new Date('2024-01-20'),
    originalUrl: 'https://example.com/ai-trends',
    rssUrlId: rssUrls[0]._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 샘플 사용자 라이브러리 데이터
const userLibraries = [
  {
    _id: ObjectId(),
    userId: users[0]._id,
    paperId: papers[0]._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 샘플 사용자 관심사 데이터
const userInterests = [
  {
    _id: ObjectId(),
    userId: users[0]._id,
    categoryId: paperCategories[0]._id, // AI 카테고리
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 데이터 삽입
console.log('시드 데이터 삽입 시작...');

// 컬렉션 초기화
db.users.deleteMany({});
db.papers.deleteMany({});
db.paper_categories.deleteMany({});
db.rss_urls.deleteMany({});
db.rss_feeds.deleteMany({});
db.user_libraries.deleteMany({});
db.user_interests.deleteMany({});

// 데이터 삽입
db.users.insertMany(users);
db.paper_categories.insertMany(paperCategories);
db.papers.insertMany(papers);
db.rss_urls.insertMany(rssUrls);
db.rss_feeds.insertMany(rssFeeds);
db.user_libraries.insertMany(userLibraries);
db.user_interests.insertMany(userInterests);

console.log('시드 데이터 삽입 완료!');
console.log(`- 사용자: ${users.length}명`);
console.log(`- 논문 카테고리: ${paperCategories.length}개`);
console.log(`- 논문: ${papers.length}개`);
console.log(`- RSS URL: ${rssUrls.length}개`);
console.log(`- RSS Feed: ${rssFeeds.length}개`);
console.log(`- 사용자 라이브러리: ${userLibraries.length}개`);
console.log(`- 사용자 관심사: ${userInterests.length}개`);

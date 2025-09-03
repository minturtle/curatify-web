// MongoDB 초기화 스크립트
// curatify 데이터베이스 생성 및 초기 설정

// curatify 데이터베이스 선택
db = db.getSiblingDB('curatify');

// 애플리케이션 사용자 생성
db.createUser({
  user: 'curatify_user',
  pwd: 'curatify_password',
  roles: [
    {
      role: 'readWrite',
      db: 'curatify'
    }
  ]
});

// 컬렉션 생성 (MongoDB는 자동으로 생성되지만 명시적으로 생성)
db.createCollection('users');
db.createCollection('papers');
db.createCollection('rss_urls');
db.createCollection('rss_feeds');
db.createCollection('paper_categories');
db.createCollection('paper_contents');
db.createCollection('user_libraries');
db.createCollection('user_interests');

// 인덱스 생성
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.papers.createIndex({ "title": "text", "abstract": "text" });
db.papers.createIndex({ "createdAt": 1 });
db.papers.createIndex({ "updateDate": 1 });

db.rss_urls.createIndex({ "userId": 1 });
db.rss_urls.createIndex({ "type": 1 });
db.rss_urls.createIndex({ "deletedAt": 1 });

db.rss_feeds.createIndex({ "rssUrlId": 1 });
db.rss_feeds.createIndex({ "writedAt": 1 });

db.paper_categories.createIndex({ "name": 1 });

db.user_libraries.createIndex({ "userId": 1, "paperId": 1 }, { unique: true });
db.user_libraries.createIndex({ "userId": 1 });

db.user_interests.createIndex({ "userId": 1, "categoryId": 1 }, { unique: true });

console.log('MongoDB 초기화 완료');
console.log('- 데이터베이스: curatify');
console.log('- 사용자: curatify_user');
console.log('- 컬렉션 및 인덱스 생성 완료');

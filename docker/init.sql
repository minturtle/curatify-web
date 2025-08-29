-- Curify 데이터베이스 초기화 스크립트

-- 데이터베이스 생성 (이미 환경변수로 생성됨)
-- CREATE DATABASE IF NOT EXISTS curify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 사용
USE curatify;

-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RSS URL 테이블 생성
CREATE TABLE IF NOT EXISTS rss_urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('youtube', 'normal') NOT NULL,
    url VARCHAR(500) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_user_deleted_at (user_id, deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RSS Feed 테이블 생성
CREATE TABLE IF NOT EXISTS rss_feeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    writed_at TIMESTAMP NOT NULL,
    original_url VARCHAR(500),
    rss_url_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rss_url_id) REFERENCES rss_urls(id),
    INDEX idx_rss_url_id (rss_url_id),
    INDEX idx_writed_at (writed_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CS Papers 테이블 생성
CREATE TABLE IF NOT EXISTS cs_papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    all_categories VARCHAR(200),
    authors TEXT,
    update_date TIMESTAMP NULL,
    url VARCHAR(500),
    abstract TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories (all_categories),
    INDEX idx_update_date (update_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샘플 데이터 삽입 (선택사항)
-- INSERT INTO users (email, password, name, is_verified) VALUES 
-- ('admin@curify.com', '$2b$10$hashedpassword', 'Admin User', TRUE);

-- 권한 설정
GRANT ALL PRIVILEGES ON curatify.* TO 'curatify_user'@'%';
FLUSH PRIVILEGES;

-- 테이블 생성 확인
SHOW TABLES;

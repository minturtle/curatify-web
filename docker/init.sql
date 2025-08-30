-- Curify 데이터베이스 초기화 스크립트

-- 문자셋 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

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

-- Paper Content 테이블 생성 (논문 상세 내용)
CREATE TABLE IF NOT EXISTS paper_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    authors TEXT,
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paper_id INT NOT NULL,
    FOREIGN KEY (paper_id) REFERENCES cs_papers(id) ON DELETE CASCADE,
    INDEX idx_paper_id (paper_id),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_paper_content (paper_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Library 테이블 생성 (사용자 논문 라이브러리)
CREATE TABLE IF NOT EXISTS user_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    paper_content_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (paper_content_id) REFERENCES paper_content(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_paper_content_id (paper_content_id),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_paper (user_id, paper_content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Interests 테이블 생성 (사용자 관심사)
CREATE TABLE IF NOT EXISTS user_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 권한 설정
GRANT ALL PRIVILEGES ON curatify.* TO 'curatify_user'@'%';
FLUSH PRIVILEGES;

-- 테이블 생성 확인
SHOW TABLES;

-- 데이터베이스 선택
USE ssd_database;

-- 권한 설정
GRANT ALL PRIVILEGES ON ssd_database.* TO 'ssd_user'@'%';
FLUSH PRIVILEGES;

-- users 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    plain_password VARCHAR(255),
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- datas 테이블
CREATE TABLE IF NOT EXISTS datas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    data_key VARCHAR(100) NOT NULL,
    data_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, plain_password, password, role) VALUES ('admin', 'admin@gmail.com', 'REDACTED' ,'$2b$10$DorSD/NoHqxl99kbvZsb1OEeaEs3XRgkSa.NvBEFNWTll.ouO1Qjq', 'admin');
INSERT INTO datas (user_id, data_key, data_value) VALUES (1, 'flag', 'SSD{REDACTED}');
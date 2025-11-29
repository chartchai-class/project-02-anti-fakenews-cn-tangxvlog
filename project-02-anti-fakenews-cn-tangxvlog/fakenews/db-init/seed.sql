CREATE DATABASE IF NOT EXISTS `fakenews` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fakenews`;

CREATE TABLE IF NOT EXISTS `news` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` TEXT NOT NULL,
  `reporter` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `image_url` VARCHAR(512),
  `source` VARCHAR(255),
  `link` VARCHAR(512),
  `likes` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `vote` (
  `id` VARCHAR(64) PRIMARY KEY,
  `news_id` BIGINT NOT NULL,
  `choice` ENUM('fake','not_fake') NOT NULL,
  `comment` TEXT,
  `image_url` VARCHAR(512),
  `voter` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  CONSTRAINT `fk_vote_news` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `news` (`title`, `summary`, `content`, `reporter`, `created_at`, `image_url`, `source`, `link`) VALUES
('City council debates new policy（示例）','示例：City council 正在 debates new policy，相关部门与公众反应不一。','示例正文：City council 正在 debates new policy。官方与专家给出简短回应，进一步核查仍在进行。','示例记者A', NOW(), 'https://picsum.photos/seed/news-0/960/540','Global Times','https://example.com/news/0'),
('Government issues warning（示例）','示例：Government 正在 issues warning，相关部门与公众反应不一。','示例正文：Government 正在 issues warning。官方与专家给出简短回应，进一步核查仍在进行。','示例记者B', NOW(), 'https://picsum.photos/seed/news-1/960/540','Daily Watch','https://example.com/news/1'),
('Tech giant faces data breach（示例）','示例：Tech giant 正在 faces data breach，相关部门与公众反应不一。','示例正文：Tech giant 正在 faces data breach。官方与专家给出简短回应，进一步核查仍在进行。','示例记者C', NOW(), 'https://picsum.photos/seed/news-2/960/540','Metro News','https://example.com/news/2'),
('Researchers announces layoffs（示例）','示例：Researchers 正在 announces layoffs，相关部门与公众反应不一。','示例正文：Researchers 正在 announces layoffs。官方与专家给出简短回应，进一步核查仍在进行。','示例记者D', NOW(), 'https://picsum.photos/seed/news-3/960/540','TechWire','https://example.com/news/3'),
('Local police launches investigation（示例）','示例：Local police 正在 launches investigation，相关部门与公众反应不一。','示例正文：Local police 正在 launches investigation。官方与专家给出简短回应，进一步核查仍在进行。','示例记者E', NOW(), 'https://picsum.photos/seed/news-4/960/540','Global Times','https://example.com/news/4'),
('Health agency debates new policy（示例）','示例：Health agency 正在 debates new policy，相关部门与公众反应不一。','示例正文：Health agency 正在 debates new policy。官方与专家给出简短回应，进一步核查仍在进行。','示例记者F', NOW(), 'https://picsum.photos/seed/news-5/960/540','Daily Watch','https://example.com/news/5'),
('School board issues warning（示例）','示例：School board 正在 issues warning，相关部门与公众反应不一。','示例正文：School board 正在 issues warning。官方与专家给出简短回应，进一步核查仍在进行。','示例记者G', NOW(), 'https://picsum.photos/seed/news-6/960/540','Metro News','https://example.com/news/6'),
('Bank faces data breach（示例）','示例：Bank 正在 faces data breach，相关部门与公众反应不一。','示例正文：Bank 正在 faces data breach。官方与专家给出简短回应，进一步核查仍在进行。','示例记者H', NOW(), 'https://picsum.photos/seed/news-7/960/540','TechWire','https://example.com/news/7'),
('Weather service announces layoffs（示例）','示例：Weather service 正在 announces layoffs，相关部门与公众反应不一。','示例正文：Weather service 正在 announces layoffs。官方与专家给出简短回应，进一步核查仍在进行。','示例记者I', NOW(), 'https://picsum.photos/seed/news-8/960/540','Global Times','https://example.com/news/8'),
('Sports team launches investigation（示例）','示例：Sports team 正在 launches investigation，相关部门与公众反应不一。','示例正文：Sports team 正在 launches investigation。官方与专家给出简短回应，进一步核查仍在进行。','示例记者J', NOW(), 'https://picsum.photos/seed/news-9/960/540','Daily Watch','https://example.com/news/9'),
('Energy firm debates new policy（示例）','示例：Energy firm 正在 debates new policy，相关部门与公众反应不一。','示例正文：Energy firm 正在 debates new policy。官方与专家给出简短回应，进一步核查仍在进行。','示例记者K', NOW(), 'https://picsum.photos/seed/news-10/960/540','Metro News','https://example.com/news/10'),
('Transit authority issues warning（示例）','示例：Transit authority 正在 issues warning，相关部门与公众反应不一。','示例正文：Transit authority 正在 issues warning。官方与专家给出简短回应，进一步核查仍在进行。','示例记者L', NOW(), 'https://picsum.photos/seed/news-11/960/540','TechWire','https://example.com/news/11');

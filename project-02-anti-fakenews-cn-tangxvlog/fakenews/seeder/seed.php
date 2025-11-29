<?php
$host = getenv('DB_HOST') ?: 'db';
$port = getenv('DB_PORT') ?: '3306';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: 'password';
$db   = getenv('DB_NAME') ?: 'fakenews';

try {
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$db`");

    $pdo->exec("CREATE TABLE IF NOT EXISTS news (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        reporter VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        image_url VARCHAR(512) NULL,
        source VARCHAR(255) NULL,
        link VARCHAR(512) NULL,
        likes INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS vote (
        id VARCHAR(64) PRIMARY KEY,
        news_id BIGINT NOT NULL,
        choice ENUM('fake','not_fake') NOT NULL,
        comment TEXT NULL,
        image_url VARCHAR(512) NULL,
        voter VARCHAR(255) NULL,
        created_at DATETIME NOT NULL,
        CONSTRAINT fk_vote_news FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("INSERT INTO news (title, summary, content, reporter, created_at, image_url, source, link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    $now = time();
    $subjects = ['City council','Government','Tech giant','Researchers','Local police','Health agency','School board','Bank'];
    $actions  = ['debates new policy','issues warning','faces data breach','announces layoffs','launches investigation'];
    $sources  = ['Global Times','Daily Watch','Metro News','TechWire'];
    for ($i = 0; $i < 12; $i++) {
        $created = date('Y-m-d H:i:s', $now - $i * 3600);
        $sbj = $subjects[$i % count($subjects)];
        $act = $actions[($i * 3) % count($actions)];
        $source = $sources[$i % count($sources)];
        $zhTitle = "$sbj $act（示例）";
        $zhSummary = "示例：$sbj 正在 $act，相关部门与公众反应不一。";
        $zhContent = "示例正文：$sbj 正在 $act。官方与专家给出简短回应，进一步核查仍在进行。";
        $reporter = '示例记者' . chr(65 + ($i % 26));
        $imageUrl = "https://picsum.photos/seed/news-$i/960/540";
        $link = "https://example.com/news/$i";
        $stmt->execute([$zhTitle, $zhSummary, $zhContent, $reporter, $created, $imageUrl, $source, $link]);
    }

    echo "Seed completed.\n";
} catch (Throwable $e) {
    fwrite(STDERR, "Seed failed: " . $e->getMessage() . "\n");
    exit(1);
}

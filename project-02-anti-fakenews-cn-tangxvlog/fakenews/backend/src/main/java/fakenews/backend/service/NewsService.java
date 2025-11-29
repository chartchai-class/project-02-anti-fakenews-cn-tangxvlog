package fakenews.backend.service;

import fakenews.backend.dto.CreateNewsRequest;
import fakenews.backend.dto.NewsDTO;
import fakenews.backend.model.News;
import fakenews.backend.repository.NewsRepository;
import fakenews.backend.repository.CommentRepository;
import fakenews.backend.repository.VoteRepository;
import fakenews.backend.repository.LikeRecordRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
public class NewsService {
    private final NewsRepository newsRepository;
    private final VoteRepository voteRepository;
    private final CommentRepository commentRepository;
    private final LikeRecordRepository likeRecordRepository;

    public NewsService(NewsRepository newsRepository, VoteRepository voteRepository, CommentRepository commentRepository, LikeRecordRepository likeRecordRepository) {
        this.newsRepository = newsRepository;
        this.voteRepository = voteRepository;
        this.commentRepository = commentRepository;
        this.likeRecordRepository = likeRecordRepository;
    }

    public List<NewsDTO> list() {
        return newsRepository.findAll().stream()
                .sorted(Comparator.comparing(News::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(NewsDTO::from)
                .toList();
    }

    public List<NewsDTO> search(String q) {
        String k = q == null ? "" : q.trim();
        if (k.isEmpty()) return list();
        return newsRepository.findByTitleContainingIgnoreCase(k).stream()
                .sorted(Comparator.comparing(News::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(NewsDTO::from)
                .toList();
    }

    public NewsDTO get(Long id) {
        News n = newsRepository.findById(id).orElseThrow();
        return NewsDTO.from(n);
    }

    public NewsDTO create(CreateNewsRequest req) {
        News n = new News();
        n.setTitle(req.getTitle().trim());
        n.setSummary(req.getSummary().trim());
        n.setContent(req.getContent().trim());
        n.setReporter(req.getReporter().trim());
        n.setImageUrl(req.getImageUrl() != null ? req.getImageUrl().trim() : null);
        n.setCreatedAt(Instant.now());
        // 初始点赞：15-20 随机
        n.setLikes((int) (15 + Math.random() * 6));
        News saved = newsRepository.save(n);
        return NewsDTO.from(saved);
    }

    public int like(Long id, String clientId) {
        News n = newsRepository.findById(id).orElseThrow();
        boolean exists = likeRecordRepository.existsByNewsIdAndClientId(id, clientId);
        if (!exists) {
            n.setLikes(n.getLikes() + 1);
            newsRepository.save(n);
            // 记录唯一点赞
            var rec = new fakenews.backend.model.LikeRecord();
            rec.setNews(n);
            rec.setClientId(clientId);
            likeRecordRepository.save(rec);
        }
        return n.getLikes();
    }

    public static class LikeStatus {
        private final int likes;
        private final boolean liked;
        public LikeStatus(int likes, boolean liked) { this.likes = likes; this.liked = liked; }
        public int getLikes() { return likes; }
        public boolean isLiked() { return liked; }
    }

    @Transactional
    public LikeStatus toggleLike(Long id, String clientId) {
        News n = newsRepository.findById(id).orElseThrow();
        boolean exists = likeRecordRepository.existsByNewsIdAndClientId(id, clientId);
        if (exists) {
            n.setLikes(Math.max(0, n.getLikes() - 1));
            newsRepository.save(n);
            likeRecordRepository.deleteByNewsIdAndClientId(id, clientId);
            return new LikeStatus(n.getLikes(), false);
        } else {
            n.setLikes(n.getLikes() + 1);
            newsRepository.save(n);
            var rec = new fakenews.backend.model.LikeRecord();
            rec.setNews(n);
            rec.setClientId(clientId);
            likeRecordRepository.save(rec);
            return new LikeStatus(n.getLikes(), true);
        }
    }

    @Transactional
    public int initLikes(int min, int max) {
        int lo = Math.max(0, Math.min(min, max));
        int hi = Math.max(min, max);
        int updated = 0;
        for (News n : newsRepository.findAll()) {
            if (n.getLikes() < lo) {
                int val = lo + (int) (Math.random() * (hi - lo + 1));
                n.setLikes(val);
                newsRepository.save(n);
                updated += 1;
            }
        }
        return updated;
    }

    @Transactional
    public int resetLikes(int min, int max) {
        int lo = Math.max(0, Math.min(min, max));
        int hi = Math.max(min, max);
        int updated = 0;
        for (News n : newsRepository.findAll()) {
            int val = lo + (int) (Math.random() * (hi - lo + 1));
            n.setLikes(val);
            newsRepository.save(n);
            updated += 1;
        }
        return updated;
    }

    @Transactional
    public int trimToSize(int target) {
        int t = Math.max(0, target);
        List<News> all = newsRepository.findAll().stream()
                .sorted(Comparator.comparing(News::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();
        int removed = 0;
        for (int i = t; i < all.size(); i++) {
            News n = all.get(i);
            Long nid = n.getId();
            commentRepository.deleteByNewsId(nid);
            voteRepository.deleteByNewsId(nid);
            newsRepository.delete(n);
            removed += 1;
        }
        return removed;
    }
}

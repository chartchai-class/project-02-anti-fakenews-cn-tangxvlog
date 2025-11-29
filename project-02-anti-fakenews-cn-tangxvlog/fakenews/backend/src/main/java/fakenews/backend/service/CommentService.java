package fakenews.backend.service;

import fakenews.backend.dto.CommentDTO;
import fakenews.backend.dto.CreateCommentRequest;
import fakenews.backend.model.Comment;
import fakenews.backend.model.News;
import fakenews.backend.model.VoteChoice;
import fakenews.backend.repository.CommentRepository;
import fakenews.backend.repository.NewsRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final NewsRepository newsRepository;

    public CommentService(CommentRepository commentRepository, NewsRepository newsRepository) {
        this.commentRepository = commentRepository;
        this.newsRepository = newsRepository;
    }

    public CommentDTO add(Long newsId, CreateCommentRequest req) {
        News news = newsRepository.findById(newsId).orElseThrow();
        Comment c = new Comment();
        c.setNews(news);
        c.setChoice(mapChoice(req.getChoice()));
        c.setComment(req.getComment());
        c.setImageUrl(req.getImageUrl());
        c.setVoter(req.getVoter());
        Comment saved = commentRepository.save(c);
        return CommentDTO.from(saved);
    }

    public List<CommentDTO> list(Long newsId, int page, int size) {
        int p = Math.max(0, page - 1);
        int s = Math.max(1, Math.min(size, 20));
        Pageable pageable = PageRequest.of(p, s);
        return commentRepository.findByNewsId(newsId, pageable).stream().map(CommentDTO::from).toList();
    }

    private VoteChoice mapChoice(String s) {
        String v = s == null ? "" : s.trim().toLowerCase();
        if ("fake".equals(v)) return VoteChoice.FAKE;
        if ("not_fake".equals(v)) return VoteChoice.NOT_FAKE;
        throw new IllegalArgumentException("choice must be 'fake' or 'not_fake'");
    }
}


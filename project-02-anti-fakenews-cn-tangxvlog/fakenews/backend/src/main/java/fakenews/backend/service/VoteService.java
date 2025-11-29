package fakenews.backend.service;

import fakenews.backend.dto.CreateVoteRequest;
import fakenews.backend.dto.VoteCountsDTO;
import fakenews.backend.dto.VoteDTO;
import fakenews.backend.model.News;
import fakenews.backend.model.Vote;
import fakenews.backend.model.Comment;
import fakenews.backend.model.VoteChoice;
import fakenews.backend.repository.NewsRepository;
import fakenews.backend.repository.VoteRepository;
import fakenews.backend.repository.CommentRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoteService {
    private final VoteRepository voteRepository;
    private final NewsRepository newsRepository;
    private final CommentRepository commentRepository;

    public VoteService(VoteRepository voteRepository, NewsRepository newsRepository, CommentRepository commentRepository) {
        this.voteRepository = voteRepository;
        this.newsRepository = newsRepository;
        this.commentRepository = commentRepository;
    }

    public VoteDTO add(Long newsId, CreateVoteRequest req) {
        News news = newsRepository.findById(newsId).orElseThrow();
        Vote v = new Vote();
        v.setNews(news);
        v.setChoice(mapChoice(req.getChoice()));
        v.setComment(req.getComment());
        v.setImageUrl(req.getImageUrl());
        v.setVoter(req.getVoter());
        Vote saved = voteRepository.save(v);
        if (saved.getComment() != null || saved.getImageUrl() != null) {
            Comment c = new Comment();
            c.setNews(news);
            c.setChoice(saved.getChoice());
            c.setComment(saved.getComment());
            c.setImageUrl(saved.getImageUrl());
            c.setVoter(saved.getVoter());
            commentRepository.save(c);
        }
        return VoteDTO.from(saved);
    }

    public VoteCountsDTO counts(Long newsId) {
        long fake = voteRepository.countByNewsIdAndChoice(newsId, VoteChoice.FAKE);
        long notFake = voteRepository.countByNewsIdAndChoice(newsId, VoteChoice.NOT_FAKE);
        return new VoteCountsDTO(fake, notFake);
    }

    public List<VoteDTO> comments(Long newsId, int page, int size) {
        int p = Math.max(0, page - 1);
        int s = Math.max(1, Math.min(size, 20));
        Pageable pageable = PageRequest.of(p, s);
        return voteRepository.findCommentsByNewsId(newsId, pageable).stream().map(VoteDTO::from).toList();
    }

    @Transactional
    public void deleteByNewsId(Long newsId) {
        voteRepository.deleteByNewsId(newsId);
    }

    private VoteChoice mapChoice(String s) {
        String v = s == null ? "" : s.trim().toLowerCase();
        if ("fake".equals(v)) return VoteChoice.FAKE;
        if ("not_fake".equals(v)) return VoteChoice.NOT_FAKE;
        throw new IllegalArgumentException("choice must be 'fake' or 'not_fake'");
    }
}

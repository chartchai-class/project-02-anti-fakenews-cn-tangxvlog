package fakenews.backend.controller;

import fakenews.backend.dto.CreateNewsRequest;
import fakenews.backend.dto.CreateVoteRequest;
import fakenews.backend.dto.CreateCommentRequest;
import fakenews.backend.dto.CommentDTO;
import fakenews.backend.dto.LikeRequest;
import fakenews.backend.dto.NewsDTO;
import fakenews.backend.dto.VoteCountsDTO;
import fakenews.backend.dto.VoteDTO;
import fakenews.backend.service.NewsService;
import fakenews.backend.service.VoteService;
import fakenews.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;
    private final VoteService voteService;
    private final CommentService commentService;

    public NewsController(NewsService newsService, VoteService voteService, CommentService commentService) {
        this.newsService = newsService;
        this.voteService = voteService;
        this.commentService = commentService;
    }

    @GetMapping
    public List<NewsDTO> list(@RequestParam(name = "q", required = false) String q) {
        if (q == null || q.trim().isEmpty()) return newsService.list();
        return newsService.search(q);
    }

    @GetMapping("/{id}")
    public NewsDTO get(@PathVariable Long id) { return newsService.get(id); }

    @PostMapping
    public ResponseEntity<NewsDTO> create(@RequestBody @Valid CreateNewsRequest req) {
        return ResponseEntity.ok(newsService.create(req));
    }

    @PostMapping("/{id}/like")
    public Map<String, Object> like(@PathVariable Long id, @RequestBody @Valid LikeRequest req) {
        int before = newsService.get(id).getLikes();
        int likes = newsService.like(id, req.getClientId());
        boolean alreadyLiked = likes == before;
        return Map.of("likes", likes, "alreadyLiked", alreadyLiked);
    }

    @PostMapping("/{id}/like/toggle")
    public Map<String, Object> toggleLike(@PathVariable Long id, @RequestBody @Valid LikeRequest req) {
        var st = newsService.toggleLike(id, req.getClientId());
        return Map.of("likes", st.getLikes(), "liked", st.isLiked());
    }

    @PostMapping("/{id}/votes")
    public ResponseEntity<VoteDTO> addVote(@PathVariable Long id, @RequestBody @Valid CreateVoteRequest req) {
        return ResponseEntity.ok(voteService.add(id, req));
    }

    @GetMapping("/{id}/votes/counts")
    public VoteCountsDTO counts(@PathVariable Long id) { return voteService.counts(id); }

    @GetMapping("/{id}/comments")
    public List<CommentDTO> comments(@PathVariable Long id,
                                     @RequestParam(name = "page", defaultValue = "1") Integer page,
                                     @RequestParam(name = "size", defaultValue = "5") Integer size) {
        return commentService.list(id, page, size);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id, @RequestBody @Valid CreateCommentRequest req) {
        return ResponseEntity.ok(commentService.add(id, req));
    }

    @PostMapping("/trim")
    public Map<String, Integer> trim(@RequestParam(name = "target", defaultValue = "80") Integer target) {
        int removed = newsService.trimToSize(target);
        return Map.of("removed", removed);
    }

    @PostMapping("/init-likes")
    public Map<String, Integer> initLikes(@RequestParam(name = "min", defaultValue = "15") Integer min,
                                          @RequestParam(name = "max", defaultValue = "20") Integer max) {
        int updated = newsService.initLikes(min, max);
        return Map.of("updated", updated);
    }

    @PostMapping("/reset-likes")
    public Map<String, Integer> resetLikes(@RequestParam(name = "min", defaultValue = "15") Integer min,
                                           @RequestParam(name = "max", defaultValue = "20") Integer max) {
        int updated = newsService.resetLikes(min, max);
        return Map.of("updated", updated);
    }
}

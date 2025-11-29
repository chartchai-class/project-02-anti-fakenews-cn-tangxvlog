package fakenews.backend.dto;

import fakenews.backend.model.Comment;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class CommentDTO {
    private String id;
    private Long newsId;
    private String choice;
    private String comment;
    private String imageUrl;
    private String voter;
    private String createdAt;

    public static CommentDTO from(Comment c) {
        CommentDTO d = new CommentDTO();
        d.id = c.getId();
        d.newsId = c.getNews() != null ? c.getNews().getId() : null;
        d.choice = c.getChoice() != null ? (c.getChoice().name().equals("FAKE") ? "fake" : "not_fake") : null;
        d.comment = c.getComment();
        d.imageUrl = c.getImageUrl();
        d.voter = c.getVoter();
        d.createdAt = c.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(c.getCreatedAt().atOffset(ZoneOffset.UTC)) : null;
        return d;
    }

    public String getId() { return id; }
    public Long getNewsId() { return newsId; }
    public String getChoice() { return choice; }
    public String getComment() { return comment; }
    public String getImageUrl() { return imageUrl; }
    public String getVoter() { return voter; }
    public String getCreatedAt() { return createdAt; }
}


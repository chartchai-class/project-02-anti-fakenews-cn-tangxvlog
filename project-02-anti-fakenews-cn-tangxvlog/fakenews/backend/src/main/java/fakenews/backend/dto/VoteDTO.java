package fakenews.backend.dto;

import fakenews.backend.model.Vote;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class VoteDTO {
    private String id;
    private Long newsId;
    private String choice;
    private String comment;
    private String imageUrl;
    private String voter;
    private String createdAt;

    public static VoteDTO from(Vote v) {
        VoteDTO d = new VoteDTO();
        d.id = v.getId();
        d.newsId = v.getNews() != null ? v.getNews().getId() : null;
        d.choice = v.getChoice() != null ? (v.getChoice().name().equals("FAKE") ? "fake" : "not_fake") : null;
        d.comment = v.getComment();
        d.imageUrl = v.getImageUrl();
        d.voter = v.getVoter();
        d.createdAt = v.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(v.getCreatedAt().atOffset(ZoneOffset.UTC)) : null;
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

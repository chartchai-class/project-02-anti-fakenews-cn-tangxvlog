package fakenews.backend.dto;

import fakenews.backend.model.News;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class NewsDTO {
    private Long id;
    private String title;
    private String summary;
    private String content;
    private String reporter;
    private String createdAt;
    private String imageUrl;
    private String source;
    private String link;
    private Integer likes;

    public static NewsDTO from(News n) {
        NewsDTO d = new NewsDTO();
        d.id = n.getId();
        d.title = n.getTitle();
        d.summary = n.getSummary();
        d.content = n.getContent();
        d.reporter = n.getReporter();
        d.createdAt = n.getCreatedAt() != null ? DateTimeFormatter.ISO_INSTANT.format(n.getCreatedAt().atOffset(ZoneOffset.UTC)) : null;
        d.imageUrl = n.getImageUrl();
        d.source = n.getSource();
        d.link = n.getLink();
        d.likes = n.getLikes();
        return d;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSummary() { return summary; }
    public String getContent() { return content; }
    public String getReporter() { return reporter; }
    public String getCreatedAt() { return createdAt; }
    public String getImageUrl() { return imageUrl; }
    public String getSource() { return source; }
    public String getLink() { return link; }
    public Integer getLikes() { return likes; }
}

package fakenews.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateVoteRequest {
    @NotBlank
    private String choice;
    private String comment;
    private String imageUrl;
    private String voter;

    public String getChoice() { return choice; }
    public void setChoice(String choice) { this.choice = choice; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getVoter() { return voter; }
    public void setVoter(String voter) { this.voter = voter; }
}

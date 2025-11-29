package fakenews.backend.dto;

public class VoteCountsDTO {
    private long fake;
    private long not_fake;

    public VoteCountsDTO(long fake, long not_fake) {
        this.fake = fake;
        this.not_fake = not_fake;
    }

    public long getFake() { return fake; }
    public long getNot_fake() { return not_fake; }
}

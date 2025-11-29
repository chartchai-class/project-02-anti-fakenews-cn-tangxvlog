package fakenews.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LikeRequest {
    @NotBlank
    private String clientId;

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
}


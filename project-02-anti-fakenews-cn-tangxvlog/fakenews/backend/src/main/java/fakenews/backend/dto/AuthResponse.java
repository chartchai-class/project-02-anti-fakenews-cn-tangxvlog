package fakenews.backend.dto;

public class AuthResponse {
    private String email;
    private String role;
    private String username;
    private String avatarUrl;

    public AuthResponse() {}
    public AuthResponse(String email, String role, String username, String avatarUrl) { this.email = email; this.role = role; this.username = username; this.avatarUrl = avatarUrl; }

    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getUsername() { return username; }
    public String getAvatarUrl() { return avatarUrl; }
}

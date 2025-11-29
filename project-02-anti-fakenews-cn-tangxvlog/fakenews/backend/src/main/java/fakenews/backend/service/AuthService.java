package fakenews.backend.service;

import fakenews.backend.dto.AuthRequest;
import fakenews.backend.dto.AuthResponse;
import fakenews.backend.model.User;
import fakenews.backend.model.UserRole;
import fakenews.backend.repository.UserRepository;
import fakenews.backend.util.SupabaseStorageService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final SupabaseStorageService supabaseStorageService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, SupabaseStorageService supabaseStorageService) {
        this.userRepository = userRepository;
        this.supabaseStorageService = supabaseStorageService;
    }

    public AuthResponse register(AuthRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) throw new IllegalArgumentException("email already exists");
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole(UserRole.USER);
        String uname = (req.getUsername() == null || req.getUsername().trim().isEmpty()) ? deriveDefaultUsername(email) : req.getUsername().trim();
        u.setUsername(uname);
        String avatar = (req.getAvatarUrl() == null || req.getAvatarUrl().trim().isEmpty()) ? generateAndUploadDefaultAvatar(uname) : req.getAvatarUrl().trim();
        u.setAvatarUrl(avatar);
        userRepository.save(u);
        return new AuthResponse(u.getEmail(), u.getRole().name(), u.getUsername(), u.getAvatarUrl());
    }

    public AuthResponse login(AuthRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) throw new IllegalArgumentException("invalid credentials");
        User u = opt.get();
        boolean ok = passwordEncoder.matches(req.getPassword(), u.getPasswordHash());
        if (!ok) throw new IllegalArgumentException("invalid credentials");
        return new AuthResponse(u.getEmail(), u.getRole().name(), u.getUsername(), u.getAvatarUrl());
    }

    private String deriveDefaultUsername(String email) {
        int i = email.indexOf('@');
        if (i > 0) return email.substring(0, i);
        return "user";
    }

    private String generateAndUploadDefaultAvatar(String name) {
        try {
            String initial = name == null || name.isBlank() ? "U" : name.substring(0, 1).toUpperCase();
            String bg = pickColor(initial);
            String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"><rect width=\"100%\" height=\"100%\" fill=\"" + bg + "\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#fff\" font-size=\"120\" font-family=\"Arial, sans-serif\">" + initial + "</text></svg>";
            String fname = "avatar-" + name.replaceAll("[^A-Za-z0-9._-]", "_") + ".svg";
            return supabaseStorageService.uploadString(fname, svg, "image/svg+xml");
        } catch (Exception e) {
            return null;
        }
    }

    private String pickColor(String seed) {
        String[] colors = {"#2563eb", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"};
        int h = Math.abs(seed.hashCode());
        return colors[h % colors.length];
    }
}

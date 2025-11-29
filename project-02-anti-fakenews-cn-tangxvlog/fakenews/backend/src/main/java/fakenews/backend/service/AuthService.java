package fakenews.backend.service;

import fakenews.backend.dto.AuthRequest;
import fakenews.backend.dto.AuthResponse;
import fakenews.backend.model.User;
import fakenews.backend.model.UserRole;
import fakenews.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse register(AuthRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) throw new IllegalArgumentException("email already exists");
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole(UserRole.USER);
        userRepository.save(u);
        return new AuthResponse(u.getEmail(), u.getRole().name());
    }

    public AuthResponse login(AuthRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) throw new IllegalArgumentException("invalid credentials");
        User u = opt.get();
        boolean ok = passwordEncoder.matches(req.getPassword(), u.getPasswordHash());
        if (!ok) throw new IllegalArgumentException("invalid credentials");
        return new AuthResponse(u.getEmail(), u.getRole().name());
    }
}

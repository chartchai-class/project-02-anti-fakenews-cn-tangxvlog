package fakenews.backend.config;

import fakenews.backend.model.User;
import fakenews.backend.model.UserRole;
import fakenews.backend.repository.UserRepository;
import fakenews.backend.util.SupabaseStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AuthInitializer {
    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, SupabaseStorageService supabaseStorageService) {
        return args -> {
            BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
            if (!userRepository.existsByEmail("admin123@admin.com")) {
                User admin = new User();
                admin.setEmail("admin123@admin.com");
                admin.setPasswordHash(enc.encode("admin123"));
                admin.setRole(UserRole.ADMIN);
                admin.setUsername("admin");
                try {
                    String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"><rect width=\"100%\" height=\"100%\" fill=\"#ef4444\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#fff\" font-size=\"120\" font-family=\"Arial, sans-serif\">A</text></svg>";
                    String url = supabaseStorageService.uploadString("avatar-admin.svg", svg, "image/svg+xml");
                    admin.setAvatarUrl(url);
                } catch (Exception e) { /* ignore */ }
                userRepository.save(admin);
            }
            if (!userRepository.existsByEmail("user123@user.com")) {
                User user = new User();
                user.setEmail("user123@user.com");
                user.setPasswordHash(enc.encode("user123"));
                user.setRole(UserRole.USER);
                user.setUsername("user123");
                try {
                    String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\"><rect width=\"100%\" height=\"100%\" fill=\"#2563eb\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#fff\" font-size=\"120\" font-family=\"Arial, sans-serif\">U</text></svg>";
                    String url = supabaseStorageService.uploadString("avatar-user123.svg", svg, "image/svg+xml");
                    user.setAvatarUrl(url);
                } catch (Exception e) { /* ignore */ }
                userRepository.save(user);
            }
        };
    }
}

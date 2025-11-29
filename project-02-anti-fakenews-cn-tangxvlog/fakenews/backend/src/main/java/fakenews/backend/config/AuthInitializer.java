package fakenews.backend.config;

import fakenews.backend.model.User;
import fakenews.backend.model.UserRole;
import fakenews.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AuthInitializer {
    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository) {
        return args -> {
            BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
            if (!userRepository.existsByEmail("admin123@admin.com")) {
                User admin = new User();
                admin.setEmail("admin123@admin.com");
                admin.setPasswordHash(enc.encode("admin123"));
                admin.setRole(UserRole.ADMIN);
                userRepository.save(admin);
            }
            if (!userRepository.existsByEmail("user123@user.com")) {
                User user = new User();
                user.setEmail("user123@user.com");
                user.setPasswordHash(enc.encode("user123"));
                user.setRole(UserRole.USER);
                userRepository.save(user);
            }
        };
    }
}

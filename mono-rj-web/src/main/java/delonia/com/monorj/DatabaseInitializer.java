package delonia.com.monorj;

import delonia.com.monorj.users.User;
import delonia.com.monorj.users.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Slf4j

@Configuration
public class DatabaseInitializer {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    DatabaseInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Bean
    public ApplicationRunner initializeAdminUser() {
        return args -> {
            if (userRepository.count() == 0) { //Only insert if the table is empty
                log.info("No users found, creating initial admin...");
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123")); // Default password
                admin.setRole("admin");
                userRepository.save(admin);
                log.info("Initial admin user created: admin / admin123");
            }
        };
    }
}

package delonia.com.monorj.users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUsernameIgnoreCaseContaining(String username);
//    Pageable pageable = PageRequest.of(0, 10, Sort.by("username").ascending());
    Optional<User> findByUsername(String username);
}

package delonia.com.monorj.rest;

import delonia.com.monorj.users.User;
import delonia.com.monorj.users.UserRepository;
import delonia.com.monorj.users.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class MainController {


    private final UserRepository userRepository;
    private final UserService userService;

    public MainController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * Retrieves the current state of the host.
     *
     * @return a Map object with "host" as the key and "ok" as the value,
     * indicating that the host is in a normal state
     */
    @GetMapping("/hoststate")
    public Map<String, String> getHostState() {
        Map<String, String> result = new HashMap<>();
        result.put("host", "ok");
        return result;
    }

    /* Users management */
    @GetMapping("/api/users/{username}")
    public User getUser(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        User optUser = user.orElseGet(User::new);
        optUser.setPassword("");
        return optUser;
    }

    @GetMapping("/api/users")
    public Page<User> getUsers(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("username").ascending());
        Page<User> userList = userRepository.findAll(pageable);
        return userList;
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {
        User savedUser = userService.updateUser(id, updatedUser);
        return savedUser != null ? ResponseEntity.ok(savedUser) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content (Success)
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found (User doesn't exist)
        }
    }

    @PostMapping("/api/users")
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        if (newUser.getUsername() == null || newUser.getPassword() == null || newUser.getRole() == null) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request if any field is missing
        }

        User savedUser = userService.createUser(newUser); // Delegate to service
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

}
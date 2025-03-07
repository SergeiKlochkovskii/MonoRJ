package delonia.com.monorj.rest;

import delonia.com.monorj.jwt.JwtUtil;
import delonia.com.monorj.users.CustomUserDetailsService;
import delonia.com.monorj.users.LoginRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;


    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // ✅ Extract role securely from authenticated user, not from LoginRequest
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        loginRequest.setRole(role);

        // ✅ Generate tokens
        String accessToken = jwtUtil.generateToken(loginRequest);
        String refreshToken = jwtUtil.generateRefreshToken(loginRequest);

        // ✅ Prepare response
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("role", role);

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        String username = jwtUtil.extractUsername(refreshToken);

        log.info("Refreshing token for user: {}", username);

        if (jwtUtil.validateToken(refreshToken, username)) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            LoginRequest loginRequest = new LoginRequest();

            loginRequest.setUsername(userDetails.getUsername());
            loginRequest.setRole(userDetails.getAuthorities().iterator().next().getAuthority());

            String newAccessToken = jwtUtil.generateToken(loginRequest);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", refreshToken); // Keep the same refresh token

            return ResponseEntity.ok(tokens);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}

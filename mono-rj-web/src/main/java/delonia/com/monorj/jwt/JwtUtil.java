package delonia.com.monorj.jwt;

import delonia.com.monorj.users.LoginRequest;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.function.Function;
@Slf4j

@Component
public class JwtUtil {
    private static SecretKey SECRET_KEY;

    @PostConstruct
    public void init() {
        SECRET_KEY = generateSecretKey();
    }

    private SecretKey generateSecretKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");  // HMAC-based key
            keyGenerator.init(256); // Set key size
            return keyGenerator.generateKey();
        } catch (NoSuchAlgorithmException e) {
            log.error("Error generating JWT secret key", e);
            throw new RuntimeException("Error generating JWT secret key", e);
        }
    }

    public String generateToken(LoginRequest loginRequest) {
        return Jwts.builder()
                .setSubject(loginRequest.getUsername())
                .claim("role", loginRequest.getRole())  // Add the role claim here
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1-hour expiration
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // Secure key
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }


    // ✅ New method to generate a refresh token
    public String generateRefreshToken(LoginRequest userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 24 * 7 * 1000 * 60 * 60)) // 7 day expiration
                .signWith(SECRET_KEY)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}

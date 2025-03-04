package delonia.com.monorj.jwt;

import delonia.com.monorj.users.CustomUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.info("No JWT token found in request headers. Proceeding as anonymous.");
            chain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authorizationHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);

            log.info("Extracted username from token: {}", username);

            if (username != null && (SecurityContextHolder.getContext().getAuthentication() == null
                    || "anonymousUser".equals(SecurityContextHolder.getContext().getAuthentication().getPrincipal()))) {

                log.info("Authenticating user: {}", username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    log.info("JWT is valid. SecurityContext updated for user: {}", username);
                } else {
                    log.warn("Invalid JWT token for user: {}", username);
                }
            } else {
                log.info("Skipping authentication. SecurityContext already has: {}", SecurityContextHolder.getContext().getAuthentication());
            }

            log.info("SecurityContext after processing JWT: {}", SecurityContextHolder.getContext().getAuthentication());
            chain.doFilter(request, response);

        } catch (io.jsonwebtoken.security.SignatureException ex) {
            logger.error("Invalid JWT signature: {}", ex);
            SecurityContextHolder.clearContext();

            // Send 401 Unauthorized instead of redirecting
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid or expired token\"}");
        }


    }
}
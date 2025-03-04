package delonia.com.monorj.configuration;

import delonia.com.monorj.jwt.JwtAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.Filter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final Filter jwtFilter;

    public SecurityConfig(Filter jwtFilter) {
        super();
        this.jwtFilter = jwtFilter;

    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // Permit unauthenticated access to static resources
                .antMatchers(
                        "/",
//                        "/mono/**", // Allow all React routes under /mono
                        "/login",
                        "/index.html",
                        "/notfound",
                        "/hoststate",
                        "/favicon.ico",
                        "/manifest.json",
                        "/logo*",
                        "/static/**"
                ).permitAll()
                .antMatchers("/ws/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                // Permit login endpoint
                .antMatchers("/api/auth/login").permitAll()
                .antMatchers("/ws/logSearch/**").permitAll()
                // Require authentication for any other request
                .anyRequest().authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                .and()
                .formLogin().disable();

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}



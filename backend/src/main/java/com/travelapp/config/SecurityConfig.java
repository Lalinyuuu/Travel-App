package com.travelapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.http.HttpMethod;

import com.travelapp.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CsrfTokenRepository csrfTokenRepository;
    private final CsrfTokenRequestHandler csrfTokenRequestHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                         CsrfConfig csrfConfig) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.csrfTokenRepository = csrfConfig.csrfTokenRepository();
        this.csrfTokenRequestHandler = csrfConfig.csrfTokenRequestHandler();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CSRF protection with custom configuration for JWT-based API
            // CSRF tokens are sent via cookie (XSRF-TOKEN) and echoed back in X-CSRF-TOKEN header
            // Frontend must read token from cookie and send it in header for state-changing requests
            .csrf(csrf -> csrf
                .csrfTokenRepository(csrfTokenRepository)
                .csrfTokenRequestHandler(csrfTokenRequestHandler)
                // Allow GET requests without CSRF token (safe operations)
                .ignoringRequestMatchers(
                    new AntPathRequestMatcher("/api/auth/**"),
                    // Only ignore CSRF for safe read operations
                    new AntPathRequestMatcher("/api/trips", HttpMethod.GET.name()),
                    new AntPathRequestMatcher("/api/trips/**", HttpMethod.GET.name())
                )
            )
            .cors(cors -> {})
            // Stateless sessions for JWT authentication
            // CSRF token is stored in cookie (not session), so stateless works fine
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(contentType -> {}) // Enable X-Content-Type-Options: nosniff
                .httpStrictTransportSecurity(hsts -> hsts
                    .maxAgeInSeconds(31536000)
                )
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/trips").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/trips/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/trips").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/trips/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/trips/**").authenticated()
                .requestMatchers("/api/trips/mine").authenticated()
                .requestMatchers("/api/admin/translations/**").permitAll() // Allow translation endpoint
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}


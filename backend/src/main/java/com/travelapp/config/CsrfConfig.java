package com.travelapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;

/**
 * CSRF Configuration for JWT-based Stateless API
 * 
 * This configuration enables CSRF protection using Double Submit Cookie pattern.
 * CSRF token is sent as a cookie (read-only) and must be echoed back in X-CSRF-TOKEN header.
 * This works with stateless JWT authentication because:
 * 1. CSRF cookie is HttpOnly and SameSite=Strict (secure)
 * 2. Frontend reads token from cookie and sends it in header
 * 3. Server validates that cookie and header tokens match
 */
@Configuration
public class CsrfConfig {

    /**
     * Configure CSRF token repository using Cookie-based approach
     * This works with stateless APIs because token is stored in cookie, not session
     */
    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        // Use setCookieCustomizer for Spring Security 6.1+ (replaces deprecated methods)
        repository.setCookieCustomizer(cookie -> {
            cookie.httpOnly(true);
            cookie.secure(true); // Only send over HTTPS in production
            cookie.path("/");
            cookie.sameSite("Strict");
        });
        repository.setHeaderName("X-CSRF-TOKEN");
        repository.setCookieName("XSRF-TOKEN");
        return repository;
    }

    /**
     * Configure CSRF token request handler
     * Allows CSRF token to be read from header (X-CSRF-TOKEN)
     */
    @Bean
    public CsrfTokenRequestHandler csrfTokenRequestHandler() {
        XorCsrfTokenRequestAttributeHandler handler = new XorCsrfTokenRequestAttributeHandler();
        handler.setCsrfRequestAttributeName("_csrf");
        return handler;
    }
}

package com.travelapp.config;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        HikariConfig config = new HikariConfig();
        
        String url = properties.getUrl();
        String username = properties.getUsername();
        String password = properties.getPassword();
        
        // Validate URL
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("spring.datasource.url must be set");
        }
        
        // Clean up URL (remove any extra spaces)
        url = url.trim().replaceAll("\\s+", "");
        
        // Extract credentials from URL if embedded
        Credentials credentials = extractCredentialsFromUrl(url);
        if (credentials != null) {
            url = credentials.url;
            // Use extracted credentials if not provided separately
            if ((username == null || username.isEmpty()) && credentials.username != null) {
                username = credentials.username;
            }
            if ((password == null || password.isEmpty()) && credentials.password != null) {
                password = credentials.password;
            }
        }
        
        // Ensure URL is properly formatted
        if (!url.startsWith("jdbc:postgresql://")) {
            // Try to fix common issues
            if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
                url = "jdbc:" + url;
            } else {
                throw new IllegalArgumentException(
                    "Invalid JDBC URL format: " + url + "\n" +
                    "Expected format: jdbc:postgresql://host:port/database\n" +
                    "Do NOT include credentials in the URL. Use SPRING_DATASOURCE_USERNAME and SPRING_DATASOURCE_PASSWORD environment variables instead."
                );
            }
        }
        
        // Validate username and password are set
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("spring.datasource.username must be set");
        }
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("spring.datasource.password must be set");
        }
        
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName(properties.getDriverClassName());
        
        // Connection pool settings
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        logger.info("Configured DataSource with URL: {}", maskUrl(url));
        
        return new HikariDataSource(config);
    }
    
    private String maskUrl(String url) {
        // Mask sensitive information in URL for logging
        if (url.contains("@")) {
            int atIndex = url.indexOf("@");
            return url.substring(0, Math.min(50, atIndex)) + "***@" + url.substring(atIndex + 1);
        }
        return url;
    }
    
    private Credentials extractCredentialsFromUrl(String url) {
        // Handle URLs with embedded credentials
        // Format: jdbc:postgresql://user:pass@host:port/db
        // Or: postgresql://user:pass@host:port/db
        
        try {
            String urlToParse = url;
            
            // Remove jdbc: prefix if present
            if (urlToParse.startsWith("jdbc:postgresql://")) {
                urlToParse = urlToParse.substring("jdbc:postgresql://".length());
            } else if (urlToParse.startsWith("postgresql://")) {
                urlToParse = urlToParse.substring("postgresql://".length());
            } else if (urlToParse.startsWith("postgres://")) {
                urlToParse = urlToParse.substring("postgres://".length());
            } else {
                // No credentials embedded
                return null;
            }
            
            // Find @ symbol (separates credentials from host)
            int atIndex = urlToParse.indexOf("@");
            if (atIndex < 0) {
                // No credentials in URL
                return null;
            }
            
            String credentialsPart = urlToParse.substring(0, atIndex);
            String hostAndDb = urlToParse.substring(atIndex + 1);
            
            // Find colon separating username and password
            int colonIndex = credentialsPart.indexOf(":");
            if (colonIndex < 0) {
                // Only username, no password
                String username = decodeUrl(credentialsPart);
                return new Credentials("jdbc:postgresql://" + hostAndDb, username, null);
            }
            
            String username = credentialsPart.substring(0, colonIndex);
            String password = credentialsPart.substring(colonIndex + 1);
            
            // URL-decode credentials
            username = decodeUrl(username);
            password = decodeUrl(password);
            
            logger.info("Extracted credentials from URL (username will be used)");
            
            return new Credentials("jdbc:postgresql://" + hostAndDb, username, password);
            
        } catch (IllegalArgumentException | StringIndexOutOfBoundsException e) {
            logger.error("Failed to extract credentials from URL: {}", url, e);
            return null;
        }
    }
    
    private String decodeUrl(String encoded) {
        try {
            return URLDecoder.decode(encoded, StandardCharsets.UTF_8.toString());
        } catch (IllegalArgumentException | java.io.UnsupportedEncodingException e) {
            // If decoding fails, use as-is (might already be decoded or contain invalid sequences)
            // UnsupportedEncodingException should never occur with UTF-8, but handle it just in case
            logger.debug("Failed to URL-decode string, using as-is: {}", encoded);
            return encoded;
        }
    }
    
    private static class Credentials {
        final String url;
        final String username;
        final String password;
        
        Credentials(String url, String username, String password) {
            this.url = url;
            this.username = username;
            this.password = password;
        }
    }
}

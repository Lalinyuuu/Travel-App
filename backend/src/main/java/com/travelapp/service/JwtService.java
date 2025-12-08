package com.travelapp.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret:your-secret-key-change-this-in-production-min-256-bits}")
    private String secret;

    @Value("${jwt.access-token-expiration:900000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        if (secret == null || secret.isEmpty() || secret.equals("your-secret-key-change-this-in-production-min-256-bits")) {
            throw new IllegalStateException("JWT secret must be configured. Set JWT_SECRET environment variable.");
        }
        if (secret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters long for security.");
        }
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Long userId, String email) {
        return createToken(buildClaims(userId, email), userId.toString(), accessTokenExpiration);
    }

    public String generateRefreshToken(Long userId, String email) {
        Map<String, Object> claims = buildClaims(userId, email);
        claims.put("type", "refresh");
        return createToken(claims, userId.toString(), refreshTokenExpiration);
    }
    
    private Map<String, Object> buildClaims(Long userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        return claims;
    }

    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = extractAllClaims(token);
        Object userId = claims.get("userId");
        if (userId instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(claims.getSubject());
    }

    public String getEmailFromToken(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    public Date getExpirationDateFromToken(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        try {
            final Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    public Boolean validateToken(String token) {
        try {
            if (isTokenExpired(token)) {
                return false;
            }
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean isAccessToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object tokenType = claims.get("type");
            return tokenType == null || !"refresh".equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }
}


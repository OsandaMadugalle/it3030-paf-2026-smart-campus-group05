package com.app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationInMs;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        try {
            System.out.println("DEBUG: JwtTokenProvider.generateToken starting. Authentication class: " + authentication.getClass().getName());
            
            Object principal = authentication.getPrincipal();
            System.out.println("DEBUG: Principal class: " + principal.getClass().getName());

            UserPrincipal userPrincipal = (UserPrincipal) principal;

            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            List<String> roles = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            String token = Jwts.builder()
                    .setSubject(userPrincipal.getId())
                    .claim("email", userPrincipal.getEmail())
                    .claim("roles", roles)
                    .setIssuedAt(new Date())
                    .setExpiration(expiryDate)
                    .signWith(key, SignatureAlgorithm.HS512)
                    .compact();
            
            System.out.println("DEBUG: Generated Token for user " + userPrincipal.getEmail());
            return token;
        } catch (Exception e) {
            System.err.println("DEBUG: FATAL ERROR in generateToken: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            System.err.println("DEBUG: Error parsing token: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // Log error
        }
        return false;
    }
}

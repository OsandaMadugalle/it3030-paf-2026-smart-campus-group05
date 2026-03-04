package com.app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
<<<<<<< HEAD
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
=======
import jakarta.annotation.PostConstruct;
>>>>>>> develop
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

<<<<<<< HEAD
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
=======
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.List;
>>>>>>> develop
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

<<<<<<< HEAD
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

=======
>>>>>>> develop
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
<<<<<<< HEAD
    private long jwtExpirationMs;
=======
    private long jwtExpirationInMs;
>>>>>>> develop

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
<<<<<<< HEAD
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(userPrincipal.getId())
                .claim("email", userPrincipal.getEmail())
                .claim("name", userPrincipal.getName())
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateTokenFromUser(UserPrincipal userPrincipal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(userPrincipal.getId())
                .claim("email", userPrincipal.getEmail())
                .claim("name", userPrincipal.getName())
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
=======
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
>>>>>>> develop
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
<<<<<<< HEAD
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
=======
        } catch (JwtException | IllegalArgumentException ex) {
            // Log error
>>>>>>> develop
        }
        return false;
    }
}

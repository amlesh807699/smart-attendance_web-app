package com.example.ai.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.issuer}")
    private String ISSUER ;
    @Value("${jwt.token-type}")
    private String TOKEN_TYPE;

    @Value("${jwt.secret}")

    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationMillis;


    private Key getSigningKey() {

        if (secretKey == null || secretKey.length() < 32) {
            throw new IllegalStateException(
                    "JWT secret must be at least 32 characters"
            );
        }

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }


    public String generateToken(String rollno, String role) {

        if (rollno == null || rollno.isBlank()) {
            throw new IllegalArgumentException("Invalid roll number");
        }

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(rollno)
                .setIssuer(ISSUER)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .claim("typ", TOKEN_TYPE)
                .claim("role", role)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractRollNo(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }


    public String extractRole(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }


    public boolean validateToken(String token) {

        try {
            Claims claims = getClaims(token);


            if (claims.getExpiration() == null ||
                    claims.getExpiration().before(new Date())) {
                return false;
            }


            if (!ISSUER.equals(claims.getIssuer())) {
                return false;
            }


            String type = claims.get("typ", String.class);
            if (!TOKEN_TYPE.equals(type)) {
                return false;
            }


            return claims.getSubject() != null &&
                    !claims.getSubject().isBlank();

        } catch (ExpiredJwtException e) {
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    private Claims getClaims(String token) {

        if (token == null || token.isBlank()) {
            throw new JwtException("Missing token");
        }

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .requireIssuer(ISSUER)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
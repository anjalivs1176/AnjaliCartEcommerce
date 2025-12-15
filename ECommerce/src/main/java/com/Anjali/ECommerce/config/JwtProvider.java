package com.Anjali.ECommerce.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Collection;

@Service
public class JwtProvider {

    SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY.getBytes());

    public String generateToken(Authentication auth) {

        // 🔥 Extract SINGLE role (USER / SELLER)
        String role = auth.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority) // ROLE_USER
                .findFirst()
                .orElseThrow()
                .replace("ROLE_", ""); // USER

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .claim("email", auth.getName())
                .claim("role", role) // ✅ MATCHES JwtTokenValidator
                .signWith(key)
                .compact();
    }



public String getEmailFromJwtToken(String jwt) {

    // remove Bearer prefix if present
    if (jwt.startsWith("Bearer ")) {
        jwt = jwt.substring(7);
    }

    Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(jwt)
            .getBody();

    return claims.get("email", String.class);
}

}

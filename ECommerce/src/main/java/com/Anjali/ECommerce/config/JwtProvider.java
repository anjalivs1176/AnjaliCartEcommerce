package com.Anjali.ECommerce.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * ✅ JwtProvider
 *
 * This class handles:
 *  - Generating JWT tokens after successful authentication
 *  - Extracting user info (like email) from JWT tokens
 *
 * Basically, it’s your mini JWT factory + validator for login sessions.
 */
@Service
public class JwtProvider {

    // 🔐 Secret key used for signing and validating JWTs
    // This must match the key in JwtTokenValidator, so both can understand each other's tokens
    SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY.getBytes());

    /**
     * 🧾 Generates a JWT token for the authenticated user.
     *
     * @param auth -> Spring Security's Authentication object (contains username + roles)
     * @return compact JWT token string
     */
    public String generateToken(Authentication auth) {
        // ✨ Get user roles/permissions from the Authentication object
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        // 🧩 Convert the roles into a comma-separated string like "ROLE_USER,ROLE_ADMIN"
        String roles = populateAuthorities(authorities);

        // 🧠 Build the JWT using the JJWT library
        String jwt = Jwts.builder()
                .setIssuedAt(new Date()) // token creation timestamp
                .setExpiration(new Date(new Date().getTime() + 86400000)) // expires in 24 hrs
                .claim("email", auth.getName()) // add user's email/username as a claim
                .claim("authorities", roles) // add the user’s roles/authorities as a claim
                .signWith(key) // sign the token with the secret key (HS256 by default)
                .compact(); // convert everything into a single token string

        // 🎁 Return the final token (usually sent in the login response)
        return jwt;
    }

    /**
     * 📩 Extracts the user's email/username from a JWT token.
     *
     * @param jwt -> the JWT token (usually prefixed with "Bearer ")
     * @return email/username stored in the token
     */
    public String getEmailFromJwtToken(String jwt) {
        // 🧹 Remove "Bearer " prefix from the token (first 7 characters)
        jwt = jwt.substring(7);

        // 🕵️ Parse the JWT to extract claims (data inside token)
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key) // same key used while generating token
                .build()
                .parseClaimsJws(jwt) // validate and parse the token
                .getBody(); // get the actual data (claims) from the token

        // 📤 Return the email field from the token payload
        return String.valueOf(claims.get("email"));
    }

    /**
     * 🧩 Converts a list of GrantedAuthority objects (roles) into a single comma-separated string.
     * Example: [ROLE_USER, ROLE_ADMIN] -> "ROLE_USER,ROLE_ADMIN"
     *
     * @param authorities -> user's roles from Spring Security
     * @return comma-separated roles as string
     */
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();

        // Loop through each authority and add its name (e.g., ROLE_USER)
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }

        // Join all roles into one comma-separated string
        return String.join(",", auths);
    }
}

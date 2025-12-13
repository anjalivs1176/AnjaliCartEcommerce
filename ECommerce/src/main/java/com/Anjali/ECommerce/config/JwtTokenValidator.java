package com.Anjali.ECommerce.config;

import java.io.IOException;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenValidator extends OncePerRequestFilter {

    // @Override
    // protected void doFilterInternal(HttpServletRequest request,
    //                                 HttpServletResponse response,
    //                                 FilterChain filterChain)
    //         throws ServletException, IOException {

    //     // ⭐ SKIP JWT CHECK FOR PUBLIC AUTH ROUTES ⭐
    //     String path = request.getRequestURI();
    //     if (path.startsWith("/auth")) {
    //         filterChain.doFilter(request, response);
    //         return;
    //     }

    //     // Get Authorization header
    //     String jwt = request.getHeader("Authorization");

    //     if (jwt != null && jwt.startsWith("Bearer ")) {

    //         jwt = jwt.substring(7);

    //         try {
    //             // Parse & validate JWT
    //             SecretKey key = Keys.hmacShaKeyFor(JWT_CONSTANT.SECRET_KEY.getBytes());

    //             Claims claims = Jwts.parserBuilder()
    //                     .setSigningKey(key)
    //                     .build()
    //                     .parseClaimsJws(jwt)
    //                     .getBody();

    //             // Extract email & roles
    //             String email = String.valueOf(claims.get("email"));
    //             String authorities = String.valueOf(claims.get("authorities"));

    //             List<GrantedAuthority> auths =
    //                     AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

    //             // Create authentication token
    //             Authentication authentication =
    //                     new UsernamePasswordAuthenticationToken(email, null, auths);

    //             SecurityContextHolder.getContext().setAuthentication(authentication);

    //         } catch (Exception e) {
    //             throw new BadCredentialsException("Invalid JWT Token");
    //         }
    //     }

    //     filterChain.doFilter(request, response);
    // }



    @Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

    String path = request.getRequestURI();

    // ⭐ SKIP JWT CHECK FOR PUBLIC ROUTES
    if (path.startsWith("/auth") ||
        path.startsWith("/seller/login") ||
        path.startsWith("/seller/verify")) {

        filterChain.doFilter(request, response);
        return;
    }

    String jwt = request.getHeader("Authorization");
    jwt = request.getHeader("Authorization");

    if (jwt != null && jwt.startsWith("Bearer ")) {

        jwt = jwt.substring(7);

        try {
            SecretKey key = Keys.hmacShaKeyFor(
                JWT_CONSTANT.SECRET_KEY.getBytes()
            );

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            String email = claims.get("email", String.class);
            String authorities = claims.get("authorities", String.class);

            List<GrantedAuthority> auths =
                    AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(email, null, auths);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            throw new BadCredentialsException("Invalid JWT Token");
        }
    }

    filterChain.doFilter(request, response);
}



}

// package com.Anjali.ECommerce.config;
// import java.io.IOException;
// import java.util.List;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;
// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// @Component
// public class JwtTokenValidator extends OncePerRequestFilter {
//     @Value("${jwt.secret}")
//     private String jwtSecret;
//     @Override
//     protected void doFilterInternal(
//             HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain
//     ) throws ServletException, IOException {
//         String path = request.getServletPath();
//         // SKIP PUBLIC APIs EVEN IF TOKEN EXISTS
//         if (path.startsWith("/api/auth/")
//                 || path.startsWith("/api/public/")
//                 || path.startsWith("/api/home-category/")
//                 || path.startsWith("/api/deals/")
//                 || path.startsWith("/api/categories/")
//                 || path.startsWith("/api/products/")
//                 || path.startsWith("/api/reviews/")
//                 || path.startsWith("/api/search/")
//                 || path.startsWith("/actuator/")) {
//             filterChain.doFilter(request, response);
//             return;
//         }
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             filterChain.doFilter(request, response);
//             return;
//         }
//         String token = authHeader.substring(7);
//         try {
//             Claims claims = Jwts.parser()
//                     .setSigningKey(jwtSecret.getBytes())
//                     .parseClaimsJws(token)
//                     .getBody();
//             String email = claims.getSubject();
//             Object auth = claims.get("authorities");
//             String role;
//             if (auth instanceof List<?> list && !list.isEmpty()) {
//                 role = list.get(0).toString();
//             } else {
//                 role = auth.toString();
//             }
//             UsernamePasswordAuthenticationToken authentication
//                     = new UsernamePasswordAuthenticationToken(
//                             email,
//                             null,
//                             List.of(new SimpleGrantedAuthority(role))
//                     );
//             SecurityContextHolder.getContext().setAuthentication(authentication);
//         } catch (Exception e) {
//             response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//             return;
//         }
//         filterChain.doFilter(request, response);
//     }
// }
package com.Anjali.ECommerce.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenValidator extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getServletPath();
        if (path.startsWith("/api/auth/")
                || path.startsWith("/api/public/")
                || path.startsWith("/api/home-category/")
                || path.startsWith("/api/deals/")
                || path.startsWith("/api/categories/")
                || path.startsWith("/api/products/")
                || path.startsWith("/api/reviews/")
                || path.startsWith("/api/search/")
                || path.startsWith("/actuator/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);

            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret.getBytes())
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.get("email", String.class);

            Object authClaim = claims.get("authorities");
            String role = authClaim instanceof List
                    ? ((List<?>) authClaim).get(0).toString()
                    : authClaim.toString();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority(role))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

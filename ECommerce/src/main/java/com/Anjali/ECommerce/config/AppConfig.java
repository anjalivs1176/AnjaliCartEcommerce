package com.Anjali.ECommerce.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AppConfig {

    private final JwtTokenValidator jwtTokenValidator;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                // ✅ OPTIONS (CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // 🔓 PUBLIC APIs
                .requestMatchers(
                        "/api/auth/**",
                        "/api/login-signup-otp",
                        "/api/categories/**",
                        "/api/products/**",
                        "/api/reviews/**",
                        "/api/search/**",
                        "/api/deals/**",
                        "/api/public/home-category/**",
                        // 🔓 SELLER AUTH (VERY IMPORTANT)
                        "/api/seller",
                        "/api/seller/login",
                        "/api/seller/verify/**"
                ).permitAll()
                // 👤 CUSTOMER (LOGIN REQUIRED)
                .requestMatchers(
                        "/api/cart/**",
                        "/api/wishlist/**",
                        "/api/orders/**",
                        "/api/address/**",
                        "/api/user/**"
                ).authenticated()
                // 🛍️ SELLER (ROLE_SELLER ONLY)
                .requestMatchers(
                        "/api/seller/products/**",
                        "/api/seller/orders/**",
                        "/api/seller/profile/**",
                        "/api/transactions/seller"
                ).hasAuthority("ROLE_SELLER")
                // 👑 ADMIN
                .requestMatchers(
                        "/api/admin/**",
                        "/api/transactions"
                ).hasAuthority("ROLE_ADMIN")
                // 🔒 EVERYTHING ELSE
                .anyRequest().authenticated()
                )
                .addFilterBefore(jwtTokenValidator, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration cfg = new CorsConfiguration();

        cfg.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://anjali-cart.netlify.app"
        ));

        cfg.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

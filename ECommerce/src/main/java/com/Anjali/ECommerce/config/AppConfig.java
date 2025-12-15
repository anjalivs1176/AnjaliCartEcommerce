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
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                // PREFLIGHT
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // AUTH / OTP / LOGIN
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/seller/login").permitAll()
                .requestMatchers("/api/admin/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/seller").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/seller/verify/**").permitAll()
                // PUBLIC GET APIs
                .requestMatchers(HttpMethod.GET,
                        "/api/public/**",
                        "/api/home-category/**",
                        "/api/deals/**",
                        "/api/categories/**",
                        "/api/products/**",
                        "/api/reviews/**",
                        "/api/search/**",
                        "/actuator/health",
                        "/actuator/info"
                ).permitAll()
                // ROLE: CUSTOMER (cart, wishlist, user)
                .requestMatchers(
                        "/api/cart/**",
                        "/api/wishlist/**",
                        "/api/user/**"
                ).hasAuthority("ROLE_CUSTOMER")
                // ROLE: ADMIN
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                // ROLE: SELLER
                .requestMatchers("/api/seller/**").hasAuthority("ROLE_SELLER")
                // EVERYTHING ELSE
                .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://anjali-cart.netlify.app"
        ));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

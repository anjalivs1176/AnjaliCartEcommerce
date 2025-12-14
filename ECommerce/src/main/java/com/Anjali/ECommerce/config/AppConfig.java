package com.Anjali.ECommerce.config;

import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                // ✅ ALLOW CORS PREFLIGHT
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // ✅ PUBLIC APIs
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/home").permitAll()
                .requestMatchers("/api/home-category").permitAll()
                .requestMatchers("/api/deals/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                // ✅ SELLER AUTH
                .requestMatchers(
                        "/api/seller/login",
                        "/api/seller/verify",
                        "/api/seller/login-signup-otp"
                ).permitAll()
                // 🔐 ADMIN
                .requestMatchers("/api/admin/**").authenticated()
                // 🔐 EVERYTHING ELSE
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
                )
                .addFilterBefore(
                        new JwtTokenValidator(),
                        BasicAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();

            cfg.setAllowedOriginPatterns(List.of(
                    "http://localhost:3000",
                    "https://anjali-cart.netlify.app"
            ));

            cfg.setAllowedMethods(List.of(
                    "GET", "POST", "PUT", "DELETE", "OPTIONS"
            ));

            cfg.setAllowedHeaders(List.of("*"));
            cfg.setAllowCredentials(true);
            cfg.setExposedHeaders(List.of("Authorization"));
            cfg.setMaxAge(3600L);

            return cfg;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

                        
                                                                    
                       
         
                                             
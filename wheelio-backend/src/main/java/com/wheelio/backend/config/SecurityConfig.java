package com.wheelio.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private com.wheelio.backend.security.JwtRequestFilter jwtRequestFilter;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public WebSecurityCustomizer webSecurityCustomizer() {
                System.out.println("--- Loading SecurityConfig WebSecurityCustomizer ---");
                return (web) -> web.ignoring()
                                .requestMatchers("/api/health", "/api/vehicles", "/api/vehicles/**", "/api/auth/signup",
                                                "/api/auth/login", "/api/auth/me", "/api/damage-reports",
                                                "/api/damage-reports/**",
                                                "/api/bookings", "/api/bookings/**", "/api/users", "/api/users/**",
                                                "/api/files", "/api/files/**",
                                                "/api/drivers", "/api/drivers/**",
                                                "/api/payments", "/api/payments/**");
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(request -> {
                                        var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                                        corsConfiguration
                                                        .setAllowedOrigins(java.util.List.of(
                                                                        "http://localhost:5173",
                                                                        "http://localhost:3000"));
                                        corsConfiguration
                                                        .setAllowedMethods(java.util.List.of("GET", "POST", "PUT",
                                                                        "DELETE", "OPTIONS"));
                                        corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                                        corsConfiguration.setAllowCredentials(true);
                                        return corsConfiguration;
                                }))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtRequestFilter,
                                                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}

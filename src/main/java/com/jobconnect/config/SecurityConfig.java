package com.jobconnect.config;

import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.JwtAuthenticationFilter;
import com.jobconnect.security.JwtService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================
    // USER DETAILS SERVICE
    // =========================

    @Bean
    public UserDetailsService userDetailsService() {

        return username -> {
            throw new UsernameNotFoundException(
                    "Default Spring Security user is not used"
            );
        };
    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =========================
    // SECURITY FILTER CHAIN
    // =========================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        http

                // =========================
                // CORS
                // =========================

                .cors(cors -> {})


                // =========================
                // CSRF
                // =========================

                .csrf(csrf -> csrf.disable())


                // =========================
                // FORM LOGIN
                // =========================

                .formLogin(
                        form -> form.disable()
                )


                // =========================
                // HTTP BASIC
                // =========================

                .httpBasic(
                        httpBasic -> httpBasic.disable()
                )


                // =========================
                // AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------
                        // AUTH
                        // -------------------------

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        )
                        .permitAll()


                        // -------------------------
                        // RECRUITER - MY JOBS
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/recruiter/my-jobs"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // RESUME - UPLOAD
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/resume/upload/**"
                        )
                        .hasRole("JOB_SEEKER")


                        // -------------------------
                        // RESUME - DOWNLOAD
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/resume/download/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // JOB SEEKER - MY PROFILE
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/profile"
                        )
                        .hasAuthority("ROLE_JOB_SEEKER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/users/profile"
                        )
                        .hasAuthority("ROLE_JOB_SEEKER")


                        // -------------------------
                        // JOBS - GET
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/**"
                        )
                        .hasAnyRole(
                                "JOB_SEEKER",
                                "RECRUITER"
                        )


                        // -------------------------
                        // JOBS - CREATE
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // RECRUITER - USER DETAILS
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // JOBS - UPDATE
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // JOBS - DELETE
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // APPLICATION - APPLY
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/**"
                        )
                        .hasRole("JOB_SEEKER")


                        // -------------------------
                        // APPLICATIONS - USER
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/user/**"
                        )
                        .hasRole("JOB_SEEKER")


                        // -------------------------
                        // APPLICATIONS - JOB
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/job/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // APPLICATION STATUS
                        // -------------------------

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/**"
                        )
                        .hasRole("RECRUITER")


                        // -------------------------
                        // EVERYTHING ELSE
                        // -------------------------

                        .anyRequest()
                        .authenticated()
                )


                // =========================
                // JWT FILTER
                // =========================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================
    // JWT AUTHENTICATION FILTER
    // =========================

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        return new JwtAuthenticationFilter(
                jwtService,
                userRepository
        );
    }
}
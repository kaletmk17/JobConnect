package com.jobconnect.config;

import java.util.List;

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

import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.JwtAuthenticationFilter;
import com.jobconnect.security.JwtService;

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

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
        List.of(
                "http://localhost:5173",
                "https://job-connect-erv1.vercel.app",
                "https://job-connect-six-sigma.vercel.app"
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
                // CORS
                .cors(cors -> {})

                // CSRF
                .csrf(csrf -> csrf.disable())

                // Disable Form Login
                .formLogin(form -> form.disable())

                // Disable HTTP Basic
                .httpBasic(httpBasic -> httpBasic.disable())

                // =========================
                // AUTHORIZATION
                // =========================

                .authorizeHttpRequests(auth -> auth

                        // Authentication
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        )
                        .permitAll()

                        // Recruiter - My Jobs
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/recruiter/my-jobs"
                        )
                        .hasRole("RECRUITER")

                        // Resume Upload
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/resume/upload/**"
                        )
                        .hasRole("JOB_SEEKER")

                        // Resume Download
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/resume/download/**"
                        )
                        .hasRole("RECRUITER")

                        // Job Seeker Profile - GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/profile"
                        )
                        .hasAuthority("ROLE_JOB_SEEKER")

                        // Job Seeker Profile - UPDATE
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/users/profile"
                        )
                        .hasAuthority("ROLE_JOB_SEEKER")

                        // Jobs - GET
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/**"
                        )
                        .hasAnyRole(
                                "JOB_SEEKER",
                                "RECRUITER"
                        )

                        // Jobs - CREATE
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")

                        // Recruiter - User Details
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/**"
                        )
                        .hasRole("RECRUITER")

                        // Jobs - UPDATE
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")

                        // Jobs - DELETE
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")

                        // Application - APPLY
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/**"
                        )
                        .hasRole("JOB_SEEKER")

                        // Applications - User
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/user/**"
                        )
                        .hasRole("JOB_SEEKER")

                        // Applications - Job
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/job/**"
                        )
                        .hasRole("RECRUITER")

                        // Application Status Update
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/**"
                        )
                        .hasRole("RECRUITER")

                        // Everything Else
                        .anyRequest()
                        .authenticated()
                )

                // JWT Authentication Filter
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
package me.crvena.bookstore.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import me.crvena.bookstore.securityFilters.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  // @Bean
  // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  // http
  // .authorizeHttpRequests((authz) -> authz
  // .requestMatchers("/admin/**").hasRole("ADMIN") // Secure SnapAdmin
  // .anyRequest().permitAll() // Allow other requests
  // )
  // .formLogin(form -> form
  // .loginPage("/login") // Optional: Custom login page
  // .permitAll())
  // .logout(logout -> logout.permitAll());
  // return http.build();
  // }

  @Autowired
  private final JwtAuthFilter jwtAuthFilter;

  @Autowired
  private final AuthenticationProvider authenticationProvider;

  @Autowired
  private CorsConfigurationSource corsConfigurationSource;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/signup", "/api/auth/login")
            .permitAll().anyRequest().authenticated())
        .formLogin(form -> form.disable())
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}

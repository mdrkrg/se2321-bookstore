package me.crvena.bookstore.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Value("${url.frontend}")
  public String frontendUrl;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(frontendUrl)
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed methods
        .allowedHeaders("*") // Allow all headers
        .allowCredentials(true); // Allow credentials
  }
}

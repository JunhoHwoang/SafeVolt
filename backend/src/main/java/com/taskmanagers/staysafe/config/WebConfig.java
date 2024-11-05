package com.taskmanagers.staysafe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allow CORS on all endpoints
                .allowedOrigins("http://localhost:5174")  // Add the origin of your React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // HTTP methods to allow
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
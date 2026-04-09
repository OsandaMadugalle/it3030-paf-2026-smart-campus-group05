package com.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring: "If the URL starts with /uploads/, 
        // look inside the physical folder named 'uploads' in the project root."
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
package com.example.ai.Cloudnairy;

import com.cloudinary.Cloudinary;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;


    @PostConstruct
    public void validateSecrets() {
        if (isBlank(cloudName) || isBlank(apiKey) || isBlank(apiSecret)) {
            throw new IllegalStateException(
                    " Cloudinary credentials are missing. Check environment variables."
            );
        }
    }

    @Bean
    public Cloudinary cloudinary() {

        Map<String, String> config = Map.of(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", "true"
        );

        return new Cloudinary(config);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

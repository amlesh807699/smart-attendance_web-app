package com.example.ai.Ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class PythonAIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${b.url}")
    private String baseUrl;

    public PythonAIService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }


    public Map<String, Object> registerFaceSafe(String rollno, MultipartFile file) {

        System.out.println("Python AI Register Called");

        validateInput(rollno, file);

        String url = String.format("%s/face/register/%s", baseUrl, rollno);

        String response = postFile(url, file);

        return parseAIResponse(response);
    }

    public Map<String, Object> verifyFaceSafe(String rollno, MultipartFile file) {

        System.out.println("Python AI Verify Called");

        validateInput(rollno, file);

        String url = String.format("%s/face/verify/%s", baseUrl, rollno);

        String response = postFile(url, file);

        return parseAIResponse(response);
    }


    private void validateInput(String rollno, MultipartFile file) {

        if (rollno == null || rollno.isBlank()) {
            throw new IllegalArgumentException("Roll number required");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Photo required");
        }
    }

    private String postFile(String url, MultipartFile file) {

        try {

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful()
                    || response.getBody() == null) {

                throw new RuntimeException("AI service error");
            }

            return response.getBody();

        } catch (RestClientException e) {

            System.out.println("AI Service Unreachable");
            throw new RuntimeException("AI service unreachable", e);

        } catch (Exception e) {

            System.out.println("AI Call Failed");
            throw new RuntimeException("AI call failed", e);
        }
    }


    private Map<String, Object> parseAIResponse(String response) {

        try {

            return objectMapper.readValue(
                    response.getBytes(StandardCharsets.UTF_8),
                    new TypeReference<Map<String, Object>>() {}
            );

        } catch (Exception e) {

            throw new RuntimeException("Invalid AI response", e);
        }
    }
}
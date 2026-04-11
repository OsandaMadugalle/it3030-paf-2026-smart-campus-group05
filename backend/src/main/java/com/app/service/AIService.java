package com.app.service;

import com.app.model.Facility;
import com.app.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Autowired
    private FacilityRepository facilityRepository;

    public String getRecommendation(String userPrompt) {
        // 1. Fetch real facilities from your MongoDB
        List<Facility> facilities = facilityRepository.findAll();
        
        // 2. Create a text list for Grok to "read"
        String facilityContext = facilities.stream()
            .filter(f -> "ACTIVE".equalsIgnoreCase(f.getStatus().toString()))
            .map(f -> String.format("- %s (Type: %s, Capacity: %d, Location: %s)", 
                f.getName(), f.getType(), f.getCapacity(), f.getLocation()))
            .collect(Collectors.joining("\n"));

        // 3. Setup the System Prompt (Giving Grok its instructions)
        String systemPrompt = "You are the Smart Campus AI Assistant. Use this facility list:\n" + 
            facilityContext + 
            "\nSuggest the best ACTIVE facility for the user's needs. Be extremely brief (1-2 sentences). " +
            "Mention the capacity if relevant.";

        // 4. Call Grok API
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile"); // Check your specific model name
        requestBody.put("messages", Arrays.asList(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userPrompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
            
            // Extract the text from Grok's JSON response
            List<Map> choices = (List<Map>) response.getBody().get("choices");
            Map message = (Map) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            System.err.println("Grok API Error: " + e.getMessage());
            return "I'm unable to reach the AI assistant right now. Please browse the list below.";
        }
    }
}
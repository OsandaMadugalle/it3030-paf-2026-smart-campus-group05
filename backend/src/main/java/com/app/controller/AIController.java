package com.app.controller;

import com.app.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    /**
     * Endpoint to get a facility recommendation based on user natural language input.
     * Accessible by any logged-in user.
     * 
     * Request body format: { "prompt": "I need a room for 20 people with a projector" }
     */
    @PostMapping("/suggest")
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<Map<String, String>> getAiSuggestion(@RequestBody Map<String, String> payload) {
        String userPrompt = payload.get("prompt");
        
        // Basic validation
        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("suggestion", "Please describe what you are looking for!");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Call the service to talk to Grok
        String suggestion = aiService.getRecommendation(userPrompt);

        // Return as a JSON object
        Map<String, String> response = new HashMap<>();
        response.put("suggestion", suggestion);
        
        return ResponseEntity.ok(response);
    }
}
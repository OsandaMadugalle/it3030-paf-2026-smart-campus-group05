package com.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class SupportController {

    @GetMapping("/announcements")
    public ResponseEntity<List<Map<String, Object>>> getAnnouncements() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping("/announcements")
    public ResponseEntity<Map<String, Object>> createAnnouncement(@RequestBody Map<String, Object> payload) {
        Map<String, Object> announcement = new HashMap<>();
        if (payload != null) {
            announcement.putAll(payload);
        }
        announcement.putIfAbsent("id", UUID.randomUUID().toString());
        announcement.putIfAbsent("active", true);
        announcement.putIfAbsent("createdAt", new Date());
        return ResponseEntity.status(201).body(announcement);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/requests/my")
    public ResponseEntity<List<Map<String, Object>>> getMyRequests() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping("/requests")
    public ResponseEntity<Map<String, Object>> createRequest(@RequestBody Map<String, Object> payload) {
        Map<String, Object> request = new HashMap<>();
        if (payload != null) {
            request.putAll(payload);
        }
        request.putIfAbsent("id", UUID.randomUUID().toString());
        request.putIfAbsent("status", "pending");
        request.putIfAbsent("submittedAt", new Date());
        return ResponseEntity.status(201).body(request);
    }

    @PutMapping("/requests/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelRequest(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("status", "cancelled");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveRequest(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("status", "approved");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectRequest(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("status", "rejected");
        if (body != null && body.containsKey("reason")) {
            response.put("rejectionReason", body.get("reason"));
        }
        return ResponseEntity.ok(response);
    }
}

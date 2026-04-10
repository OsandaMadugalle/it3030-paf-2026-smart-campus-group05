package com.app.controller;

import com.app.model.Activity;
import com.app.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "*") // Allows your React frontend to connect
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    /**
     * Get the 10 most recent activities for the Moderator Activity Feed
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<List<Activity>> getRecentActivities() {
        // This uses the custom method we added to the Repository
        List<Activity> activities = activityRepository.findTop10ByOrderByTimestampDesc();
        return ResponseEntity.ok(activities);
    }

    /**
     * Optional: Clear activity logs (for admin maintenance)
     */
    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> clearActivities() {
        activityRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
package com.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "activities") // This tells Spring to use MongoDB
@Data
@NoArgsConstructor
public class Activity {

    @Id
    private String id; // MongoDB uses String IDs by default

    private String userName;
    private String action;
    private String targetResource;
    private LocalDateTime timestamp;

    public Activity(String userName, String action, String targetResource) {
        this.userName = userName;
        this.action = action;
        this.targetResource = targetResource;
        this.timestamp = LocalDateTime.now();
    }
}
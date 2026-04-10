package com.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
package com.app.dto;

import com.app.model.Facility;
import com.app.model.Facility.FacilityStatus;
import com.app.model.Facility.FacilityType;
import java.time.LocalDateTime;
import java.util.List;

// What the API sends back to the client
public class FacilityResponse {

    private String id;
    private String name;
    private FacilityType type;
    private int capacity;
    private String location;
    private String description;
    private List<String> availabilityWindows;
    private FacilityStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;

    // Static factory - converts a Facility document → FacilityResponse
    public static FacilityResponse from(Facility f) {
        FacilityResponse r = new FacilityResponse();
        r.id = f.getId();
        r.name = f.getName();
        r.type = f.getType();
        r.capacity = f.getCapacity();
        r.location = f.getLocation();
        r.description = f.getDescription();
        r.availabilityWindows = f.getAvailabilityWindows();
        r.status = f.getStatus();
        r.imageUrl = f.getImageUrl();
        r.createdAt = f.getCreatedAt();
        r.updatedAt = f.getUpdatedAt();
        r.createdBy = f.getCreatedBy();
        return r;
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public FacilityType getType() {
        return type;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getAvailabilityWindows() {
        return availabilityWindows;
    }

    public FacilityStatus getStatus() {
        return status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }
}
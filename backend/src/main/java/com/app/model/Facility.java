package com.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "facilities")
public class Facility {

    @Id
    private String id;

    @NotBlank(message = "Facility name is required")
    private String name;

    @NotNull(message = "Facility type is required")
    @Indexed
    private FacilityType type; // enum: LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Location is required")
    @Indexed
    private String location; // e.g. "Block A, Floor 2"

    private String description;

    // When this resource is available, e.g. ["MON 08:00-18:00", "TUE 08:00-18:00"]
    private List<String> availabilityWindows;

    @NotNull
    @Indexed
    private FacilityStatus status = FacilityStatus.ACTIVE; // ACTIVE or OUT_OF_SERVICE

    private String imageUrl; // optional photo of the resource

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private String createdBy; // userId of the admin who created it

    // Enums

    public enum FacilityType {
        LECTURE_HALL,
        LAB,
        MEETING_ROOM,
        EQUIPMENT // projectors, cameras, etc.
    }

    public enum FacilityStatus {
        ACTIVE,
        OUT_OF_SERVICE,
        CLOSED
    }

    // Constructors

    public Facility() {
    }

    // Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public FacilityType getType() {
        return type;
    }

    public void setType(FacilityType type) {
        this.type = type;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAvailabilityWindows() {
        return availabilityWindows;
    }

    public void setAvailabilityWindows(List<String> availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }

    public FacilityStatus getStatus() {
        return status;
    }

    public void setStatus(FacilityStatus status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
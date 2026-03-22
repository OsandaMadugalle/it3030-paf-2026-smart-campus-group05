package com.app.dto;

import com.app.model.Facility.FacilityStatus;
import com.app.model.Facility.FacilityType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

// What the client sends when creating or updating a facility
public class FacilityRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private FacilityType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;

    private List<String> availabilityWindows;

    private FacilityStatus status = FacilityStatus.ACTIVE;

    private String imageUrl;

    //  Getters & Setters 

    public String getName() {
        return name;
    }
    public void setName(String name){
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
    public void setAvailabilityWindows(List<String> windows) {
         this.availabilityWindows = windows; 
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
}
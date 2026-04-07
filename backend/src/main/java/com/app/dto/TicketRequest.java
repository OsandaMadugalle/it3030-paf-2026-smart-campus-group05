package com.app.dto;

import com.app.model.Ticket.TicketCategory;
import com.app.model.Ticket.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private String resourceId;
    private String location;
    private String reporterContact;

    public String getTitle() {
        return title; 
    }
    public void setTitle(String title) {
        this.title = title; 
    }

    public String getDescription() {
        return description; 
    }
    public void setDescription(String description) {
        this.description = description; 
    }

    public TicketCategory getCategory() {
        return category; 
    }
    public void setCategory(TicketCategory category) {
        this.category = category; 
    }

    public TicketPriority getPriority() {
        return priority; 
    }
    public void setPriority(TicketPriority priority) {
        this.priority = priority; 
    }

    public String getResourceId() {
        return resourceId; 
    }
    public void setResourceId(String resourceId) {
        this.resourceId = resourceId; 
    }

    public String getLocation() {
        return location; 
    }
    public void setLocation(String location) {
        this.location = location; 
    }

    public String getReporterContact() {
        return reporterContact; 
    }
    public void setReporterContact(String reporterContact) {
        this.reporterContact = reporterContact; 
    }
}

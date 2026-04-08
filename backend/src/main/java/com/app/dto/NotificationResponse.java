package com.app.dto;

import com.app.model.NotificationCategory;
import com.app.model.NotificationPriority;
import com.app.model.NotificationStatus;
import com.app.model.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {
    private String id;
    private String userId;
    private String userEmail;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationCategory category;
    private NotificationStatus status;
    private NotificationPriority priority;
    private String relatedEntityId;
    private String relatedEntityType;
    private String sentBy;
    private String sentByName;
    private boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    public NotificationCategory getCategory() { return category; }
    public void setCategory(NotificationCategory category) { this.category = category; }
    public NotificationStatus getStatus() { return status; }
    public void setStatus(NotificationStatus status) { this.status = status; }
    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }
    public String getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(String relatedEntityId) { this.relatedEntityId = relatedEntityId; }
    public String getRelatedEntityType() { return relatedEntityType; }
    public void setRelatedEntityType(String relatedEntityType) { this.relatedEntityType = relatedEntityType; }
    public String getSentBy() { return sentBy; }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }
    public String getSentByName() { return sentByName; }
    public void setSentByName(String sentByName) { this.sentByName = sentByName; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationResponseBuilder builder() {
        return new NotificationResponseBuilder();
    }

    public static class NotificationResponseBuilder {
        private NotificationResponse response = new NotificationResponse();
        public NotificationResponseBuilder id(String id) { response.setId(id); return this; }
        public NotificationResponseBuilder userId(String userId) { response.setUserId(userId); return this; }
        public NotificationResponseBuilder userEmail(String userEmail) { response.setUserEmail(userEmail); return this; }
        public NotificationResponseBuilder title(String title) { response.setTitle(title); return this; }
        public NotificationResponseBuilder message(String message) { response.setMessage(message); return this; }
        public NotificationResponseBuilder type(NotificationType type) { response.setType(type); return this; }
        public NotificationResponseBuilder category(NotificationCategory category) { response.setCategory(category); return this; }
        public NotificationResponseBuilder status(NotificationStatus status) { response.setStatus(status); return this; }
        public NotificationResponseBuilder priority(NotificationPriority priority) { response.setPriority(priority); return this; }
        public NotificationResponseBuilder relatedEntityId(String relatedEntityId) { response.setRelatedEntityId(relatedEntityId); return this; }
        public NotificationResponseBuilder relatedEntityType(String relatedEntityType) { response.setRelatedEntityType(relatedEntityType); return this; }
        public NotificationResponseBuilder sentBy(String sentBy) { response.setSentBy(sentBy); return this; }
        public NotificationResponseBuilder sentByName(String sentByName) { response.setSentByName(sentByName); return this; }
        public NotificationResponseBuilder isRead(boolean isRead) { response.setRead(isRead); return this; }
        public NotificationResponseBuilder readAt(LocalDateTime readAt) { response.setReadAt(readAt); return this; }
        public NotificationResponseBuilder deliveredAt(LocalDateTime deliveredAt) { response.setDeliveredAt(deliveredAt); return this; }
        public NotificationResponseBuilder createdAt(LocalDateTime createdAt) { response.setCreatedAt(createdAt); return this; }
        public NotificationResponse build() { return response; }
    }
}


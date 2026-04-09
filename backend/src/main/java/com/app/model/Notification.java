package com.app.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
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
    private boolean isRead = false;
    private LocalDateTime readAt;
    private LocalDateTime deliveredAt;
    private int retryCount = 0;
    private LocalDateTime nextRetryAt;
    private String digestGroupId;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Notification() {}

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
    public int getRetryCount() { return retryCount; }
    public void setRetryCount(int retryCount) { this.retryCount = retryCount; }
    public LocalDateTime getNextRetryAt() { return nextRetryAt; }
    public void setNextRetryAt(LocalDateTime nextRetryAt) { this.nextRetryAt = nextRetryAt; }
    public String getDigestGroupId() { return digestGroupId; }
    public void setDigestGroupId(String digestGroupId) { this.digestGroupId = digestGroupId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Notification nPoint = new Notification();
        public NotificationBuilder userId(String userId) { nPoint.setUserId(userId); return this; }
        public NotificationBuilder userEmail(String userEmail) { nPoint.setUserEmail(userEmail); return this; }
        public NotificationBuilder title(String title) { nPoint.setTitle(title); return this; }
        public NotificationBuilder message(String message) { nPoint.setMessage(message); return this; }
        public NotificationBuilder type(NotificationType type) { nPoint.setType(type); return this; }
        public NotificationBuilder category(NotificationCategory category) { nPoint.setCategory(category); return this; }
        public NotificationBuilder status(NotificationStatus status) { nPoint.setStatus(status); return this; }
        public NotificationBuilder priority(NotificationPriority priority) { nPoint.setPriority(priority); return this; }
        public NotificationBuilder relatedEntityId(String relatedEntityId) { nPoint.setRelatedEntityId(relatedEntityId); return this; }
        public NotificationBuilder relatedEntityType(String relatedEntityType) { nPoint.setRelatedEntityType(relatedEntityType); return this; }
        public NotificationBuilder sentBy(String sentBy) { nPoint.setSentBy(sentBy); return this; }
        public NotificationBuilder sentByName(String sentByName) { nPoint.setSentByName(sentByName); return this; }
        public NotificationBuilder isRead(boolean isRead) { nPoint.setRead(isRead); return this; }
        public NotificationBuilder digestGroupId(String digestGroupId) { nPoint.setDigestGroupId(digestGroupId); return this; }
        public NotificationBuilder deliveredAt(LocalDateTime deliveredAt) { nPoint.setDeliveredAt(deliveredAt); return this; }
        public Notification build() { return nPoint; }
    }
}

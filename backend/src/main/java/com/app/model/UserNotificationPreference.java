package com.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "user_notification_preferences")
public class UserNotificationPreference {
    @Id
    private String id;
    private String userId;
    
    private boolean bookingNotifications = true;
    private boolean announcementNotifications = true;
    private boolean systemNotifications = true;
    private boolean digestMode = false;
    private int digestIntervalHours = 1;
    private int preferredDeliveryHour = -1; // -1 for immediate
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public UserNotificationPreference() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public boolean isBookingNotifications() { return bookingNotifications; }
    public void setBookingNotifications(boolean bookingNotifications) { this.bookingNotifications = bookingNotifications; }
    public boolean isAnnouncementNotifications() { return announcementNotifications; }
    public void setAnnouncementNotifications(boolean announcementNotifications) { this.announcementNotifications = announcementNotifications; }
    public boolean isSystemNotifications() { return systemNotifications; }
    public void setSystemNotifications(boolean systemNotifications) { this.systemNotifications = systemNotifications; }
    public boolean isDigestMode() { return digestMode; }
    public void setDigestMode(boolean digestMode) { this.digestMode = digestMode; }
    public int getDigestIntervalHours() { return digestIntervalHours; }
    public void setDigestIntervalHours(int digestIntervalHours) { this.digestIntervalHours = digestIntervalHours; }
    public int getPreferredDeliveryHour() { return preferredDeliveryHour; }
    public void setPreferredDeliveryHour(int preferredDeliveryHour) { this.preferredDeliveryHour = preferredDeliveryHour; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static UserNotificationPreferenceBuilder builder() {
        return new UserNotificationPreferenceBuilder();
    }

    public static class UserNotificationPreferenceBuilder {
        private UserNotificationPreference prefs = new UserNotificationPreference();
        public UserNotificationPreferenceBuilder userId(String userId) { prefs.setUserId(userId); return this; }
        public UserNotificationPreference build() { return prefs; }
    }
}

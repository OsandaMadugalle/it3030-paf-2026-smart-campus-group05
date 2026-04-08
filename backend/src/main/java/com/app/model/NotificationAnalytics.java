package com.app.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notification_analytics")
public class NotificationAnalytics {
    @Id
    private String id;
    private String userId;
    private String notificationId;
    private LocalDateTime openedAt;
    private long timeToOpen; // in minutes
    private String dayOfWeek;
    private int hourOfDay;
    private String notificationType;
    
    @CreatedDate
    private LocalDateTime createdAt;

    public NotificationAnalytics() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getNotificationId() { return notificationId; }
    public void setNotificationId(String notificationId) { this.notificationId = notificationId; }
    public LocalDateTime getOpenedAt() { return openedAt; }
    public void setOpenedAt(LocalDateTime openedAt) { this.openedAt = openedAt; }
    public long getTimeToOpen() { return timeToOpen; }
    public void setTimeToOpen(long timeToOpen) { this.timeToOpen = timeToOpen; }
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public int getHourOfDay() { return hourOfDay; }
    public void setHourOfDay(int hourOfDay) { this.hourOfDay = hourOfDay; }
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationAnalyticsBuilder builder() {
        return new NotificationAnalyticsBuilder();
    }

    public static class NotificationAnalyticsBuilder {
        private NotificationAnalytics analytics = new NotificationAnalytics();
        public NotificationAnalyticsBuilder userId(String userId) { analytics.setUserId(userId); return this; }
        public NotificationAnalyticsBuilder notificationId(String notificationId) { analytics.setNotificationId(notificationId); return this; }
        public NotificationAnalyticsBuilder openedAt(LocalDateTime openedAt) { analytics.setOpenedAt(openedAt); return this; }
        public NotificationAnalyticsBuilder timeToOpen(long timeToOpen) { analytics.setTimeToOpen(timeToOpen); return this; }
        public NotificationAnalyticsBuilder dayOfWeek(String dayOfWeek) { analytics.setDayOfWeek(dayOfWeek); return this; }
        public NotificationAnalyticsBuilder hourOfDay(int hourOfDay) { analytics.setHourOfDay(hourOfDay); return this; }
        public NotificationAnalyticsBuilder notificationType(String notificationType) { analytics.setNotificationType(notificationType); return this; }
        public NotificationAnalytics build() { return analytics; }
    }
}

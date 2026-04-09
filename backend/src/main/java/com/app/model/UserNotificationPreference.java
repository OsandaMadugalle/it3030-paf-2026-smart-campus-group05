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
    private boolean bookingApprovedEnabled = true;
    private boolean bookingRejectedEnabled = true;
    private boolean bookingCancelledEnabled = true;
    private boolean bookingRequestedEnabled = true;
    private boolean ticketCreatedEnabled = true;
    private boolean ticketStatusEnabled = true;
    private boolean ticketCommentEnabled = true;
    private boolean ticketResolvedEnabled = true;
    private boolean muteAll = false;
    private LocalDateTime mutedUntil;
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
    
    public boolean isBookingApprovedEnabled() { return bookingApprovedEnabled; }
    public void setBookingApprovedEnabled(boolean bookingApprovedEnabled) { this.bookingApprovedEnabled = bookingApprovedEnabled; }
    public boolean isBookingRejectedEnabled() { return bookingRejectedEnabled; }
    public void setBookingRejectedEnabled(boolean bookingRejectedEnabled) { this.bookingRejectedEnabled = bookingRejectedEnabled; }
    public boolean isBookingCancelledEnabled() { return bookingCancelledEnabled; }
    public void setBookingCancelledEnabled(boolean bookingCancelledEnabled) { this.bookingCancelledEnabled = bookingCancelledEnabled; }
    public boolean isBookingRequestedEnabled() { return bookingRequestedEnabled; }
    public void setBookingRequestedEnabled(boolean bookingRequestedEnabled) { this.bookingRequestedEnabled = bookingRequestedEnabled; }
    public boolean isTicketCreatedEnabled() { return ticketCreatedEnabled; }
    public void setTicketCreatedEnabled(boolean ticketCreatedEnabled) { this.ticketCreatedEnabled = ticketCreatedEnabled; }
    public boolean isTicketStatusEnabled() { return ticketStatusEnabled; }
    public void setTicketStatusEnabled(boolean ticketStatusEnabled) { this.ticketStatusEnabled = ticketStatusEnabled; }
    public boolean isTicketCommentEnabled() { return ticketCommentEnabled; }
    public void setTicketCommentEnabled(boolean ticketCommentEnabled) { this.ticketCommentEnabled = ticketCommentEnabled; }
    public boolean isTicketResolvedEnabled() { return ticketResolvedEnabled; }
    public void setTicketResolvedEnabled(boolean ticketResolvedEnabled) { this.ticketResolvedEnabled = ticketResolvedEnabled; }
    public boolean isMuteAll() { return muteAll; }
    public void setMuteAll(boolean muteAll) { this.muteAll = muteAll; }
    public LocalDateTime getMutedUntil() { return mutedUntil; }
    public void setMutedUntil(LocalDateTime mutedUntil) { this.mutedUntil = mutedUntil; }

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

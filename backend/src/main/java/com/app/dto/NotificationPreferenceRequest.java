package com.app.dto;

public class NotificationPreferenceRequest {
    private boolean bookingNotifications;
    private boolean announcementNotifications;
    private boolean systemNotifications;
    private boolean digestMode;
    private int digestIntervalHours;
    private int preferredDeliveryHour;

    public NotificationPreferenceRequest() {}

    // Getters and Setters
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
}


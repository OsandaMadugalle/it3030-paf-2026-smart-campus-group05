package com.app.dto;

public class NotificationPreferenceRequest {
    private boolean bookingNotifications;
    private boolean bookingApprovedEnabled;
    private boolean bookingRejectedEnabled;
    private boolean bookingCancelledEnabled;
    private boolean bookingRequestedEnabled;
    private boolean ticketCreatedEnabled;
    private boolean ticketStatusEnabled;
    private boolean ticketCommentEnabled;
    private boolean ticketResolvedEnabled;
    private boolean systemNotifications;
    private boolean digestMode;
    private int digestIntervalHours;
    private int preferredDeliveryHour;

    public NotificationPreferenceRequest() {}

    // Getters and Setters
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
    
    public boolean isSystemNotifications() { return systemNotifications; }
    public void setSystemNotifications(boolean systemNotifications) { this.systemNotifications = systemNotifications; }
    public boolean isDigestMode() { return digestMode; }
    public void setDigestMode(boolean digestMode) { this.digestMode = digestMode; }
    public int getDigestIntervalHours() { return digestIntervalHours; }
    public void setDigestIntervalHours(int digestIntervalHours) { this.digestIntervalHours = digestIntervalHours; }
    public int getPreferredDeliveryHour() { return preferredDeliveryHour; }
    public void setPreferredDeliveryHour(int preferredDeliveryHour) { this.preferredDeliveryHour = preferredDeliveryHour; }
}


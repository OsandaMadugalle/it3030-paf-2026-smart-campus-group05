package com.app.model;

import java.time.LocalDateTime;

// Embedded inside Ticket — records every status change for audit trail
public class StatusHistory {

    private String fromStatus;
    private String toStatus;
    private String changedById;
    private String changedByName;
    private String note;           // resolution notes, rejection reason, etc.
    private LocalDateTime changedAt;

    public StatusHistory() {}

    public StatusHistory(String fromStatus, String toStatus,
                         String changedById, String changedByName,
                         String note) {
        this.fromStatus    = fromStatus;
        this.toStatus      = toStatus;
        this.changedById   = changedById;
        this.changedByName = changedByName;
        this.note          = note;
        this.changedAt     = LocalDateTime.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getFromStatus() { return fromStatus; }
    public void setFromStatus(String fromStatus) { this.fromStatus = fromStatus; }

    public String getToStatus() { return toStatus; }
    public void setToStatus(String toStatus) { this.toStatus = toStatus; }

    public String getChangedById() { return changedById; }
    public void setChangedById(String changedById) { this.changedById = changedById; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
}
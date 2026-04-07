package com.app.model;

import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

// This is NOT a separate collection — it is embedded inside Ticket
public class Comment {

    @Id
    private String id;

    private String content;

    private String authorId;       // userId of the person who wrote it
    private String authorName;     // denormalised for display
    private String authorRole;     // ROLE_USER / ROLE_MODERATOR / ROLE_ADMIN

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean deleted = false; // soft delete

    public Comment() {
        this.id        = java.util.UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}

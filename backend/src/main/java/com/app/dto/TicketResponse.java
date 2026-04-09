package com.app.dto;

import com.app.model.Comment;
import com.app.model.StatusHistory;
import com.app.model.Ticket;
import com.app.model.Ticket.TicketCategory;
import com.app.model.Ticket.TicketPriority;
import com.app.model.Ticket.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TicketResponse {

    private String id;
    private String reporterId;
    private String reporterName;
    private String reporterContact;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private String resourceId;
    private String location;
    private TicketStatus status;
    private String assignedToId;
    private String assignedToName;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime resolvedAt;
    private List<String> attachments;
    private List<CommentDto> comments;
    private List<StatusHistoryDto> statusHistory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketResponse from(Ticket t) {
        TicketResponse r = new TicketResponse();
        r.id              = t.getId();
        r.reporterId      = t.getReporterId();
        r.reporterName    = t.getReporterName();
        r.reporterContact = t.getReporterContact();
        r.title           = t.getTitle();
        r.description     = t.getDescription();
        r.category        = t.getCategory();
        r.priority        = t.getPriority();
        r.resourceId      = t.getResourceId();
        r.location        = t.getLocation();
        r.status          = t.getStatus();
        r.assignedToId    = t.getAssignedToId();
        r.assignedToName  = t.getAssignedToName();
        r.resolutionNotes = t.getResolutionNotes();
        r.rejectionReason = t.getRejectionReason();
        r.resolvedAt      = t.getResolvedAt();
        r.attachments     = t.getAttachments();
        r.createdAt       = t.getCreatedAt();
        r.updatedAt       = t.getUpdatedAt();

        // Comments — exclude soft deleted
        r.comments = t.getComments() == null ? List.of() :
            t.getComments().stream()
                .filter(c -> !c.isDeleted())
                .map(CommentDto::from)
                .collect(Collectors.toList());
 
        // Status history
        r.statusHistory = t.getStatusHistory() == null ? List.of() :
            t.getStatusHistory().stream()
                .map(StatusHistoryDto::from)
                .collect(Collectors.toList());
 
        return r;
    }

    public static class CommentDto {
        private String id;
        private String content;
        private String authorId;
        private String authorName;
        private String authorRole;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static CommentDto from(Comment c) {
            CommentDto dto = new CommentDto();
            dto.id         = c.getId();
            dto.content    = c.getContent();
            dto.authorId   = c.getAuthorId();
            dto.authorName = c.getAuthorName();
            dto.authorRole = c.getAuthorRole();
            dto.createdAt  = c.getCreatedAt();
            dto.updatedAt  = c.getUpdatedAt();
            return dto;
        }

        public String getId() { return id; }
        public String getContent() { return content; }
        public String getAuthorId() { return authorId; }
        public String getAuthorName() { return authorName; }
        public String getAuthorRole() { return authorRole; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
    }

    public static class StatusHistoryDto {
        private String fromStatus;
        private String toStatus;
        private String changedById;
        private String changedByName;
        private String note;
        private LocalDateTime changedAt;
 
        public static StatusHistoryDto from(StatusHistory h) {
            StatusHistoryDto dto = new StatusHistoryDto();
            dto.fromStatus    = h.getFromStatus();
            dto.toStatus      = h.getToStatus();
            dto.changedById   = h.getChangedById();
            dto.changedByName = h.getChangedByName();
            dto.note          = h.getNote();
            dto.changedAt     = h.getChangedAt();
            return dto;
        }
 
        public String getFromStatus() { return fromStatus; }
        public String getToStatus() { return toStatus; }
        public String getChangedById() { return changedById; }
        public String getChangedByName() { return changedByName; }
        public String getNote() { return note; }
        public LocalDateTime getChangedAt() { return changedAt; }
    }

    public String getId() {
        return id; 
    }
    public String getReporterId() {
        return reporterId; 
    }
    public String getReporterName() {
        return reporterName; 
    }
    public String getReporterContact() {
        return reporterContact; 
    }
    public String getTitle() {
        return title; 
    }
    public String getDescription() {
        return description; 
    }
    public TicketCategory getCategory() {
        return category; 
    }
    public TicketPriority getPriority() {
        return priority; 
    }
    public String getResourceId() {
        return resourceId; 
    }
    public String getLocation() {
        return location; 
    }
    public TicketStatus getStatus() {
        return status; 
    }
    public String getAssignedToId() {
        return assignedToId; 
    }
    public String getAssignedToName() {
        return assignedToName; 
    }
    public String getResolutionNotes() {
        return resolutionNotes; 
    }
    public String getRejectionReason() {
        return rejectionReason; 
    }
    public LocalDateTime getResolvedAt() {
        return resolvedAt; 
    }
    public List<String> getAttachments() {
        return attachments; 
    }
    public List<CommentDto> getComments() {
        return comments; 
    }
    public List<StatusHistoryDto> getStatusHistory(){
        return statusHistory;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt; 
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt; 
    }
}

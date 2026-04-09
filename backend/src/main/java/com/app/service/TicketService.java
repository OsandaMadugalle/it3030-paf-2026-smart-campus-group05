package com.app.service;

import com.app.dto.CommentRequest;
import com.app.dto.TicketRequest;
import com.app.dto.TicketResponse;
import com.app.model.Comment;
import com.app.model.StatusHistory;
import com.app.model.Ticket;
import com.app.model.Ticket.TicketStatus;
import com.app.repository.TicketRepository;
import com.app.security.UserPrincipal;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository    ticketRepository;
    private final FileStorageService  fileStorageService;
    private final JavaMailSender      mailSender;

    public TicketService(TicketRepository ticketRepository,
                         FileStorageService fileStorageService,
                         JavaMailSender mailSender) {
        this.ticketRepository   = ticketRepository;
        this.fileStorageService = fileStorageService;
        this.mailSender         = mailSender;
    }

    // ── Create ────────────────────────────────────────────────────────────────

    public TicketResponse createTicket(TicketRequest request,
                                       List<MultipartFile> files,
                                       UserPrincipal currentUser) throws IOException {
        Ticket ticket = new Ticket();
        ticket.setReporterId(currentUser.getId());
        ticket.setReporterName(currentUser.getName());
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(request.getLocation());
        ticket.setReporterContact(request.getReporterContact());
        ticket.setStatus(TicketStatus.OPEN);

        // Record initial status in history
        addHistory(ticket, null, "OPEN", currentUser.getId(),
                   currentUser.getName(), "Ticket created");

        if (files != null && !files.isEmpty()) {
            List<String> paths = fileStorageService.saveAttachments(files);
            ticket.setAttachments(paths);
        }

        return TicketResponse.from(ticketRepository.save(ticket));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
            .stream().map(TicketResponse::from).collect(Collectors.toList());
    }

    public List<TicketResponse> getMyTickets(String userId) {
        return ticketRepository.findByReporterIdOrderByCreatedAtDesc(userId)
            .stream().map(TicketResponse::from).collect(Collectors.toList());
    }

    public TicketResponse getTicketById(String id) {
        return TicketResponse.from(findTicketOrThrow(id));
    }

    public List<TicketResponse> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatusOrderByCreatedAtDesc(status)
            .stream().map(TicketResponse::from).collect(Collectors.toList());
    }

    public List<TicketResponse> searchTickets(String keyword) {
        return ticketRepository.searchByKeyword(keyword)
            .stream().map(TicketResponse::from).collect(Collectors.toList());
    }

    // ── Status transitions ────────────────────────────────────────────────────

    // OPEN → IN_PROGRESS
    public TicketResponse assignTicket(String ticketId, String technicianId,
                                       String technicianName) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.OPEN &&
            ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException(
                "Cannot assign ticket with status: " + ticket.getStatus());
        }

        String prev = ticket.getStatus().name();
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setAssignedToId(technicianId);
        ticket.setAssignedToName(technicianName);
        addHistory(ticket, prev, "IN_PROGRESS", technicianId,
                   technicianName, "Assigned to " + technicianName);

        return TicketResponse.from(ticketRepository.save(ticket));
    }

    // IN_PROGRESS → RESOLVED
    public TicketResponse resolveTicket(String ticketId, String resolutionNotes,
                                        UserPrincipal currentUser) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only IN_PROGRESS tickets can be resolved");
        }

        String prev = ticket.getStatus().name();
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setResolvedAt(LocalDateTime.now());
        addHistory(ticket, prev, "RESOLVED", currentUser.getId(),
                   currentUser.getName(), resolutionNotes);

        Ticket saved = ticketRepository.save(ticket);

        // Innovation 3 — send email to reporter on RESOLVED
        sendStatusEmail(
            ticket.getReporterContact(),
            ticket.getReporterName(),
            ticket.getTitle(),
            "RESOLVED",
            "Your ticket has been resolved.\n\nResolution notes: " +
                (resolutionNotes != null && !resolutionNotes.isBlank()
                    ? resolutionNotes : "No notes provided."),
            currentUser.getName()
        );

        return TicketResponse.from(saved);
    }

    // RESOLVED → CLOSED
    public TicketResponse closeTicket(String ticketId, UserPrincipal currentUser) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new IllegalStateException("Only RESOLVED tickets can be closed");
        }

        String prev = ticket.getStatus().name();
        ticket.setStatus(TicketStatus.CLOSED);
        addHistory(ticket, prev, "CLOSED", currentUser.getId(),
                   currentUser.getName(), "Ticket closed");

        return TicketResponse.from(ticketRepository.save(ticket));
    }

    // Any active → REJECTED
    public TicketResponse rejectTicket(String ticketId, String reason,
                                       UserPrincipal currentUser) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() == TicketStatus.CLOSED ||
            ticket.getStatus() == TicketStatus.REJECTED) {
            throw new IllegalStateException(
                "Cannot reject a ticket that is already " + ticket.getStatus());
        }

        String prev = ticket.getStatus().name();
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        addHistory(ticket, prev, "REJECTED", currentUser.getId(),
                   currentUser.getName(), reason);

        Ticket saved = ticketRepository.save(ticket);

        // Innovation 3 — send email to reporter on REJECTED
        sendStatusEmail(
            ticket.getReporterContact(),
            ticket.getReporterName(),
            ticket.getTitle(),
            "REJECTED",
            "Unfortunately, your ticket has been rejected.\n\nReason: " +
                (reason != null && !reason.isBlank() ? reason : "No reason provided."),
            currentUser.getName()
        );

        return TicketResponse.from(saved);
    }

    // ── Comments ──────────────────────────────────────────────────────────────

    public TicketResponse addComment(String ticketId, CommentRequest request,
                                     UserPrincipal currentUser) {
        Ticket ticket = findTicketOrThrow(ticketId);

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthorId(currentUser.getId());
        comment.setAuthorName(currentUser.getName());
        comment.setAuthorRole(
            currentUser.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .findFirst()
                .orElse("ROLE_USER")
        );

        ticket.getComments().add(comment);
        return TicketResponse.from(ticketRepository.save(ticket));
    }

    public TicketResponse deleteComment(String ticketId, String commentId,
                                        UserPrincipal currentUser) {
        Ticket ticket = findTicketOrThrow(ticketId);

        boolean isAdmin = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Comment comment = ticket.getComments().stream()
            .filter(c -> c.getId().equals(commentId) && !c.isDeleted())
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthorId().equals(currentUser.getId()) && !isAdmin) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        comment.setDeleted(true);
        return TicketResponse.from(ticketRepository.save(ticket));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    public void deleteTicket(String ticketId) {
        Ticket ticket = findTicketOrThrow(ticketId);
        fileStorageService.deleteFiles(ticket.getAttachments());
        ticketRepository.deleteById(ticketId);
    }

    // ── Innovation 3: Email helper ────────────────────────────────────────────

    private void sendStatusEmail(String toEmail, String reporterName,
                                  String ticketTitle, String newStatus,
                                  String details, String changedBy) {
        if (toEmail == null || toEmail.isBlank()) return;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[Smart Campus] Your ticket has been " + newStatus);
            message.setText(
                "Dear " + reporterName + ",\n\n" +
                "Your incident ticket \"" + ticketTitle + "\" has been updated.\n\n" +
                "New Status: " + newStatus + "\n" +
                details + "\n\n" +
                "Updated by: " + changedBy + "\n\n" +
                "You can log in to Smart Campus to view the full details.\n\n" +
                "Regards,\nSmart Campus Operations Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            // Don't let email failure break the status update
            System.err.println("Failed to send status email: " + e.getMessage());
        }
    }

    // ── Status history helper ─────────────────────────────────────────────────

    private void addHistory(Ticket ticket, String from, String to,
                             String userId, String userName, String note) {
        StatusHistory entry = new StatusHistory(from, to, userId, userName, note);
        if (ticket.getStatusHistory() == null) {
            ticket.setStatusHistory(new java.util.ArrayList<>());
        }
        ticket.getStatusHistory().add(entry);
    }

    // ── Find helper ───────────────────────────────────────────────────────────

    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }
}
package com.app.service;

import com.app.dto.CommentRequest;
import com.app.dto.TicketRequest;
import com.app.dto.TicketResponse;
import com.app.model.Comment;
import com.app.model.Ticket;
import com.app.model.Ticket.TicketStatus;
import com.app.model.Ticket.TicketCategory;
import com.app.repository.TicketRepository;
import com.app.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FileStorageService fileStorageService;

    public TicketService(TicketRepository ticketRepository,
                         FileStorageService fileStorageService) {
        this.ticketRepository   = ticketRepository;
        this.fileStorageService = fileStorageService;
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

    public TicketResponse assignTicket(String ticketId, String technicianId,
                                       String technicianName) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.OPEN &&
            ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException(
                "Cannot assign ticket with status: " + ticket.getStatus()
            );
        }

        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setAssignedToId(technicianId);
        ticket.setAssignedToName(technicianName);
        return TicketResponse.from(ticketRepository.save(ticket));
    }

    public TicketResponse resolveTicket(String ticketId, String resolutionNotes,
                                        UserPrincipal currentUser) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only IN_PROGRESS tickets can be resolved");
        }

        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setResolvedAt(LocalDateTime.now());
        return TicketResponse.from(ticketRepository.save(ticket));
    }

    public TicketResponse closeTicket(String ticketId) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new IllegalStateException("Only RESOLVED tickets can be closed");
        }

        ticket.setStatus(TicketStatus.CLOSED);
        return TicketResponse.from(ticketRepository.save(ticket));
    }

    public TicketResponse rejectTicket(String ticketId, String reason) {
        Ticket ticket = findTicketOrThrow(ticketId);

        if (ticket.getStatus() == TicketStatus.CLOSED ||
            ticket.getStatus() == TicketStatus.REJECTED) {
            throw new IllegalStateException(
                "Cannot reject a ticket that is already " + ticket.getStatus()
            );
        }

        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        return TicketResponse.from(ticketRepository.save(ticket));
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

    // ── Helper ────────────────────────────────────────────────────────────────

    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }
}

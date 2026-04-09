package com.app.controller;

import com.app.dto.CommentRequest;
import com.app.dto.TicketRequest;
import com.app.dto.TicketResponse;
import com.app.model.Ticket.TicketStatus;
import com.app.security.UserPrincipal;
import com.app.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ── POST /api/tickets ─────────────────────────────────────────────────────
    // Creates a ticket with optional image attachments (multipart)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createTicket(
            @RequestPart("ticket") @Valid TicketRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserPrincipal currentUser) throws IOException {

        TicketResponse created = ticketService.createTicket(request, files, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── PUT /api/tickets/{id} ─────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String id,
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.updateTicket(id, request, currentUser));
    }

    // ── GET /api/tickets ──────────────────────────────────────────────────────
    // Admin/Moderator sees all, users see only their own
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) String keyword,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        boolean isAdminOrMod = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                          a.getAuthority().equals("ROLE_MODERATOR"));

        if (!isAdminOrMod) {
            return ResponseEntity.ok(ticketService.getMyTickets(currentUser.getId()));
        }

        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(ticketService.searchTickets(keyword));
        }

        if (status != null) {
            return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
        }

        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // ── GET /api/tickets/my ───────────────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ticketService.getMyTickets(currentUser.getId()));
    }

    // ── GET /api/tickets/{id} ─────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // ── PATCH /api/tickets/{id}/assign ────────────────────────────────────────
    // Moderator/Admin assigns themselves as technician → IN_PROGRESS
    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        boolean isAdminOrMod = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                          a.getAuthority().equals("ROLE_MODERATOR"));

        if (!isAdminOrMod) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
            ticketService.assignTicket(id, currentUser.getId(), currentUser.getName())
        );
    }

    // ── PATCH /api/tickets/{id}/resolve ───────────────────────────────────────
    // Moderator/Admin resolves with notes → RESOLVED
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<TicketResponse> resolveTicket(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "") String notes,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        boolean isAdminOrMod = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                          a.getAuthority().equals("ROLE_MODERATOR"));

        if (!isAdminOrMod) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(ticketService.resolveTicket(id, notes, currentUser));
    }

    // ── PATCH /api/tickets/{id}/close ─────────────────────────────────────────
    // Admin closes a resolved ticket → CLOSED
    @PatchMapping("/{id}/close")
    public ResponseEntity<TicketResponse> closeTicket(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        boolean isAdmin = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(ticketService.closeTicket(id));
    }

    // ── PATCH /api/tickets/{id}/reject ────────────────────────────────────────
    // Admin rejects with reason → REJECTED
    @PatchMapping("/{id}/reject")
    public ResponseEntity<TicketResponse> rejectTicket(
            @PathVariable String id,
            @RequestParam String reason,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        boolean isAdmin = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(ticketService.rejectTicket(id, reason));
    }

    // ── POST /api/tickets/{id}/comments ───────────────────────────────────────
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ticketService.addComment(id, request, currentUser));
    }

    // ── DELETE /api/tickets/{id}/comments/{commentId} ─────────────────────────
    // Author or Admin can delete
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<TicketResponse> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(
            ticketService.deleteComment(id, commentId, currentUser)
        );
    }

    // ── DELETE /api/tickets/{id} ──────────────────────────────────────────────
    // Admin only
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        boolean isAdmin = currentUser.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}

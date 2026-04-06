package com.app.controller;

import com.app.dto.BookingRequest;
import com.app.dto.BookingResponse;
import com.app.dto.BookingStatusUpdateRequest;
import com.app.model.BookingStatus;
import com.app.security.UserPrincipal;
import com.app.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse response = bookingService.createBooking(request, userPrincipal);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) BookingStatus status) {
        List<BookingResponse> bookings = bookingService.getMyBookings(userPrincipal);
        if (status != null) {
            bookings = bookings.stream()
                    .filter(b -> b.getStatus() == status)
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String requestedBy) {
        
        List<BookingResponse> bookings = bookingService.getAllBookings(status, date, resourceId);
        
        if (requestedBy != null) {
            bookings = bookings.stream()
                    .filter(b -> b.getRequestedBy().equals(requestedBy))
                    .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse booking = bookingService.getBookingById(id);

        // Check if user can access this booking
        if (!booking.getRequestedBy().equals(userPrincipal.getId()) &&
            !userPrincipal.getAuthorities().stream().anyMatch(auth ->
                auth.getAuthority().equals("ROLE_ADMIN") || auth.getAuthority().equals("ROLE_MODERATOR"))) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse response = bookingService.approveBooking(id, request, userPrincipal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse response = bookingService.rejectBooking(id, request, userPrincipal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String reason = body.get("reason");
        BookingResponse response = bookingService.cancelBooking(id, reason, userPrincipal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/resource/{resourceId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<BookingResponse>> getBookingsByResource(
            @PathVariable String resourceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<BookingResponse> bookings = bookingService.getBookingsByResource(resourceId);
        if (date != null) {
            bookings = bookings.stream()
                    .filter(b -> b.getDate().equals(date))
                    .toList();
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/conflicts/check")
    public ResponseEntity<Map<String, Object>> checkConflicts(
            @RequestParam String resourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {

        boolean hasConflict = bookingService.checkConflicts(resourceId, date, startTime, endTime, null);
        Map<String, Object> response = new HashMap<>();
        response.put("hasConflict", hasConflict);

        if (hasConflict) {
            // Get conflicting bookings details
            List<BookingResponse> conflictingBookings = bookingService.getBookingsByResource(resourceId)
                    .stream()
                    .filter(b -> b.getDate().equals(date) &&
                           (b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.APPROVED))
                    .toList();
            response.put("conflictingBookings", conflictingBookings);
        }

        return ResponseEntity.ok(response);
    }
}
package com.app.service;

import com.app.dto.BookingRequest;
import com.app.dto.BookingResponse;
import com.app.dto.BookingStatusUpdateRequest;
import com.app.exception.*;
import com.app.model.Booking;
import com.app.model.BookingStatus;
import com.app.model.Facility;
import com.app.model.User;
import com.app.repository.BookingRepository;
import com.app.repository.FacilityRepository;
import com.app.repository.UserRepository;
import com.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    public BookingResponse createBooking(BookingRequest request, UserPrincipal userPrincipal) {
        // Validate date is future
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingStateException("Booking date must be in the future");
        }

        // Validate endTime is after startTime
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidBookingStateException("End time must be after start time");
        }

        // Check resource exists and is ACTIVE
        Facility facility = facilityRepository.findById(request.getResourceId())
                .orElseThrow(() -> new InvalidBookingStateException("Resource not found"));
        if (facility.getStatus() != Facility.FacilityStatus.ACTIVE) {
            throw new InvalidBookingStateException("Resource is not available for booking");
        }

        // Check conflicts
        if (checkConflicts(request.getResourceId(), request.getDate(), request.getStartTime(), request.getEndTime(), null)) {
            throw new ConflictException("Resource already booked for this time slot");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setResourceName(facility.getName());
        booking.setResourceType(facility.getType());
        booking.setRequestedBy(userPrincipal.getId());
        booking.setRequestedByName(userPrincipal.getName());
        booking.setRequestedByEmail(userPrincipal.getEmail());
        booking.setPurpose(request.getPurpose());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Trigger notification (placeholder)
        // TODO: Implement notification service

        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(UserPrincipal userPrincipal) {
        List<Booking> bookings = bookingRepository.findByRequestedBy(userPrincipal.getId());
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings(BookingStatus status, LocalDate date, String resourceId) {
        List<Booking> bookings;

        if (status != null && date != null && resourceId != null) {
            bookings = bookingRepository.findByResourceIdAndDateAndStatus(resourceId, date, status);
        } else if (status != null) {
            bookings = bookingRepository.findByStatus(status);
        } else if (date != null) {
            bookings = bookingRepository.findByResourceIdAndDate(resourceId, date);
        } else {
            bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        }

        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BookingResponse getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        return mapToResponse(booking);
    }

    public BookingResponse approveBooking(String id, BookingStatusUpdateRequest request, UserPrincipal userPrincipal) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingStateException("Only PENDING bookings can be approved");
        }

        // Re-check conflicts before approving
        if (checkConflicts(booking.getResourceId(), booking.getDate(), booking.getStartTime(), booking.getEndTime(), id)) {
            throw new ConflictException("Cannot approve booking due to conflict with another booking");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedBy(userPrincipal.getId());
        booking.setApprovedByName(userPrincipal.getName());
        booking.setApprovedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Trigger notification (placeholder)
        // TODO: Implement notification service

        return mapToResponse(savedBooking);
    }

    public BookingResponse rejectBooking(String id, BookingStatusUpdateRequest request, UserPrincipal userPrincipal) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingStateException("Only PENDING bookings can be rejected");
        }

        if (request.getReason() == null || request.getReason().trim().isEmpty()) {
            throw new InvalidBookingStateException("Rejection reason is required");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(request.getReason());
        booking.setApprovedBy(userPrincipal.getId());
        booking.setApprovedByName(userPrincipal.getName());
        booking.setApprovedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Trigger notification (placeholder)
        // TODO: Implement notification service

        return mapToResponse(savedBooking);
    }

    public BookingResponse cancelBooking(String id, String reason, UserPrincipal userPrincipal) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new InvalidBookingStateException("Only APPROVED bookings can be cancelled");
        }

        // Check if booking owner or admin
        if (!booking.getRequestedBy().equals(userPrincipal.getId()) &&
            !userPrincipal.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            throw new UnauthorizedException("Only booking owner or admin can cancel bookings");
        }

        // Date must be future
        if (!booking.getDate().isAfter(LocalDate.now())) {
            throw new InvalidBookingStateException("Cannot cancel past bookings");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);

        Booking savedBooking = bookingRepository.save(booking);

        // Trigger notification (placeholder)
        // TODO: Implement notification service

        return mapToResponse(savedBooking);
    }

    public boolean checkConflicts(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime, String excludeBookingId) {
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDateAndStatusIn(
                resourceId, date, Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED));

        for (Booking booking : existingBookings) {
            if (excludeBookingId != null && booking.getId().equals(excludeBookingId)) {
                continue;
            }

            // Check for overlap: existing.startTime < newEndTime AND existing.endTime > newStartTime
            if (booking.getStartTime().isBefore(endTime) && booking.getEndTime().isAfter(startTime)) {
                return true;
            }
        }

        return false;
    }

    public List<BookingResponse> getBookingsByResource(String resourceId) {
        List<Booking> bookings = bookingRepository.findByResourceIdAndDate(resourceId, LocalDate.now());
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByDate(LocalDate date) {
        List<Booking> bookings = bookingRepository.findByDateBetween(date, date);
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setResourceId(booking.getResourceId());
        response.setResourceName(booking.getResourceName());
        response.setResourceType(booking.getResourceType());
        response.setRequestedBy(booking.getRequestedBy());
        response.setRequestedByName(booking.getRequestedByName());
        response.setRequestedByEmail(booking.getRequestedByEmail());
        response.setPurpose(booking.getPurpose());
        response.setDate(booking.getDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setExpectedAttendees(booking.getExpectedAttendees());
        response.setStatus(booking.getStatus());
        response.setRejectionReason(booking.getRejectionReason());
        response.setCancellationReason(booking.getCancellationReason());
        response.setApprovedBy(booking.getApprovedBy());
        response.setApprovedByName(booking.getApprovedByName());
        response.setApprovedAt(booking.getApprovedAt());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());

        // Calculate duration in minutes
        if (booking.getStartTime() != null && booking.getEndTime() != null) {
            int duration = (booking.getEndTime().toSecondOfDay() - booking.getStartTime().toSecondOfDay()) / 60;
            response.setDuration(duration);
        }

        // Calculate canCancel
        boolean canCancel = booking.getStatus() == BookingStatus.APPROVED &&
                           booking.getDate().isAfter(LocalDate.now());
        response.setCanCancel(canCancel);

        // Calculate canReview
        boolean canReview = booking.getStatus() == BookingStatus.PENDING;
        response.setCanReview(canReview);

        return response;
    }
}
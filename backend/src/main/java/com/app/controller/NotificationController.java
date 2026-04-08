package com.app.controller;

import com.app.dto.*;
import com.app.model.*;
import com.app.repository.NotificationRepository;
import com.app.repository.UserNotificationPreferenceRepository;
import com.app.security.UserPrincipal;
import com.app.service.NotificationService;
import com.app.service.SmartNotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final SmartNotificationService smartNotificationService;
    private final NotificationRepository notificationRepository;
    private final UserNotificationPreferenceRepository preferenceRepository;

    @Autowired
    public NotificationController(NotificationService notificationService,
                                  SmartNotificationService smartNotificationService,
                                  NotificationRepository notificationRepository,
                                  UserNotificationPreferenceRepository preferenceRepository) {
        this.notificationService = notificationService;
        this.smartNotificationService = smartNotificationService;
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<Page<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        
        int start = page * size;
        int end = Math.min((page + 1) * size, notifications.size());
        
        List<NotificationResponse> responses = notifications.subList(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new PageImpl<>(responses, PageRequest.of(page, size), notifications.size()));
    }

    @GetMapping("/my/unread-count")
    public ResponseEntity<Object> getUnreadCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(java.util.Collections.singletonMap("count", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Notification n = notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(n));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Object> markAllAsRead(@AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(java.util.Collections.singletonMap("updated", true));
    }

    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<NotificationResponse> sendManualNotification(
            @Valid @RequestBody ManualNotificationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Notification n = notificationService.sendManualNotification(
                request.getUserId(), request.getTitle(), request.getMessage(), request.getPriority(), currentUser);
        return new ResponseEntity<>(mapToResponse(n), HttpStatus.CREATED);
    }

    @PostMapping("/send-bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> sendBulkNotification(
            @Valid @RequestBody BulkNotificationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        // Logic for targetRole would go here if role based
        notificationService.sendBulkNotification(request.getUserIds(), request.getTitle(), request.getMessage(), request.getPriority(), currentUser);
        return new ResponseEntity<>(java.util.Collections.singletonMap("sent", request.getUserIds().size()), HttpStatus.CREATED);
    }

    @GetMapping("/analytics/my")
    public ResponseEntity<UserNotificationStats> getMyAnalytics(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(smartNotificationService.getNotificationStats(currentUser.getId()));
    }

    @GetMapping("/analytics/system")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemNotificationStats> getSystemAnalytics() {
        return ResponseEntity.ok(smartNotificationService.getSystemAnalytics());
    }

    @GetMapping("/preferences/my")
    public ResponseEntity<UserNotificationPreference> getMyPreferences(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserNotificationPreference prefs = preferenceRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> preferenceRepository.save(UserNotificationPreference.builder().userId(currentUser.getId()).build()));
        return ResponseEntity.ok(prefs);
    }

    @PutMapping("/preferences/my")
    public ResponseEntity<UserNotificationPreference> updateMyPreferences(
            @Valid @RequestBody NotificationPreferenceRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserNotificationPreference prefs = preferenceRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    UserNotificationPreference newPrefs = new UserNotificationPreference();
                    newPrefs.setUserId(currentUser.getId());
                    return newPrefs;
                });
        
        prefs.setBookingNotifications(request.isBookingNotifications());
        prefs.setBookingApprovedEnabled(request.isBookingApprovedEnabled());
        prefs.setBookingRejectedEnabled(request.isBookingRejectedEnabled());
        prefs.setBookingCancelledEnabled(request.isBookingCancelledEnabled());
        prefs.setBookingRequestedEnabled(request.isBookingRequestedEnabled());
        prefs.setTicketCreatedEnabled(request.isTicketCreatedEnabled());
        prefs.setTicketStatusEnabled(request.isTicketStatusEnabled());
        prefs.setTicketCommentEnabled(request.isTicketCommentEnabled());
        prefs.setTicketResolvedEnabled(request.isTicketResolvedEnabled());
        prefs.setSystemNotifications(request.isSystemNotifications());
        prefs.setDigestMode(request.isDigestMode());
        prefs.setDigestIntervalHours(request.getDigestIntervalHours());
        prefs.setPreferredDeliveryHour(request.getPreferredDeliveryHour());
        
        UserNotificationPreference saved = preferenceRepository.save(prefs);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/preferences/mute")
    public ResponseEntity<UserNotificationPreference> muteNotifications(
            @RequestBody java.util.Map<String, Integer> request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        int hours = request.getOrDefault("hours", 1);
        UserNotificationPreference prefs = preferenceRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> UserNotificationPreference.builder().userId(currentUser.getId()).build());
        
        prefs.setMuteAll(true);
        prefs.setMutedUntil(LocalDateTime.now().plusHours(hours));
        
        return ResponseEntity.ok(preferenceRepository.save(prefs));
    }

    @PutMapping("/preferences/unmute")
    public ResponseEntity<UserNotificationPreference> unmuteNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserNotificationPreference prefs = preferenceRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> UserNotificationPreference.builder().userId(currentUser.getId()).build());
        
        prefs.setMuteAll(false);
        prefs.setMutedUntil(null);
        
        return ResponseEntity.ok(preferenceRepository.save(prefs));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        if (!n.getUserId().equals(currentUser.getId()) && !currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .userEmail(n.getUserEmail())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .category(n.getCategory())
                .status(n.getStatus())
                .priority(n.getPriority())
                .relatedEntityId(n.getRelatedEntityId())
                .relatedEntityType(n.getRelatedEntityType())
                .sentBy(n.getSentBy())
                .sentByName(n.getSentByName())
                .isRead(n.isRead())
                .readAt(n.getReadAt())
                .deliveredAt(n.getDeliveredAt())
                .createdAt(n.getCreatedAt())
                .build();
    }
}

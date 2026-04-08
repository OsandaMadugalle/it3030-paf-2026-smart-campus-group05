package com.app.service;

import com.app.model.*;
import com.app.repository.NotificationAnalyticsRepository;
import com.app.repository.NotificationRepository;
import com.app.repository.UserNotificationPreferenceRepository;
import com.app.repository.UserRepository;
import com.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserNotificationPreferenceRepository preferenceRepository;
    private final NotificationAnalyticsRepository analyticsRepository;
    private final UserRepository userRepository;
    private final SmartNotificationService smartNotificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               UserNotificationPreferenceRepository preferenceRepository,
                               NotificationAnalyticsRepository analyticsRepository,
                               UserRepository userRepository,
                               SmartNotificationService smartNotificationService,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.analyticsRepository = analyticsRepository;
        this.userRepository = userRepository;
        this.smartNotificationService = smartNotificationService;
        this.messagingTemplate = messagingTemplate;
    }

    public Notification sendNotification(String userId, String title, String message, NotificationType type, 
                                       NotificationPriority priority, String relatedEntityId, String relatedEntityType) {
        
        UserNotificationPreference prefs = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(UserNotificationPreference.builder().userId(userId).build()));

        // Mute check logic moved to real-time delivery block below
        if (prefs.isMuteAll()) {
            if (prefs.getMutedUntil() != null && !prefs.getMutedUntil().isAfter(LocalDateTime.now())) {
                // Auto unmute
                prefs.setMuteAll(false);
                prefs.setMutedUntil(null);
                preferenceRepository.save(prefs);
            }
        }

        // Specific category toggle check
        boolean enabled = switch (type) {
            case BOOKING_REQUESTED -> prefs.isBookingRequestedEnabled();
            case BOOKING_APPROVED -> prefs.isBookingApprovedEnabled();
            case BOOKING_REJECTED -> prefs.isBookingRejectedEnabled();
            case BOOKING_CANCELLED -> prefs.isBookingCancelledEnabled();
            case TICKET_CREATED -> prefs.isTicketCreatedEnabled();
            case TICKET_STATUS_UPDATED, TICKET_ASSIGNED -> prefs.isTicketStatusEnabled();
            case TICKET_COMMENT_ADDED -> prefs.isTicketCommentEnabled();
            case TICKET_RESOLVED -> prefs.isTicketResolvedEnabled();
            default -> true;
        };

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .userId(userId)
                .userEmail(user.getEmail())
                .title(title)
                .message(message)
                .type(type)
                .category(determineCategory(type))
                .priority(priority)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .status(NotificationStatus.PENDING)
                .build();

        if (prefs.isDigestMode()) {
            notification.setStatus(NotificationStatus.PENDING);
            notification.setDigestGroupId("DIGEST_" + userId);
        } else if (prefs.getPreferredDeliveryHour() != -1) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime deliveryTime = now.withHour(prefs.getPreferredDeliveryHour()).withMinute(0).withSecond(0).withNano(0);
            if (deliveryTime.isBefore(now)) {
                deliveryTime = deliveryTime.plusDays(1);
            }
            notification.setNextRetryAt(deliveryTime);
            notification.setStatus(NotificationStatus.PENDING);
        } else {
            notification.setStatus(NotificationStatus.DELIVERED);
            notification.setDeliveredAt(LocalDateTime.now());
        }

        Notification saved = notificationRepository.save(notification);
        
        // Real-time WebSocket notify (only if enabled/not muted)
        if (enabled && (prefs.getMutedUntil() == null || !prefs.getMutedUntil().isAfter(LocalDateTime.now()))) {
             messagingTemplate.convertAndSendToUser(userId, "/topic/notifications", saved);
        }

        return saved;
    }

    private NotificationCategory determineCategory(NotificationType type) {
        return switch (type) {
            case BOOKING_REQUESTED, BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED, BOOKING_REMINDER -> NotificationCategory.BOOKING;
            case TICKET_CREATED, TICKET_ASSIGNED, TICKET_STATUS_UPDATED, TICKET_COMMENT_ADDED, TICKET_RESOLVED, TICKET_CLOSED, TICKET_REJECTED -> NotificationCategory.TICKET;
            default -> NotificationCategory.SYSTEM;
        };
    }

    public void sendTicketCreatedNotification(Ticket ticket) {
        String title = "New Incident Ticket 🎫";
        String message = String.format("A new incident ticket #%s has been submitted for %s. Category: %s, Priority: %s",
                ticket.getId(), 
                ticket.getLocation() != null ? ticket.getLocation() : "Unknown Location",
                ticket.getCategory(), 
                ticket.getPriority());

        NotificationPriority priority = switch (ticket.getPriority()) {
            case HIGH, CRITICAL -> NotificationPriority.HIGH;
            case MEDIUM -> NotificationPriority.NORMAL;
            case LOW -> NotificationPriority.LOW;
        };

        // Notify Admins
        List<User> admins = userRepository.findByRoles(Role.ROLE_ADMIN);
        for (User admin : admins) {
            sendNotification(admin.getId(), title, message, NotificationType.TICKET_CREATED,
                    priority, ticket.getId(), "TICKET");
        }

        // Notify Moderators
        List<User> moderators = userRepository.findByRoles(Role.ROLE_MODERATOR);
        for (User moderator : moderators) {
            sendNotification(moderator.getId(), title, message, NotificationType.TICKET_CREATED,
                    priority, ticket.getId(), "TICKET");
        }
    }

    public void sendTicketAssignedNotification(String technicianUserId, Ticket ticket) {
        String title = "Ticket Assigned to You 🔧";
        String message = String.format("Incident ticket #%s for %s has been assigned to you. Please review and begin work.",
                ticket.getId(), ticket.getLocation() != null ? ticket.getLocation() : "Unknown Location");
        
        sendNotification(technicianUserId, title, message, NotificationType.TICKET_ASSIGNED,
                NotificationPriority.HIGH, ticket.getId(), "TICKET");
    }

    public void sendTicketStatusUpdatedNotification(String userId, Ticket ticket, String oldStatus, String newStatus) {
        String title = "Ticket Status Updated 🔄";
        String message = String.format("Your incident ticket #%s status changed from %s to %s",
                ticket.getId(), oldStatus, newStatus);
        
        sendNotification(userId, title, message, NotificationType.TICKET_STATUS_UPDATED,
                NotificationPriority.NORMAL, ticket.getId(), "TICKET");
    }

    public void sendTicketResolvedNotification(String userId, Ticket ticket, String resolutionNote) {
        String title = "Ticket Resolved ✅";
        String message = String.format("Your incident ticket #%s for %s has been resolved. Note: %s",
                ticket.getId(), ticket.getLocation() != null ? ticket.getLocation() : "Unknown Location", resolutionNote);
        
        sendNotification(userId, title, message, NotificationType.TICKET_RESOLVED,
                NotificationPriority.HIGH, ticket.getId(), "TICKET");
    }

    public void sendTicketRejectedNotification(String userId, Ticket ticket, String reason) {
        String title = "Ticket Rejected ❌";
        String message = String.format("Your incident ticket #%s has been rejected. Reason: %s",
                ticket.getId(), reason);
        
        sendNotification(userId, title, message, NotificationType.TICKET_REJECTED,
                NotificationPriority.HIGH, ticket.getId(), "TICKET");
    }

    public void sendTicketCommentNotification(String userId, Ticket ticket, String commenterName, String commentPreview) {
        String title = "New Comment on Your Ticket 💬";
        String message = String.format("%s commented on ticket #%s: %s...",
                commenterName, ticket.getId(), commentPreview.length() > 50 ? commentPreview.substring(0, 50) : commentPreview);
        
        sendNotification(userId, title, message, NotificationType.TICKET_COMMENT_ADDED,
                NotificationPriority.NORMAL, ticket.getId(), "TICKET");
    }

    public void sendTicketClosedNotification(String userId, Ticket ticket) {
        String title = "Ticket Closed 🔒";
        String message = String.format("Your incident ticket #%s for %s has been closed.",
                ticket.getId(), ticket.getLocation() != null ? ticket.getLocation() : "Unknown Location");
        
        sendNotification(userId, title, message, NotificationType.TICKET_CLOSED,
                NotificationPriority.LOW, ticket.getId(), "TICKET");
    }

    public void sendBookingRequestNotification(Booking booking) {
        String title = "New Booking Request 📅";
        String message = String.format("A new booking request for %s by %s on %s %s-%s", 
                booking.getResourceName(), booking.getRequestedByName(), booking.getDate(), booking.getStartTime(), booking.getEndTime());

        // Notify Admins
        List<User> admins = userRepository.findByRoles(Role.ROLE_ADMIN);
        for (User admin : admins) {
            sendNotification(admin.getId(), title, message, NotificationType.BOOKING_REQUESTED, 
                    NotificationPriority.HIGH, booking.getId(), "BOOKING");
        }

        // Notify Moderators
        List<User> moderators = userRepository.findByRoles(Role.ROLE_MODERATOR);
        for (User moderator : moderators) {
            sendNotification(moderator.getId(), title, message, NotificationType.BOOKING_REQUESTED, 
                    NotificationPriority.NORMAL, booking.getId(), "BOOKING");
        }
    }

    public void sendBookingApprovedNotification(String userId, Booking booking) {
        String message = String.format("Your booking for %s on %s %s-%s has been approved!", 
                booking.getResourceName(), booking.getDate(), booking.getStartTime(), booking.getEndTime());
        sendNotification(userId, "Booking Approved ✅", message, NotificationType.BOOKING_APPROVED, 
                NotificationPriority.HIGH, booking.getId(), "BOOKING");
    }

    public void sendBookingRejectedNotification(String userId, Booking booking, String reason) {
        String message = String.format("Your booking for %s on %s has been rejected. Reason: %s", 
                booking.getResourceName(), booking.getDate(), reason);
        sendNotification(userId, "Booking Rejected ❌", message, NotificationType.BOOKING_REJECTED, 
                NotificationPriority.HIGH, booking.getId(), "BOOKING");
    }

    public void sendBookingCancelledNotification(String userId, Booking booking) {
        String message = String.format("Your booking for %s on %s has been cancelled", 
                booking.getResourceName(), booking.getDate());
        sendNotification(userId, "Booking Cancelled", message, NotificationType.BOOKING_CANCELLED, 
                NotificationPriority.NORMAL, booking.getId(), "BOOKING");
    }

    public Notification sendManualNotification(String userId, String title, String message, 
                                             NotificationPriority priority, UserPrincipal sender) {
        Notification n = Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .type(NotificationType.MANUAL)
                .category(NotificationCategory.SYSTEM)
                .priority(priority)
                .sentBy(sender.getId())
                .sentByName(sender.getName())
                .status(NotificationStatus.DELIVERED)
                .deliveredAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(n);
    }

    public void sendBulkNotification(List<String> userIds, String title, String message, 
                                    NotificationPriority priority, UserPrincipal sender) {
        for (String id : userIds) {
            sendManualNotification(id, title, message, priority, sender);
        }
    }

    public Notification markAsRead(String notificationId, String userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!n.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (!n.isRead()) {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
            n.setStatus(NotificationStatus.READ);
            
            NotificationAnalytics analytics = NotificationAnalytics.builder()
                    .userId(userId)
                    .notificationId(notificationId)
                    .openedAt(n.getReadAt())
                    .timeToOpen(java.time.Duration.between(n.getDeliveredAt() != null ? n.getDeliveredAt() : n.getCreatedAt(), n.getReadAt()).toMinutes())
                    .dayOfWeek(n.getReadAt().getDayOfWeek().name())
                    .hourOfDay(n.getReadAt().getHour())
                    .notificationType(n.getType().name())
                    .build();
            analyticsRepository.save(analytics);
        }
        
        return notificationRepository.save(n);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsRead(userId, false);
        for (Notification n : unread) {
            markAsRead(n.getId(), userId);
        }
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    public void processDigest(String userId) {
        List<Notification> pending = notificationRepository.findByDigestGroupId("DIGEST_" + userId)
                .stream().filter(n -> n.getStatus() == NotificationStatus.PENDING).toList();
        
        if (pending.isEmpty()) return;

        String summary = smartNotificationService.generateDigestSummary(userId);
        
        Notification digest = Notification.builder()
                .userId(userId)
                .title("Your Activity Digest")
                .message(summary)
                .type(NotificationType.DIGEST)
                .category(NotificationCategory.SYSTEM)
                .priority(NotificationPriority.NORMAL)
                .status(NotificationStatus.DELIVERED)
                .deliveredAt(LocalDateTime.now())
                .build();
        
        notificationRepository.save(digest);

        pending.forEach(n -> {
            n.setStatus(NotificationStatus.DELIVERED);
            n.setDeliveredAt(LocalDateTime.now());
            notificationRepository.save(n);
        });
    }

    @Scheduled(fixedDelay = 1800000)
    public void retryFailedNotifications() {
        List<Notification> failed = notificationRepository.findByStatusAndRetryCountLessThan(NotificationStatus.FAILED, 3);
        for (Notification n : failed) {
            n.setRetryCount(n.getRetryCount() + 1);
            n.setStatus(NotificationStatus.RETRYING);
            // In a real app, logic to actually retry sending (email/push) would go here
            n.setStatus(NotificationStatus.DELIVERED);
            n.setDeliveredAt(LocalDateTime.now());
            notificationRepository.save(n);
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    public void processScheduledNotifications() {
        List<Notification> scheduled = notificationRepository.findByNextRetryAtBeforeAndStatus(LocalDateTime.now(), NotificationStatus.PENDING);
        for (Notification n : scheduled) {
            n.setStatus(NotificationStatus.DELIVERED);
            n.setDeliveredAt(LocalDateTime.now());
            notificationRepository.save(n);
        }
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendDailyDigests() {
        List<String> userIdsWithDigests = userRepository.findAll().stream()
                .map(User::getId)
                .toList(); // Simplified, should check preferences
        userIdsWithDigests.forEach(this::processDigest);
    }
}

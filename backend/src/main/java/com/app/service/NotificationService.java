package com.app.service;

import com.app.model.*;
import com.app.repository.NotificationAnalyticsRepository;
import com.app.repository.NotificationRepository;
import com.app.repository.UserNotificationPreferenceRepository;
import com.app.repository.UserRepository;
import com.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               UserNotificationPreferenceRepository preferenceRepository,
                               NotificationAnalyticsRepository analyticsRepository,
                               UserRepository userRepository,
                               SmartNotificationService smartNotificationService) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.analyticsRepository = analyticsRepository;
        this.userRepository = userRepository;
        this.smartNotificationService = smartNotificationService;
    }

    public Notification sendNotification(String userId, String title, String message, NotificationType type, 
                                       NotificationPriority priority, String relatedEntityId, String relatedEntityType) {
        
        UserNotificationPreference prefs = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(UserNotificationPreference.builder().userId(userId).build()));

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

        return notificationRepository.save(notification);
    }

    private NotificationCategory determineCategory(NotificationType type) {
        return switch (type) {
            case BOOKING_REQUESTED, BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED, BOOKING_REMINDER -> NotificationCategory.BOOKING;
            case ANNOUNCEMENT -> NotificationCategory.ANNOUNCEMENT;
            case SYSTEM_ALERT -> NotificationCategory.SYSTEM;
            default -> NotificationCategory.SYSTEM;
        };
    }

    public void sendBookingRequestNotification(Booking booking) {
        String title = "New Booking Request 📅";
        String message = String.format("A new booking request for %s by %s on %s %s-%s", 
                booking.getResourceName(), booking.getRequestedByName(), booking.getDate(), booking.getStartTime(), booking.getEndTime());

        // Notify Admins
        List<User> admins = userRepository.findByRolesContaining(Role.ROLE_ADMIN);
        for (User admin : admins) {
            sendNotification(admin.getId(), title, message, NotificationType.BOOKING_REQUESTED, 
                    NotificationPriority.HIGH, booking.getId(), "BOOKING");
        }

        // Notify Moderators
        List<User> moderators = userRepository.findByRolesContaining(Role.ROLE_MODERATOR);
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

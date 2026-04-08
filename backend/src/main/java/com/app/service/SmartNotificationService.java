package com.app.service;

import com.app.dto.SystemNotificationStats;
import com.app.dto.UserNotificationStats;
import com.app.model.Notification;
import com.app.model.NotificationAnalytics;
import com.app.model.NotificationStatus;
import com.app.repository.NotificationAnalyticsRepository;
import com.app.repository.NotificationRepository;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmartNotificationService {

    private final NotificationAnalyticsRepository analyticsRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public SmartNotificationService(NotificationAnalyticsRepository analyticsRepository,
                                    NotificationRepository notificationRepository,
                                    UserRepository userRepository) {
        this.analyticsRepository = analyticsRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public int analyzeBestDeliveryTime(String userId) {
        List<NotificationAnalytics> analytics = analyticsRepository.findByUserId(userId);
        if (analytics.size() < 5) return -1;

        return analytics.stream()
                .collect(Collectors.groupingBy(NotificationAnalytics::getHourOfDay, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(-1);
    }

    public String generateDigestSummary(String userId) {
        List<Notification> pending = notificationRepository.findByDigestGroupId("DIGEST_" + userId)
                .stream().filter(n -> n.getStatus() == NotificationStatus.PENDING).toList();

        Map<String, Long> counts = pending.stream()
                .collect(Collectors.groupingBy(n -> n.getCategory().name(), Collectors.counting()));

        StringBuilder sb = new StringBuilder();
        if (counts.containsKey("BOOKING")) sb.append("📅 ").append(counts.get("BOOKING")).append(" booking updates • ");
        if (counts.containsKey("ANNOUNCEMENT")) sb.append("📢 ").append(counts.get("ANNOUNCEMENT")).append(" announcements • ");
        if (counts.containsKey("SYSTEM")) sb.append("⚠️ ").append(counts.get("SYSTEM")).append(" system alerts");
        
        String res = sb.toString().trim();
        if (res.endsWith("•")) res = res.substring(0, res.length() - 2);
        
        return res.isEmpty() ? "No new updates" : res;
    }

    public UserNotificationStats getNotificationStats(String userId) {
        List<Notification> all = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long totalSent = all.size();
        long totalRead = all.stream().filter(Notification::isRead).count();
        double openRate = totalSent == 0 ? 0 : (double) totalRead / totalSent * 100;
        
        List<NotificationAnalytics> analytics = analyticsRepository.findByUserId(userId);
        double avgTime = analytics.stream().mapToLong(NotificationAnalytics::getTimeToOpen).average().orElse(0);
        
        Map<String, Long> typeBreakdown = all.stream()
                .collect(Collectors.groupingBy(n -> n.getType().name(), Collectors.counting()));

        return UserNotificationStats.builder()
                .totalSent(totalSent)
                .totalRead(totalRead)
                .openRate(openRate)
                .avgTimeToOpen(avgTime)
                .bestHour(analyzeBestDeliveryTime(userId))
                .typeBreakdown(typeBreakdown)
                .build();
    }

    public SystemNotificationStats getSystemAnalytics() {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0);
        LocalDateTime week = LocalDateTime.now().minusWeeks(1);

        long totalToday = notificationRepository.findAll().stream()
                .filter(n -> n.getCreatedAt().isAfter(today)).count();
        long totalWeek = notificationRepository.findAll().stream()
                .filter(n -> n.getCreatedAt().isAfter(week)).count();

        List<Notification> all = notificationRepository.findAll();
        long totalSent = all.size();
        long totalRead = all.stream().filter(Notification::isRead).count();
        double openRate = totalSent == 0 ? 0 : (double) totalRead / totalSent * 100;

        // Simplified peak hours
        Map<Integer, Long> peakHours = analyticsRepository.findAll().stream()
                .collect(Collectors.groupingBy(NotificationAnalytics::getHourOfDay, Collectors.counting()));

        return SystemNotificationStats.builder()
                .totalToday(totalToday)
                .totalWeek(totalWeek)
                .overallOpenRate(openRate)
                .peakHours(peakHours)
                .build();
    }
}

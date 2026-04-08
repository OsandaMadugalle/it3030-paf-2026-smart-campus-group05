package com.app.repository;

import com.app.model.NotificationAnalytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationAnalyticsRepository extends MongoRepository<NotificationAnalytics, String> {
    List<NotificationAnalytics> findByUserId(String userId);
    List<NotificationAnalytics> findByNotificationType(String type);
    List<NotificationAnalytics> findByUserIdAndCreatedAtAfter(String userId, LocalDateTime after);
}

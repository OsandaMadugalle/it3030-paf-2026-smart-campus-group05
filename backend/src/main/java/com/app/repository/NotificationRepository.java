package com.app.repository;

import com.app.model.Notification;
import com.app.model.NotificationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndIsRead(String userId, boolean isRead);
    List<Notification> findByUserIdAndStatus(String userId, NotificationStatus status);
    List<Notification> findByStatusAndRetryCountLessThan(NotificationStatus status, int maxRetries);
    List<Notification> findByNextRetryAtBeforeAndStatus(LocalDateTime time, NotificationStatus status);
    List<Notification> findByUserIdAndCreatedAtAfter(String userId, LocalDateTime after);
    long countByUserIdAndIsRead(String userId, boolean isRead);
    List<Notification> findByDigestGroupId(String digestGroupId);
    void deleteByUserId(String userId);
    long countByCreatedAtAfter(LocalDateTime after);
    long countByIsRead(boolean isRead);
}

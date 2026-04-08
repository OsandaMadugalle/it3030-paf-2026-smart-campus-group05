package com.app.repository;

import com.app.model.UserNotificationPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserNotificationPreferenceRepository extends MongoRepository<UserNotificationPreference, String> {
    Optional<UserNotificationPreference> findByUserId(String userId);
}

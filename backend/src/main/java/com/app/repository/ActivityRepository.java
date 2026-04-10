package com.app.repository;

import com.app.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository; // Import Mongo version
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    // MongoDB supports this same naming convention!
    List<Activity> findTop10ByOrderByTimestampDesc();
}
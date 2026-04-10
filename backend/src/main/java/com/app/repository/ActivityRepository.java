package com.app.repository;

import com.app.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository; // <-- Check this import
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findTop10ByOrderByTimestampDesc();
}
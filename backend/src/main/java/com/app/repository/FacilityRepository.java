package com.app.repository;

import com.app.model.Facility;
import com.app.model.Facility.FacilityStatus;
import com.app.model.Facility.FacilityType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {

    // Find all by status (e.g. only ACTIVE ones for users)
    List<Facility> findByStatus(FacilityStatus status);

    // Filter by type
    List<Facility> findByTypeAndStatus(FacilityType type, FacilityStatus status);

    // Filter by minimum capacity
    List<Facility> findByCapacityGreaterThanEqualAndStatus(int capacity, FacilityStatus status);

    // Filter by location (case-insensitive contains)
    List<Facility> findByLocationContainingIgnoreCaseAndStatus(String location, FacilityStatus status);

    // Combined search: type + minimum capacity + status
    List<Facility> findByTypeAndCapacityGreaterThanEqualAndStatus(
        FacilityType type, int capacity, FacilityStatus status
    );

    // Full flexible search using @Query (MongoDB JSON query)
    // Matches name or location containing the keyword, case-insensitive
    @Query("{ $or: [ " +
           "  { 'name':     { $regex: ?0, $options: 'i' } }, " +
           "  { 'location': { $regex: ?0, $options: 'i' } }, " +
           "  { 'description': { $regex: ?0, $options: 'i' } } " +
           "], 'status': ?1 }")
    List<Facility> searchByKeyword(String keyword, FacilityStatus status);
}
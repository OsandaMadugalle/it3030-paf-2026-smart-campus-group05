package com.app.service;

import com.app.dto.FacilityRequest;
import com.app.dto.FacilityResponse;
import com.app.model.Facility;
import com.app.model.Facility.FacilityStatus;
import com.app.model.Facility.FacilityType;
import com.app.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    //  Create 

    public FacilityResponse createFacility(FacilityRequest request, String adminUserId) {
        Facility facility = new Facility();
        mapRequestToFacility(request, facility);
        facility.setCreatedBy(adminUserId);
        Facility saved = facilityRepository.save(facility);
        return FacilityResponse.from(saved);
    }

    //  Read all (admin sees everything, users see only ACTIVE) 

    public List<FacilityResponse> getAllFacilities(boolean adminView) {
        List<Facility> facilities = adminView
            ? facilityRepository.findAll()
            : facilityRepository.findByStatus(FacilityStatus.ACTIVE);
        return toResponseList(facilities);
    }

    //  Read one 

    public FacilityResponse getFacilityById(String id) {
        Facility facility = facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
        return FacilityResponse.from(facility);
    }

    //  Search & filter 

    public List<FacilityResponse> searchFacilities(
            String keyword,
            FacilityType type,
            Integer minCapacity,
            String location) {

        // Keyword search takes priority if provided
        if (keyword != null && !keyword.isBlank()) {
            return toResponseList(
                facilityRepository.searchByKeyword(keyword.trim(), FacilityStatus.ACTIVE)
            );
        }

        // Combined type + capacity filter
        if (type != null && minCapacity != null) {
            return toResponseList(
                facilityRepository.findByTypeAndCapacityGreaterThanEqualAndStatus(
                    type, minCapacity, FacilityStatus.ACTIVE)
            );
        }

        // Type filter only
        if (type != null) {
            return toResponseList(
                facilityRepository.findByTypeAndStatus(type, FacilityStatus.ACTIVE)
            );
        }

        // Capacity filter only
        if (minCapacity != null) {
            return toResponseList(
                facilityRepository.findByCapacityGreaterThanEqualAndStatus(
                    minCapacity, FacilityStatus.ACTIVE)
            );
        }

        // Location filter only
        if (location != null && !location.isBlank()) {
            return toResponseList(
                facilityRepository.findByLocationContainingIgnoreCaseAndStatus(
                    location, FacilityStatus.ACTIVE)
            );
        }

        // No filters → return all active
        return toResponseList(facilityRepository.findByStatus(FacilityStatus.ACTIVE));
    }

    //  Update 

    public FacilityResponse updateFacility(String id, FacilityRequest request) {
        Facility facility = facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
        mapRequestToFacility(request, facility);
        return FacilityResponse.from(facilityRepository.save(facility));
    }

    //  Delete 

    public void deleteFacility(String id) {
        if (!facilityRepository.existsById(id)) {
            throw new RuntimeException("Facility not found with id: " + id);
        }
        facilityRepository.deleteById(id);
    }

    //  Mark out of service 

    public FacilityResponse setStatus(String id, FacilityStatus newStatus) {
        Facility facility = facilityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));
        facility.setStatus(newStatus);
        return FacilityResponse.from(facilityRepository.save(facility));
    }

    //  Helpers 

    private void mapRequestToFacility(FacilityRequest req, Facility facility) {
        facility.setName(req.getName());
        facility.setType(req.getType());
        facility.setCapacity(req.getCapacity());
        facility.setLocation(req.getLocation());
        facility.setDescription(req.getDescription());
        facility.setAvailabilityWindows(req.getAvailabilityWindows());
        facility.setStatus(req.getStatus() != null ? req.getStatus() : FacilityStatus.ACTIVE);
        facility.setImageUrl(req.getImageUrl());
    }

    private List<FacilityResponse> toResponseList(List<Facility> facilities) {
        return facilities.stream()
            .map(FacilityResponse::from)
            .collect(Collectors.toList());
    }
}
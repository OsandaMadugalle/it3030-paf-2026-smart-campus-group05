package com.app.controller;

import com.app.dto.FacilityRequest;
import com.app.dto.FacilityResponse;
import com.app.model.Facility.FacilityStatus;
import com.app.model.Facility.FacilityType;
import com.app.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")   // adjust to your frontend URL in production
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    //  GET /api/facilities 
    // All authenticated users can call this.
    // Admins get all (including OUT_OF_SERVICE), users get only ACTIVE.
    @GetMapping
    public ResponseEntity<List<FacilityResponse>> getAllFacilities(
            @RequestParam(required = false, defaultValue = "false") boolean adminView,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Allow adminView=true if the caller has ADMIN or MODERATOR role
        boolean isStaff = false;
        if (userDetails != null && userDetails.getAuthorities() != null) {
            isStaff = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MODERATOR"));
        }
        
        List<FacilityResponse> facilities = facilityService.getAllFacilities(adminView && isStaff);
        return ResponseEntity.ok(facilities);
    }

    //  GET /api/facilities/search 
    // Search and filter. Open to all authenticated users.
    // Example: GET /api/facilities/search?type=LAB&minCapacity=20
    @GetMapping("/search")
    public ResponseEntity<List<FacilityResponse>> searchFacilities(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) FacilityType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location) {

        List<FacilityResponse> results =
            facilityService.searchFacilities(keyword, type, minCapacity, location);
        return ResponseEntity.ok(results);
    }

    //  GET /api/facilities/{id} 
    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponse> getFacilityById(@PathVariable String id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    //  POST /api/facilities 
    // Admin only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponse> createFacility(
            @Valid @RequestBody FacilityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        FacilityResponse created = facilityService.createFacility(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    //  PUT /api/facilities/{id} 
    // Admin only — full update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponse> updateFacility(
            @PathVariable String id,
            @Valid @RequestBody FacilityRequest request) {

        return ResponseEntity.ok(facilityService.updateFacility(id, request));
    }

    //  PATCH /api/facilities/{id}/status 
    // Admin only — quickly flip status (ACTIVE ↔ OUT_OF_SERVICE)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacilityResponse> updateStatus(
            @PathVariable String id,
            @RequestParam FacilityStatus status) {

        return ResponseEntity.ok(facilityService.setStatus(id, status));
    }

    //  DELETE /api/facilities/{id} 
    // Admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();   // 204 No Content
    }
}
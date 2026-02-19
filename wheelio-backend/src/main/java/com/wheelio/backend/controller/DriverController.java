package com.wheelio.backend.controller;

import com.wheelio.backend.model.DriverProfile;
import com.wheelio.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drivers")

public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping
    public List<DriverProfile> getAllDrivers() {
        return driverService.getAllDriverProfiles();
    }

    @GetMapping("/available")
    public List<DriverProfile> getAvailableDrivers(@RequestParam(required = false) String city) {
        if (city != null && !city.isEmpty()) {
            return driverService.getAvailableDriversByCity(city);
        }
        return driverService.getAvailableDrivers();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DriverProfile> getDriverProfile(@PathVariable UUID userId) {
        return driverService.getDriverProfileById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<DriverProfile> updateDriverProfile(
            @PathVariable UUID userId,
            @RequestBody DriverProfile profileDetails) {
        return driverService.getDriverProfileById(userId)
                .map(profile -> {
                    if (profileDetails.getLicenseNumber() != null) {
                        profile.setLicenseNumber(profileDetails.getLicenseNumber());
                    }
                    if (profileDetails.getRating() != null) {
                        profile.setRating(profileDetails.getRating());
                    }
                    if (profileDetails.getStatus() != null) {
                        profile.setStatus(profileDetails.getStatus());
                    }
                    if (profileDetails.getDocuments() != null) {
                        profile.setDocuments(profileDetails.getDocuments());
                    }
                    return ResponseEntity.ok(driverService.updateDriverProfile(profile));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DriverProfile> createDriverProfile(@RequestBody DriverProfile profile) {
        DriverProfile savedProfile = driverService.createDriverProfile(profile);
        return ResponseEntity.ok(savedProfile);
    }
}

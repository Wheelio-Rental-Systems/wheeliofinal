package com.wheelio.backend.controller;

import com.wheelio.backend.model.DriverProfile;
import com.wheelio.backend.model.User;
import com.wheelio.backend.service.DriverService;
import com.wheelio.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<DriverProfile> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    @GetMapping("/available")
    public List<DriverProfile> getAvailableDrivers() {
        return driverService.getAvailableDrivers();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getDriverByUserId(@PathVariable String userId) {
        return driverService.getDriverByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createDriver(@RequestBody DriverCreateRequest request) {
        try {
            // Create user account for the driver
            if (userService.existsByEmail(request.getEmail())) {
                // If user already exists, just create profile
                Optional<User> existing = userService.getUserByEmail(request.getEmail());
                if (existing.isPresent()) {
                    User u = existing.get();
                    // CRITICAL: Only set role to DRIVER if they aren't already a regular USER or
                    // ADMIN.
                    // This prevents regular users from being flipped to DRIVER when they verify
                    // their license.
                    if (u.getRole() == null || u.getRole() == User.Role.DRIVER) {
                        u.setRole(User.Role.DRIVER);
                        userService.updateUser(u);
                    }
                    return createDriverProfile(request, u.getId());
                }
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(
                    request.getPassword() != null ? request.getPassword() : "Driver@123"));
            user.setFullName(request.getFullName());
            user.setRole(User.Role.DRIVER);
            user.setPhone(request.getPhone());
            user.setCity(request.getCity());
            User savedUser = userService.createUser(user);

            return createDriverProfile(request, savedUser.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create driver: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> createDriverProfile(DriverCreateRequest request, String userId) {
        DriverProfile profile = new DriverProfile();
        profile.setUserId(userId);
        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setCity(request.getCity());
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setStatus("ACTIVE");
        return ResponseEntity.ok(driverService.createDriver(profile));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateDriver(@PathVariable String userId, @RequestBody Map<String, Object> updates) {
        return driverService.getDriverByUserId(userId)
                .map(profile -> {
                    if (updates.containsKey("status")) {
                        profile.setStatus(updates.get("status").toString().toUpperCase());
                    }
                    if (updates.containsKey("documents")) {
                        @SuppressWarnings("unchecked")
                        Map<String, String> docs = (Map<String, String>) updates.get("documents");
                        profile.setDocuments(docs);
                    }
                    if (updates.containsKey("licenseNumber")) {
                        profile.setLicenseNumber(updates.get("licenseNumber").toString());
                    }
                    if (updates.containsKey("avatarUrl")) {
                        profile.setAvatarUrl(updates.get("avatarUrl").toString());
                        // Also update User avatarUrl
                        userService.getUserById(userId).ifPresent(u -> {
                            u.setAvatarUrl(updates.get("avatarUrl").toString());
                            userService.updateUser(u);
                        });
                    }
                    return ResponseEntity.ok(driverService.updateDriver(profile));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteDriver(@PathVariable String userId) {
        return driverService.getDriverByUserId(userId)
                .map(profile -> {
                    driverService.deleteDriver(profile.getId());
                    return ResponseEntity.ok(Map.of("message", "Driver deleted"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    static class DriverCreateRequest {
        private String email;
        private String password;
        private String fullName;
        private String phone;
        private String city;
        private String licenseNumber;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getLicenseNumber() {
            return licenseNumber;
        }

        public void setLicenseNumber(String licenseNumber) {
            this.licenseNumber = licenseNumber;
        }
    }
}

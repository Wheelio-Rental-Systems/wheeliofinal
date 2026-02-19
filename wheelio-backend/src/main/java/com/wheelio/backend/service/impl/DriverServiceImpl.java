package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.DriverProfile;
import com.wheelio.backend.repository.DriverProfileRepository;
import com.wheelio.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverProfileRepository driverProfileRepository;
    private final com.wheelio.backend.repository.UserRepository userRepository;

    @Autowired
    public DriverServiceImpl(DriverProfileRepository driverProfileRepository,
            com.wheelio.backend.repository.UserRepository userRepository) {
        this.driverProfileRepository = driverProfileRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DriverProfile createDriverProfile(DriverProfile driverProfile) {
        System.out.println("DEBUG: createDriverProfile called. Input userId: " + driverProfile.getUserId());
        try {
            if (driverProfile.getUserId() != null) {
                com.wheelio.backend.model.User user = userRepository.findById(driverProfile.getUserId())
                        .orElseThrow(
                                () -> new RuntimeException("User not found with id: " + driverProfile.getUserId()));
                driverProfile.setUser(user);
                // Explicitly set the ID to satisfy Hibernate 'assigned' generator if needed
                // Although @MapsId should handle it, this ensures it's set.
                driverProfile.setUserId(user.getId());
                // Wait, if I set it, it might conflict if it's already set.
                // But let's print "Found User: " + user.getId()
                System.out.println("DEBUG: Found User: " + user.getId());
                System.out.println("DEBUG: Preparing to save DriverProfile: " + driverProfile);
                if (driverProfile.getDocuments() != null) {
                    System.out.println("DEBUG: Documents content: " + driverProfile.getDocuments());
                }
            } else {
                System.out.println("DEBUG: Input userId is NULL!");
            }
            DriverProfile savedProfile = driverProfileRepository.save(driverProfile);
            System.out.println("DEBUG: Successfully saved driver profile.");
            return savedProfile;
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save driver profile. Stack trace follows:");
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Optional<DriverProfile> getDriverProfileById(UUID userId) {
        return driverProfileRepository.findById(userId);
    }

    @Override
    public List<DriverProfile> getAllDriverProfiles() {
        return driverProfileRepository.findAll();
    }

    @Override
    public List<DriverProfile> getAvailableDrivers() {
        return driverProfileRepository.findByStatus(DriverProfile.DriverStatus.ACTIVE);
    }

    @Override
    public List<DriverProfile> getAvailableDriversByCity(String city) {
        if (city == null || city.isEmpty()) {
            return getAvailableDrivers();
        }
        return driverProfileRepository.findByUser_CityAndStatus(city, DriverProfile.DriverStatus.ACTIVE);
    }

    @Override
    public List<DriverProfile> getDriversByStatus(DriverProfile.DriverStatus status) {
        return driverProfileRepository.findByStatus(status);
    }

    @Override
    public DriverProfile updateDriverProfile(DriverProfile driverProfile) {
        return driverProfileRepository.save(driverProfile);
    }

    @Override
    public void deleteDriverProfile(UUID userId) {
        driverProfileRepository.deleteById(userId);
    }
}

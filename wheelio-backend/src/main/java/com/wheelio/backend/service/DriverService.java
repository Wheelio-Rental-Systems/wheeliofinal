package com.wheelio.backend.service;

import com.wheelio.backend.model.DriverProfile;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DriverService {
    DriverProfile createDriverProfile(DriverProfile driverProfile);

    Optional<DriverProfile> getDriverProfileById(UUID userId);

    List<DriverProfile> getAllDriverProfiles();

    List<DriverProfile> getAvailableDrivers();

    List<DriverProfile> getAvailableDriversByCity(String city);

    List<DriverProfile> getDriversByStatus(DriverProfile.DriverStatus status);

    DriverProfile updateDriverProfile(DriverProfile driverProfile);

    void deleteDriverProfile(UUID userId);
}

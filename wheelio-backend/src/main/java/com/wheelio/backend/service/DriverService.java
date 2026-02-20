package com.wheelio.backend.service;

import com.wheelio.backend.model.DriverProfile;
import java.util.List;
import java.util.Optional;

public interface DriverService {
    DriverProfile createDriver(DriverProfile profile);

    Optional<DriverProfile> getDriverByUserId(String userId);

    List<DriverProfile> getAllDrivers();

    List<DriverProfile> getAvailableDrivers();

    DriverProfile updateDriver(DriverProfile profile);

    void deleteDriver(String id);

    boolean existsByUserId(String userId);
}

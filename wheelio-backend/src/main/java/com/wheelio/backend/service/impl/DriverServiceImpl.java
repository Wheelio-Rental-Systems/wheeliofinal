package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.DriverProfile;
import com.wheelio.backend.repository.DriverProfileRepository;
import com.wheelio.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverProfileRepository driverProfileRepository;

    @Override
    public DriverProfile createDriver(DriverProfile profile) {
        return driverProfileRepository.save(profile);
    }

    @Override
    public Optional<DriverProfile> getDriverByUserId(String userId) {
        return driverProfileRepository.findByUserId(userId);
    }

    @Override
    public List<DriverProfile> getAllDrivers() {
        return driverProfileRepository.findAll();
    }

    @Override
    public List<DriverProfile> getAvailableDrivers() {
        return driverProfileRepository.findByStatus("ACTIVE");
    }

    @Override
    public DriverProfile updateDriver(DriverProfile profile) {
        return driverProfileRepository.save(profile);
    }

    @Override
    public void deleteDriver(String id) {
        driverProfileRepository.deleteById(id);
    }

    @Override
    public boolean existsByUserId(String userId) {
        return driverProfileRepository.existsByUserId(userId);
    }
}

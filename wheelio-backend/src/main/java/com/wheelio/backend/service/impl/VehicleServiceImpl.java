package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.Vehicle;
import com.wheelio.backend.repository.VehicleRepository;
import com.wheelio.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setCreatedAt(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Optional<Vehicle> getVehicleById(UUID id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(Vehicle.Status.AVAILABLE);
    }

    @Override
    public List<Vehicle> getVehiclesByType(Vehicle.VehicleType type) {
        return vehicleRepository.findByType(type);
    }

    @Override
    public List<Vehicle> getVehiclesByLocation(String location) {
        return vehicleRepository.findByLocation(location);
    }

    @Override
    public Vehicle updateVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(UUID id) {
        vehicleRepository.deleteById(id);
    }
}

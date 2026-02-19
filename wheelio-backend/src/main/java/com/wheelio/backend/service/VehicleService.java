package com.wheelio.backend.service;

import com.wheelio.backend.model.Vehicle;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleService {
    Vehicle createVehicle(Vehicle vehicle);

    Optional<Vehicle> getVehicleById(UUID id);

    List<Vehicle> getAllVehicles();

    List<Vehicle> getAvailableVehicles();

    List<Vehicle> getVehiclesByType(Vehicle.VehicleType type);

    List<Vehicle> getVehiclesByLocation(String location);

    Vehicle updateVehicle(Vehicle vehicle);

    void deleteVehicle(UUID id);
}

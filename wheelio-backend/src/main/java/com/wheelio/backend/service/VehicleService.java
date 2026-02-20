package com.wheelio.backend.service;

import com.wheelio.backend.model.Vehicle;
import java.util.List;
import java.util.Optional;

public interface VehicleService {
    Vehicle createVehicle(Vehicle vehicle);

    Optional<Vehicle> getVehicleById(String id);

    List<Vehicle> getAllVehicles();

    List<Vehicle> getAvailableVehicles();

    Vehicle updateVehicle(Vehicle vehicle);

    void deleteVehicle(String id);
}

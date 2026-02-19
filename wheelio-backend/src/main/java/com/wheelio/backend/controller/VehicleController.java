package com.wheelio.backend.controller;

import com.wheelio.backend.model.Vehicle;
import com.wheelio.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")

public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable UUID id) {
        return vehicleService.getVehicleById(id).orElse(null);
    }

    @GetMapping("/available")
    public List<Vehicle> getAvailableVehicles() {
        return vehicleService.getAvailableVehicles();
    }

    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.createVehicle(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable UUID id, @RequestBody Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleService.getVehicleById(id).orElse(null);
        if (vehicle != null) {
            vehicle.setName(vehicleDetails.getName());
            vehicle.setBrand(vehicleDetails.getBrand());
            vehicle.setType(vehicleDetails.getType());
            vehicle.setPricePerDay(vehicleDetails.getPricePerDay());
            vehicle.setLocation(vehicleDetails.getLocation());
            vehicle.setStatus(vehicleDetails.getStatus());
            vehicle.setImageUrl(vehicleDetails.getImageUrl());
            vehicle.setFeatures(vehicleDetails.getFeatures());
            vehicle.setDescription(vehicleDetails.getDescription());
            return vehicleService.updateVehicle(vehicle);
        }
        return null;
    }
}

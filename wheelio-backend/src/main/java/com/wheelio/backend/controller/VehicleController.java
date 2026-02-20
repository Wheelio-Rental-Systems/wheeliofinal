package com.wheelio.backend.controller;

import com.wheelio.backend.model.Vehicle;
import com.wheelio.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> getVehicleById(@PathVariable String id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
    public ResponseEntity<?> updateVehicle(@PathVariable String id, @RequestBody Vehicle vehicleDetails) {
        return vehicleService.getVehicleById(id)
                .map(vehicle -> {
                    vehicle.setName(vehicleDetails.getName());
                    vehicle.setBrand(vehicleDetails.getBrand());
                    vehicle.setType(vehicleDetails.getType());
                    vehicle.setPricePerDay(vehicleDetails.getPricePerDay());
                    vehicle.setLocation(vehicleDetails.getLocation());
                    vehicle.setStatus(vehicleDetails.getStatus());
                    vehicle.setImageUrl(vehicleDetails.getImageUrl());
                    vehicle.setFeatures(vehicleDetails.getFeatures());
                    vehicle.setDescription(vehicleDetails.getDescription());
                    return ResponseEntity.ok(vehicleService.updateVehicle(vehicle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return vehicleService.getVehicleById(id)
                .map(vehicle -> {
                    vehicle.setStatus(Vehicle.Status.valueOf(body.get("status").toUpperCase()));
                    return ResponseEntity.ok(vehicleService.updateVehicle(vehicle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable String id) {
        return vehicleService.getVehicleById(id)
                .map(v -> {
                    vehicleService.deleteVehicle(id);
                    return ResponseEntity.ok(Map.of("message", "Vehicle deleted"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

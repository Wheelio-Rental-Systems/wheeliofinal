package com.wheelio.backend.repository;

import com.wheelio.backend.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByStatus(Vehicle.Status status);

    List<Vehicle> findByLocation(String location);

    List<Vehicle> findByType(Vehicle.VehicleType type);
}

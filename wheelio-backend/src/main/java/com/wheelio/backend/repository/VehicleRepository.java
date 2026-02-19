package com.wheelio.backend.repository;

import com.wheelio.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findByLocation(String location);

    List<Vehicle> findByStatus(Vehicle.Status status);

    List<Vehicle> findByType(Vehicle.VehicleType type);

    List<Vehicle> findByName(String name);
}

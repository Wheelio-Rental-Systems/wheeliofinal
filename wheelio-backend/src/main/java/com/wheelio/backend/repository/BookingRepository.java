package com.wheelio.backend.repository;

import com.wheelio.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    List<Booking> findByVehicleId(String vehicleId);

    List<Booking> findByStatus(Booking.BookingStatus status);

    List<Booking> findByDriverId(String driverId);

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByDriverIdOrderByCreatedAtDesc(String driverId);
}

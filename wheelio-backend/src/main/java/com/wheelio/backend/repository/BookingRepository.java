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

    List<Booking> findByVehicleIdAndStatusIn(String vehicleId, List<Booking.BookingStatus> statuses);

    @org.springframework.data.mongodb.repository.Query("{ 'vehicleId': ?0, 'status': { '$in': ?3 }, '$or': [ { 'startDate': { '$lt': ?2 }, 'endDate': { '$gt': ?1 } } ] }")
    List<Booking> findOverlappingBookings(String vehicleId, java.time.LocalDateTime start, java.time.LocalDateTime end,
            List<Booking.BookingStatus> statuses);
}

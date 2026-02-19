package com.wheelio.backend.repository;

import com.wheelio.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserId(UUID userId);

    List<Booking> findByVehicleId(UUID vehicleId);

    List<Booking> findByStatus(Booking.BookingStatus status);

    List<Booking> findByDriverId(UUID driverId);
}

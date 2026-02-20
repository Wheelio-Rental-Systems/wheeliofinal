package com.wheelio.backend.service;

import com.wheelio.backend.model.Booking;
import java.util.List;
import java.util.Optional;

public interface BookingService {
    Booking createBooking(Booking booking);

    Optional<Booking> getBookingById(String id);

    List<Booking> getAllBookings();

    List<Booking> getBookingsByUserId(String userId);

    List<Booking> getBookingsByVehicleId(String vehicleId);

    List<Booking> getBookingsByDriverId(String driverId);

    Booking updateBooking(Booking booking);

    void deleteBooking(String id);
}

package com.wheelio.backend.service;

import com.wheelio.backend.model.Booking;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingService {
    Booking createBooking(Booking booking);

    Optional<Booking> getBookingById(UUID id);

    List<Booking> getAllBookings();

    List<Booking> getBookingsByUserId(UUID userId);

    List<Booking> getBookingsByVehicleId(UUID vehicleId);

    List<Booking> getBookingsByDriverId(UUID driverId);

    List<Booking> getBookingsByStatus(Booking.BookingStatus status);

    Booking updateBooking(Booking booking);

    void deleteBooking(UUID id);
}

package com.wheelio.backend.service.impl;

import com.wheelio.backend.model.Booking;
import com.wheelio.backend.repository.BookingRepository;
import com.wheelio.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Booking> getBookingsByVehicleId(String vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }

    @Override
    public List<Booking> getBookingsByDriverId(String driverId) {
        return bookingRepository.findByDriverIdOrderByCreatedAtDesc(driverId);
    }

    @Override
    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public boolean isVehicleAvailable(String vehicleId, java.time.LocalDateTime start, java.time.LocalDateTime end) {
        List<Booking.BookingStatus> activeStatuses = List.of(Booking.BookingStatus.PENDING,
                Booking.BookingStatus.CONFIRMED);
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(vehicleId, start, end, activeStatuses);
        return overlaps.isEmpty();
    }
}

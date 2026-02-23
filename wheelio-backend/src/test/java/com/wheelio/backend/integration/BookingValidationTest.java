package com.wheelio.backend.integration;

import com.wheelio.backend.model.Booking;
import com.wheelio.backend.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class BookingValidationTest {

    @Autowired
    private BookingService bookingService;

    @Test
    public void testOverlappingBooking() {
        String vehicleId = "test-vehicle-1";
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusDays(2);

        // Create initial booking
        Booking booking = new Booking();
        booking.setVehicleId(vehicleId);
        booking.setStartDate(start);
        booking.setEndDate(end);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingService.createBooking(booking);

        // Check availability for same period
        assertFalse(bookingService.isVehicleAvailable(vehicleId, start, end));

        // Check availability for overlapping period (starts during)
        assertFalse(bookingService.isVehicleAvailable(vehicleId, start.plusHours(1), end.plusHours(1)));

        // Check availability for overlapping period (ends during)
        assertFalse(bookingService.isVehicleAvailable(vehicleId, start.minusHours(1), end.minusHours(1)));

        // Check availability for completely overlapping period (inside)
        assertFalse(bookingService.isVehicleAvailable(vehicleId, start.plusMinutes(1), end.minusMinutes(1)));

        // Check availability for adjacent period (after)
        assertTrue(bookingService.isVehicleAvailable(vehicleId, end.plusSeconds(1), end.plusDays(1)));

        // Check availability for adjacent period (before)
        assertTrue(bookingService.isVehicleAvailable(vehicleId, start.minusDays(1), start.minusSeconds(1)));
    }
}

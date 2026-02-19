package com.wheelio.backend.controller;

import com.wheelio.backend.model.Booking;
import com.wheelio.backend.service.BookingService;
import com.wheelio.backend.service.UserService;
import com.wheelio.backend.service.VehicleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable UUID id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable UUID userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<Booking> getBookingsByVehicle(@PathVariable UUID vehicleId) {
        return bookingService.getBookingsByVehicleId(vehicleId);
    }

    @GetMapping("/driver/{driverId}")
    public List<Booking> getBookingsByDriver(@PathVariable UUID driverId) {
        return bookingService.getBookingsByDriverId(driverId);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            logger.info("Booking request received for userId={}, vehicleId={}", request.getUserId(),
                    request.getVehicleId());

            Booking booking = new Booking();

            // Look up user - required
            var userOpt = userService.getUserById(request.getUserId());
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found with ID: " + request.getUserId());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            booking.setUser(userOpt.get());

            // Look up vehicle - required
            var vehicleOpt = vehicleService.getVehicleById(request.getVehicleId());
            if (vehicleOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Vehicle not found with ID: " + request.getVehicleId());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            booking.setVehicle(vehicleOpt.get());

            // Look up driver - OPTIONAL: if not found, just set null (self-drive mode)
            if (request.getDriverId() != null) {
                booking.setDriver(userService.getUserById(request.getDriverId()).orElse(null));
            }

            // Parse dates - handle multiple formats including missing seconds
            booking.setStartDate(parseFlexibleDate(request.getStartDate()));
            booking.setEndDate(parseFlexibleDate(request.getEndDate()));

            booking.setTotalAmount(request.getTotalAmount());
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);

            Booking savedBooking = bookingService.createBooking(booking);
            logger.info("Booking created successfully: {}", savedBooking.getId());
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            logger.error("Booking creation failed: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Flexibly parse date strings from the frontend.
     * Handles: "2026-02-20T10:00:00", "2026-02-20T10:00",
     * "2026-02-20T10:00:00.000Z"
     */
    private LocalDateTime parseFlexibleDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return LocalDateTime.now();
        }
        // Remove trailing Z (UTC indicator) since we treat as local
        dateStr = dateStr.replace("Z", "");

        try {
            return LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e1) {
            // Try without seconds
            try {
                return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
            } catch (DateTimeParseException e2) {
                // Try just date
                try {
                    return LocalDateTime.parse(dateStr + "T00:00:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (DateTimeParseException e3) {
                    System.err.println("Could not parse date: " + dateStr + ", using current time");
                    return LocalDateTime.now();
                }
            }
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        return bookingService.getBookingById(id)
                .map(booking -> {
                    if (request.containsKey("bookingStatus")) {
                        booking.setStatus(Booking.BookingStatus.valueOf(request.get("bookingStatus")));
                    }
                    if (request.containsKey("paymentStatus")) {
                        booking.setPaymentStatus(Booking.PaymentStatus.valueOf(request.get("paymentStatus")));
                    }
                    return ResponseEntity.ok(bookingService.updateBooking(booking));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable UUID id) {
        return bookingService.getBookingById(id)
                .map(booking -> {
                    booking.setStatus(Booking.BookingStatus.CANCELLED);
                    bookingService.updateBooking(booking);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Booking cancelled successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Request DTO - accepts String dates for maximum flexibility
    static class BookingRequest {
        private UUID userId;
        private UUID vehicleId;
        private UUID driverId;
        private String startDate;
        private String endDate;
        private BigDecimal totalAmount;

        // Getters and setters
        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public UUID getVehicleId() {
            return vehicleId;
        }

        public void setVehicleId(UUID vehicleId) {
            this.vehicleId = vehicleId;
        }

        public UUID getDriverId() {
            return driverId;
        }

        public void setDriverId(UUID driverId) {
            this.driverId = driverId;
        }

        public String getStartDate() {
            return startDate;
        }

        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }

        public String getEndDate() {
            return endDate;
        }

        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }
    }
}

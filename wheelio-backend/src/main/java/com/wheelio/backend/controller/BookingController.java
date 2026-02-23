package com.wheelio.backend.controller;

import com.wheelio.backend.model.Booking;
import com.wheelio.backend.model.Vehicle;
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
import java.util.List;
import java.util.Map;

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

    @Autowired
    private com.wheelio.backend.service.EmailService emailService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable String userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<Booking> getBookingsByVehicle(@PathVariable String vehicleId) {
        return bookingService.getBookingsByVehicleId(vehicleId);
    }

    @GetMapping("/driver/{driverId}")
    public List<Booking> getBookingsByDriver(@PathVariable String driverId) {
        return bookingService.getBookingsByDriverId(driverId);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            logger.info("Booking request: userId={}, vehicleId={}", request.getUserId(), request.getVehicleId());

            // Validate user exists
            var userOpt = userService.getUserById(request.getUserId());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "User not found: " + request.getUserId()));
            }

            // Validate vehicle exists
            var vehicleOpt = vehicleService.getVehicleById(request.getVehicleId());
            if (vehicleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Vehicle not found: " + request.getVehicleId()));
            }

            Vehicle vehicle = vehicleOpt.get();
            var user = userOpt.get();

            LocalDateTime startTime = parseFlexibleDate(request.getStartDate());
            LocalDateTime endTime = parseFlexibleDate(request.getEndDate());

            // Validate vehicle availability
            if (!bookingService.isVehicleAvailable(request.getVehicleId(), startTime, endTime)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Vehicle is already booked for the selected period."));
            }

            Booking booking = new Booking();
            booking.setUserId(request.getUserId());
            booking.setUserName(user.getFullName());
            booking.setVehicleId(request.getVehicleId());

            // Build denormalized vehicle snapshot
            Booking.VehicleSummary summary = new Booking.VehicleSummary(
                    vehicle.getId(), vehicle.getName(), vehicle.getBrand(),
                    vehicle.getType() != null ? vehicle.getType().name() : "",
                    vehicle.getImageUrl(), vehicle.getPricePerDay(), vehicle.getLocation());
            booking.setVehicleSummary(summary);

            if (request.getDriverId() != null && !request.getDriverId().isEmpty()) {
                booking.setDriverId(request.getDriverId());
            }

            booking.setStartDate(startTime);
            booking.setEndDate(endTime);
            booking.setTotalAmount(request.getTotalAmount());
            booking.setPickupLocation(request.getPickupLocation());
            booking.setDropLocation(request.getDropLocation());
            booking.setContactPhone(request.getContactPhone());
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setCreatedAt(LocalDateTime.now());

            Booking saved = bookingService.createBooking(booking);
            logger.info("Booking created: {}", saved.getId());

            // Update Vehicle Status to BOOKED
            vehicle.setStatus(Vehicle.Status.BOOKED);
            vehicleService.updateVehicle(vehicle);

            // Send Confirmation Email
            try {
                String emailBody = com.wheelio.backend.util.EmailTemplates
                        .getBookingConfirmationEmail(user.getFullName(), saved);
                emailService.sendHtmlEmail(user.getEmail(), "Wheelio - Booking Confirmed #" + saved.getId(), emailBody);
            } catch (Exception mailErr) {
                logger.error("Failed to send booking confirmation email: {}", mailErr.getMessage());
            }

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            logger.error("Booking creation failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to create booking: " + e.getMessage()));
        }
    }

    private LocalDateTime parseFlexibleDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty())
            return LocalDateTime.now();
        dateStr = dateStr.replace("Z", "");
        try {
            return LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e1) {
            try {
                return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
            } catch (DateTimeParseException e2) {
                try {
                    return LocalDateTime.parse(dateStr + "T00:00:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                } catch (DateTimeParseException e3) {
                    return LocalDateTime.now();
                }
            }
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return bookingService.getBookingById(id)
                .map(booking -> {
                    if (request.containsKey("bookingStatus")) {
                        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(request.get("bookingStatus"));
                        booking.setStatus(newStatus);

                        // If booking is COMPLETED or CANCELLED, make vehicle AVAILABLE again
                        if (newStatus == Booking.BookingStatus.COMPLETED
                                || newStatus == Booking.BookingStatus.CANCELLED) {
                            vehicleService.getVehicleById(booking.getVehicleId()).ifPresent(v -> {
                                v.setStatus(Vehicle.Status.AVAILABLE);
                                vehicleService.updateVehicle(v);
                            });
                        }
                    }
                    if (request.containsKey("paymentStatus")) {
                        booking.setPaymentStatus(Booking.PaymentStatus.valueOf(request.get("paymentStatus")));
                    }
                    return ResponseEntity.ok(bookingService.updateBooking(booking));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(booking -> {
                    booking.setStatus(Booking.BookingStatus.CANCELLED);
                    bookingService.updateBooking(booking);

                    // Make vehicle AVAILABLE again
                    vehicleService.getVehicleById(booking.getVehicleId()).ifPresent(v -> {
                        v.setStatus(Vehicle.Status.AVAILABLE);
                        vehicleService.updateVehicle(v);
                    });

                    return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vehicle/{vehicleId}/booked-dates")
    public List<Map<String, Object>> getBookedDatesByVehicle(@PathVariable String vehicleId) {
        List<Booking.BookingStatus> activeStatuses = List.of(Booking.BookingStatus.PENDING,
                Booking.BookingStatus.CONFIRMED);
        List<Booking> activeBookings = bookingService.getBookingsByVehicleId(vehicleId).stream()
                .filter(b -> activeStatuses.contains(b.getStatus()))
                .toList();

        return activeBookings.stream()
                .map(b -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("startDate", b.getStartDate());
                    map.put("endDate", b.getEndDate());
                    map.put("status", b.getStatus());
                    return map;
                })
                .toList();
    }

    // DTO
    static class BookingRequest {
        private String userId;
        private String vehicleId;
        private String driverId;
        private String startDate;
        private String endDate;
        private BigDecimal totalAmount;
        private String pickupLocation;
        private String dropLocation;
        private String contactPhone;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getVehicleId() {
            return vehicleId;
        }

        public void setVehicleId(String vehicleId) {
            this.vehicleId = vehicleId;
        }

        public String getDriverId() {
            return driverId;
        }

        public void setDriverId(String driverId) {
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

        public String getPickupLocation() {
            return pickupLocation;
        }

        public void setPickupLocation(String pickupLocation) {
            this.pickupLocation = pickupLocation;
        }

        public String getDropLocation() {
            return dropLocation;
        }

        public void setDropLocation(String dropLocation) {
            this.dropLocation = dropLocation;
        }

        public String getContactPhone() {
            return contactPhone;
        }

        public void setContactPhone(String contactPhone) {
            this.contactPhone = contactPhone;
        }
    }
}

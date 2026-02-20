package com.wheelio.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String vehicleId;

    private String driverId;

    // Denormalized snapshot for display (vehicle name, image, etc.)
    private VehicleSummary vehicleSummary;

    // Denormalized user name for display
    private String userName;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private BigDecimal totalAmount;

    private BookingStatus status = BookingStatus.PENDING;

    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String pickupLocation;
    private String dropLocation;
    private String contactPhone;

    private LocalDateTime createdAt;

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED
    }

    public enum PaymentStatus {
        PENDING, PAID, REFUNDED
    }

    /** Embedded snapshot so bookings can display vehicle info without a join */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleSummary {
        private String vehicleId;
        private String name;
        private String brand;
        private String type;
        private String imageUrl;
        private BigDecimal pricePerDay;
        private String location;
    }
}

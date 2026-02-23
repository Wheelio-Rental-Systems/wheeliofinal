package com.wheelio.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    private String id;

    private String name;

    private String brand;

    private VehicleType type;

    private BigDecimal pricePerDay;
    private String location;
    private Status status = Status.AVAILABLE;
    private String imageUrl;
    private List<String> features;
    private String description;

    // Additional fields for frontend compatibility
    private Integer seats;
    private String fuelType;
    private String transmission;
    private Double rating;
    private Integer reviews;
    private java.util.Map<String, String> details;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum VehicleType {
        SUV, SEDAN, BIKE, HATCHBACK, MPV, SCOOTER, CAR
    }

    public enum Status {
        AVAILABLE, BOOKED, MAINTENANCE
    }
}

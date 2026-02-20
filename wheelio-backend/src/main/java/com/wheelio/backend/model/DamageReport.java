package com.wheelio.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "damage_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DamageReport {

    @Id
    private String id;

    @Indexed
    private String vehicleId;

    private String vehicleName;

    @Indexed
    private String reportedById;

    private String reportedByName;

    private String description;

    private List<String> images;

    private Severity severity;

    private DamageStatus status = DamageStatus.OPEN;

    private BigDecimal estimatedCost;

    private String razorpayPaymentId;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum DamageStatus {
        OPEN, INVESTIGATING, ESTIMATED, RESOLVED, PAID
    }
}

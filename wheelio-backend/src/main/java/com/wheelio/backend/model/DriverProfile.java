package com.wheelio.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "driver_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String avatarUrl;

    @Indexed(unique = true)
    private String licenseNumber;

    private BigDecimal rating = new BigDecimal("5.00");

    private String status = "ACTIVE";

    private Map<String, String> documents = new HashMap<>();
}

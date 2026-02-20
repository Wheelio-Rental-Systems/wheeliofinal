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

@Document(collection = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    private String id;

    @Indexed
    private String bookingId;

    @Indexed(unique = true)
    private String razorpayPaymentId;

    private String razorpayOrderId;

    private String razorpaySignature;

    private BigDecimal amount;

    private String method;

    private String status = "SUCCESS";

    @CreatedDate
    private LocalDateTime createdAt;
}

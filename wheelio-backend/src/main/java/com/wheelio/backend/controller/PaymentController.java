package com.wheelio.backend.controller;

import com.wheelio.backend.model.Payment;
import com.wheelio.backend.service.BookingService;
import com.wheelio.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")

public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBooking(@PathVariable UUID bookingId) {
        return paymentService.getPaymentsByBookingId(bookingId);
    }

    @PostMapping
    public ResponseEntity<?> recordPayment(@RequestBody PaymentRequest request) {
        try {
            Payment payment = new Payment();
            payment.setBooking(bookingService.getBookingById(request.getBookingId()).orElseThrow());
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpayOrderId(request.getRazorpayOrderId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setAmount(request.getAmount());
            payment.setMethod(request.getMethod());
            payment.setStatus(request.getStatus() != null ? request.getStatus() : "SUCCESS");

            Payment savedPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to record payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        // Simple verification - in production, verify Razorpay signature
        String razorpayPaymentId = request.get("razorpayPaymentId");

        return paymentService.getPaymentByRazorpayPaymentId(razorpayPaymentId)
                .map(payment -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("verified", true);
                    response.put("payment", payment);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Request DTO
    static class PaymentRequest {
        private UUID bookingId;
        private String razorpayPaymentId;
        private String razorpayOrderId;
        private String razorpaySignature;
        private java.math.BigDecimal amount;
        private String method;
        private String status;

        // Getters and setters
        public UUID getBookingId() {
            return bookingId;
        }

        public void setBookingId(UUID bookingId) {
            this.bookingId = bookingId;
        }

        public String getRazorpayPaymentId() {
            return razorpayPaymentId;
        }

        public void setRazorpayPaymentId(String razorpayPaymentId) {
            this.razorpayPaymentId = razorpayPaymentId;
        }

        public String getRazorpayOrderId() {
            return razorpayOrderId;
        }

        public void setRazorpayOrderId(String razorpayOrderId) {
            this.razorpayOrderId = razorpayOrderId;
        }

        public String getRazorpaySignature() {
            return razorpaySignature;
        }

        public void setRazorpaySignature(String razorpaySignature) {
            this.razorpaySignature = razorpaySignature;
        }

        public java.math.BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(java.math.BigDecimal amount) {
            this.amount = amount;
        }

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}

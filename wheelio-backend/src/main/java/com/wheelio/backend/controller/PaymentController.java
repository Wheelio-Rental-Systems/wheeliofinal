package com.wheelio.backend.controller;

import com.wheelio.backend.model.Payment;
import com.wheelio.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody Payment payment) {
        try {
            Payment saved = paymentService.createPayment(payment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> getByBooking(@PathVariable String bookingId) {
        return paymentService.getPaymentsByBookingId(bookingId);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {
        String razorpayPaymentId = body.get("razorpayPaymentId");
        return paymentService.getPaymentByRazorpayId(razorpayPaymentId)
                .map(p -> ResponseEntity.ok(Map.of("verified", true, "payment", p)))
                .orElse(ResponseEntity.ok(Map.of("verified", false)));
    }
}

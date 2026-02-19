package com.wheelio.backend.service;

import com.wheelio.backend.model.Payment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentService {
    Payment createPayment(Payment payment);

    Optional<Payment> getPaymentById(UUID id);

    List<Payment> getAllPayments();

    List<Payment> getPaymentsByBookingId(UUID bookingId);

    Optional<Payment> getPaymentByRazorpayPaymentId(String razorpayPaymentId);

    Payment updatePayment(Payment payment);

    boolean verifyRazorpaySignature(String orderId, String paymentId, String signature);
}

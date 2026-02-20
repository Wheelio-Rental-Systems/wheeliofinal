package com.wheelio.backend.service;

import com.wheelio.backend.model.Payment;
import java.util.List;
import java.util.Optional;

public interface PaymentService {
    Payment createPayment(Payment payment);

    Optional<Payment> getPaymentById(String id);

    List<Payment> getPaymentsByBookingId(String bookingId);

    Optional<Payment> getPaymentByRazorpayId(String razorpayPaymentId);
}

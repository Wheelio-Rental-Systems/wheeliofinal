package com.wheelio.backend.repository;

import com.wheelio.backend.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
}

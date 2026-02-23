package com.wheelio.backend.util;

import com.wheelio.backend.model.Booking;
import java.time.format.DateTimeFormatter;

public class EmailTemplates {

    private static final String PRIMARY_COLOR = "#7c3aed";
    private static final String SECONDARY_COLOR = "#ec4899";

    public static String getForgotPasswordEmail(String name, String resetLink) {
        return "<html><body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">"
                +
                "<h2 style=\"color: " + PRIMARY_COLOR + ";\">Reset Your Password</h2>" +
                "<p>Hi " + name + ",</p>" +
                "<p>We received a request to reset your password for your Wheelio account. Click the button below to set a new password:</p>"
                +
                "<div style=\"text-align: center; margin: 30px 0;\">" +
                "<a href=\"" + resetLink + "\" style=\"background: linear-gradient(to right, " + PRIMARY_COLOR + ", "
                + SECONDARY_COLOR
                + "); color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Reset Password</a>"
                +
                "</div>" +
                "<p>If you didn't request this, you can safely ignore this email. This link will expire in 24 hours.</p>"
                +
                "<hr style=\"border: none; border-top: 1px solid #eee; margin: 20px 0;\">" +
                "<p style=\"font-size: 12px; color: #888;\">Wheelio Car Rentals - Drive Your Dreams</p>" +
                "</div></body></html>";
    }

    public static String getBookingConfirmationEmail(String name, Booking booking) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        return "<html><body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">"
                +
                "<h2 style=\"color: #10b981;\">Booking Confirmed!</h2>" +
                "<p>Hi " + name + ",</p>" +
                "<p>Your booking for <strong>" + booking.getVehicleSummary().getName()
                + "</strong> has been confirmed. Get ready for your trip!</p>" +

                "<div style=\"background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;\">" +
                "<h3 style=\"margin-top: 0; color: " + PRIMARY_COLOR
                + "; border-bottom: 2px solid #eee; padding-bottom: 5px;\">Trip Details</h3>" +
                "<table style=\"width: 100%; border-collapse: collapse;\">" +
                "<tr><td style=\"padding: 5px 0;\"><strong>Booking ID:</strong></td><td>#" + booking.getId()
                + "</td></tr>" +
                "<tr><td style=\"padding: 5px 0;\"><strong>Start:</strong></td><td>"
                + booking.getStartDate().format(formatter) + "</td></tr>" +
                "<tr><td style=\"padding: 5px 0;\"><strong>End:</strong></td><td>"
                + booking.getEndDate().format(formatter) + "</td></tr>" +
                "<tr><td style=\"padding: 5px 0;\"><strong>Pickup:</strong></td><td>" + booking.getPickupLocation()
                + "</td></tr>" +
                "</table>" +
                "</div>" +

                "<div style=\"background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 8px; margin: 20px 0;\">"
                +
                "<h3 style=\"margin-top: 0; color: " + SECONDARY_COLOR + ";\">Invoice Summary</h3>" +
                "<table style=\"width: 100%; border-collapse: collapse;\">" +
                "<tr><td style=\"padding: 5px 0;\">Rental Amount:</td><td style=\"text-align: right;\">₹"
                + booking.getTotalAmount() + "</td></tr>" +
                "<tr style=\"font-weight: bold; border-top: 2px solid #eee;\">" +
                "<td style=\"padding: 10px 0;\">Total Paid:</td><td style=\"text-align: right; color: #10b981;\">₹"
                + booking.getTotalAmount() + "</td></tr>" +
                "</table>" +
                "</div>" +

                "<p>If you have any questions, feel free to contact our 24/7 support.</p>" +
                "<hr style=\"border: none; border-top: 1px solid #eee; margin: 20px 0;\">" +
                "<p style=\"font-size: 12px; color: #888;\">Wheelio Car Rentals - Drive Your Dreams</p>" +
                "</div></body></html>";
    }

    // Fixed typo in variable name in my thought, using SECONDARY_COLOR instead of
    // SECOND_COLOR_PLACEHOLDER
}

package com.Anjali.ECommerce.Service;

public interface EmailService {

    void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text);
}

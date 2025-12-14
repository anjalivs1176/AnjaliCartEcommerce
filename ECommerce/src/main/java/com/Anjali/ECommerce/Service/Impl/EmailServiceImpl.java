package com.Anjali.ECommerce.Service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Anjali.ECommerce.Service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${mail.from}")
    private String from;

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    @Override
    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> body = new HashMap<>();
            Map<String, String> sender = new HashMap<>();
            sender.put("email", from);

            body.put("sender", sender);
            body.put("to", new Object[]{Map.of("email", userEmail)});
            body.put("subject", subject);
            body.put("htmlContent", "<p>" + text + "</p><h3>Your OTP: " + otp + "</h3>");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    BREVO_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            System.out.println("Email sent via Brevo API → " + response.getStatusCode());

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email using Brevo API", e);
        }
    }
}

package com.Anjali.ECommerce.Controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.VerificationCode;
import com.Anjali.ECommerce.Repository.VerificationCodeRepository;
import com.Anjali.ECommerce.Request.LoginRequest;
import com.Anjali.ECommerce.Service.AuthService;
import com.Anjali.ECommerce.Service.EmailService;
import com.Anjali.ECommerce.Service.SellerReportService;
import com.Anjali.ECommerce.Service.SellerService;
import com.Anjali.ECommerce.response.AuthResponse;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller")
@Slf4j
public class SellerController {

    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final AuthService authService;
    private final EmailService emailService;
    private final SellerReportService sellerReportService;

    @Value("${frontend.url}")
    private String frontendUrl;

    // ---------------------- LOGIN --------------------------
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(@RequestBody LoginRequest req) throws Exception {
        AuthResponse response = authService.loginSeller(req);
        return ResponseEntity.ok(response);
    }

    // ---------------------- SIGNUP --------------------------
    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller)
            throws Exception, MessagingException {

        Seller savedSeller = sellerService.createSeller(seller);

        // Generate OTP
        String otp = com.Anjali.ECommerce.utils.OtpUtil.generateOtp();

        // Save OTP
        VerificationCode vc = new VerificationCode();
        vc.setEmail(savedSeller.getEmail());
        vc.setOtp(otp);
        verificationCodeRepository.save(vc);

        // Encode email for URL
        String encodedEmail = URLEncoder.encode(savedSeller.getEmail(), StandardCharsets.UTF_8);

        // ✅ Production-safe frontend URL
        String verifyUrl = frontendUrl + "/verify-seller/" + encodedEmail + "/" + otp;

        String subject = "AnjaliCart Seller Email Verification";
        String text = "Welcome to AnjaliCart!\n\n"
                + "Your OTP: " + otp + "\n\n"
                + "Verify your email here:\n" + verifyUrl;

        emailService.sendVerificationOtpEmail(savedSeller.getEmail(), otp, subject, text);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedSeller);
    }

    // ---------------------- VERIFY EMAIL --------------------------
    @Transactional
    @PatchMapping("/verify/{email}/{otp}")
    public ResponseEntity<?> verifySellerMail(
            @PathVariable String email,
            @PathVariable String otp) {

        try {
            log.info("Verifying seller email={} otp={}", email, otp);

            var codes = verificationCodeRepository.findByEmail(email);

            if (codes == null || codes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No OTP found for this email"));
            }

            // Use latest OTP
            VerificationCode code = codes.get(codes.size() - 1);

            if (!otp.equals(code.getOtp())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid OTP"));
            }

            Seller seller = sellerService.getSellerByEmail(email);
            if (seller == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Seller not found"));
            }

            // Activate account
            seller.setEmailVerified(true);
            seller.setAccountStatus(AccountStatus.ACTIVE);

            // Clean OTPs
            verificationCodeRepository.deleteByEmail(email);

            return ResponseEntity.ok(Map.of(
                    "message", "Email verified successfully",
                    "sellerId", seller.getId()
            ));

        } catch (Exception e) {
            log.error("Seller email verification failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error while verifying email"));
        }
    }

    // ---------------------- PROFILE --------------------------
    @GetMapping("/profile")
    public ResponseEntity<Seller> getSellerByJwt(
            @RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        return ResponseEntity.ok(seller);
    }

    @PatchMapping("/profile/update")
    public ResponseEntity<Seller> updateSellerProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Seller updateData) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);
        Seller updated = sellerService.updateSeller(seller.getId(), updateData);
        return ResponseEntity.ok(updated);
    }
}

package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Model.VerificationCode;
import com.Anjali.ECommerce.Repository.UserRepository;
import com.Anjali.ECommerce.Request.LoginOtpRequest;
import com.Anjali.ECommerce.Request.LoginRequest;
import com.Anjali.ECommerce.Service.AuthService;
import com.Anjali.ECommerce.response.ApiResponse;
import com.Anjali.ECommerce.response.AuthResponse;
import com.Anjali.ECommerce.response.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest req) throws Exception {

        String jwt = authService.createUser(req);

        AuthResponse res = new AuthResponse();

        res.setJwt(jwt);

        res.setMessage("Register Success");

        res.setRole(USER_ROLE.ROLE_CUSTOMER);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/send/login-signup-otp")
    public ResponseEntity<ApiResponse> sendOtpHandler(@RequestBody LoginOtpRequest req) throws Exception {

        String jwt = authService.sendLoginAndSignupOtp(req.getEmail(), req.getRole());

        ApiResponse res = new ApiResponse();
        res.setMessage("OTP sent successfully");

        return ResponseEntity.ok(res);
    }

    @PostMapping("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {

        AuthResponse authResponse = authService.signing(req);
        return ResponseEntity.ok(authResponse);
    }

}

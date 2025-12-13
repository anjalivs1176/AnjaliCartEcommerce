package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import com.Anjali.ECommerce.Request.LoginRequest;
import com.Anjali.ECommerce.response.AuthResponse;
import com.Anjali.ECommerce.response.SignupRequest;

public interface AuthService {

    AuthResponse loginSeller(LoginRequest req) throws Exception;


    String sendLoginAndSignupOtp(String email, USER_ROLE role) throws Exception;
    String createUser(SignupRequest request) throws Exception;
    AuthResponse signing(LoginRequest req);
}

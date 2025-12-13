package com.Anjali.ECommerce.response;

import lombok.Data;

@Data
public class SignupRequest {

    private String email;
    private String name;
    private String otp;
    private  String mobile;
}

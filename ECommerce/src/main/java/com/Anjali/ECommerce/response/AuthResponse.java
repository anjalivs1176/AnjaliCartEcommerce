package com.Anjali.ECommerce.response;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;

    private String message;

    private USER_ROLE role;

    private String name;
}

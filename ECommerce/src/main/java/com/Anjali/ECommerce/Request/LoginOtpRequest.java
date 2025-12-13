package com.Anjali.ECommerce.Request;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import lombok.Data;
import com.Anjali.ECommerce.Domain.USER_ROLE;

@Data
public class LoginOtpRequest {

    private String email;
    private USER_ROLE role;
}

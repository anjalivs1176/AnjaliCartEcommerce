package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ApiResponse HomeControllerHandler(){

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Welcome to AnjaliCart ");
        return apiResponse;
    }
}

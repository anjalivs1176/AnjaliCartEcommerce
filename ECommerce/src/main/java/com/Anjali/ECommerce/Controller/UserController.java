package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Endpoint to get the profile of the logged-in user
    @GetMapping("/users/profile")
    public ResponseEntity<User> createUserHandler(
            @RequestHeader("Authorization") String jwt // JWT token from request header
    ) throws Exception {

        // Fetch the user associated with the JWT token
        User user = userService.findUserByJwtToken(jwt);

        // Return the user object with HTTP 200 OK
        return ResponseEntity.ok(user);
    }
}

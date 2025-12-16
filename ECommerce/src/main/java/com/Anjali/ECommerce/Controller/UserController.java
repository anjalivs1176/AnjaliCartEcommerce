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
@RequestMapping("/api/user")   
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")    
    public ResponseEntity<User> getProfile(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        return ResponseEntity.ok(user);
    }
}

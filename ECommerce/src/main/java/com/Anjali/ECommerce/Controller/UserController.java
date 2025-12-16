package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ Get logged-in user profile (NO JWT HERE)
    @GetMapping("/users/profile")
    public ResponseEntity<User> getUserProfile() throws Exception {

        // 🔐 Get authenticated user from SecurityContext
        Authentication authentication
                = SecurityContextHolder.getContext().getAuthentication();

        // JWT subject (email)
        String email = authentication.getName();

        // Fetch user by email
        User user = userService.findUserByEmail(email);

        return ResponseEntity.ok(user);
    }
}

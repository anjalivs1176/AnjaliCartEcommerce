package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.UserRepository;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.config.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    // Find a user using their JWT token
    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        // Extract email from JWT
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        // Fetch user by email
        return this.findUserByEmail(email);
    }

    // Find a user by their email
    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Throw exception if user not found
            throw new Exception("User not found with email " + email);
        }
        return user;
    }


    @Override
public User saveUser(User user) {
    return userRepository.save(user);
}

}

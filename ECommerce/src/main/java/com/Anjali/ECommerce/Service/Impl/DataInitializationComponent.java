package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "anjalivs.dev@gmail.com";

        if(userRepository.findByEmail(adminUsername)==null){
            User adminUser = new User();

            adminUser.setPassword(passwordEncoder.encode("codewithanjali"));
            adminUser.setEmail(adminUsername);
            adminUser.setRole(USER_ROLE.ROLE_ADMIN);
            adminUser.setName("Anjali");

            userRepository.save(adminUser);
        }
    }
}

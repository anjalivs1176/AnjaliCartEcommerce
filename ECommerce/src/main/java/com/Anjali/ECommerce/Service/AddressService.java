package com.Anjali.ECommerce.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Model.Address;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final UserRepository userRepository;

    // Save address through User
    public Address addAddress(User user, Address address) {

        if (user.getAddresses() == null) {
            user.setAddresses(new java.util.HashSet<>());
        }

        user.getAddresses().add(address);
        userRepository.save(user); // Embedded addresses saved automatically

        return address;
    }

    public List<Address> getUserAddresses(User user) {
        if (user.getAddresses() == null) {
            return java.util.Collections.emptyList();
        }
        return user.getAddresses().stream().toList();
    }
}

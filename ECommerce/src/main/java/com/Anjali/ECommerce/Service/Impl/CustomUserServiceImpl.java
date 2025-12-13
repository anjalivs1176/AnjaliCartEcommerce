package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Domain.USER_ROLE;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.SellerRepository;
import com.Anjali.ECommerce.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomUserServiceImpl implements UserDetailsService {

    // Repository to fetch user data
    private final UserRepository userRepository;

    // Repository to fetch seller data
    private final SellerRepository sellerRepository;

    // Prefix to distinguish seller login from regular user login
    private static final String SELLER_PREFIX = "seller_";

    /**
     * Load user details for Spring Security authentication.
     * Checks if the username belongs to a seller or customer.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.startsWith(SELLER_PREFIX)) {
            // Extract actual seller email
            String actualUsername = username.substring(SELLER_PREFIX.length());
            Seller seller = sellerRepository.findByEmail(actualUsername);

            if(seller != null){
                // Build UserDetails object for Spring Security
                return buildUserDetails(seller.getEmail(), seller.getPassword(), seller.getRole());
            }
        } else {
            // Load regular user
            User user = userRepository.findByEmail(username);
            if (user != null) {
                return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
            }
        }

        // Throw exception if user or seller not found
        throw new UsernameNotFoundException("user or seller not found with email - " + username);
    }

    /**
     * Helper method to build Spring Security UserDetails object.
     * Assigns roles as authorities.
     */
    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        if (role == null) role = USER_ROLE.ROLE_CUSTOMER;

        List<GrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(role.toString()));

        return new org.springframework.security.core.userdetails.User(email, password, authorityList);
    }
}

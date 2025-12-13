package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Address;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Service.AddressService;
import com.Anjali.ECommerce.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;
    private final UserService userService;

    // Add address for logged-in user
    @PostMapping
    public ResponseEntity<Address> addAddress(
            @RequestBody Address address,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Address saved = addressService.addAddress(user, address);
        return ResponseEntity.ok(saved);
    }

    // Get all addresses for logged-in user
    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Address> list = addressService.getUserAddresses(user);
        return ResponseEntity.ok(list);
    }
}

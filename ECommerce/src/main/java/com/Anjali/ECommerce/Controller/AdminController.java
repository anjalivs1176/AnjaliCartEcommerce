package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {

    private final SellerService sellerService;

    // Endpoint to update a seller's account status (ACTIVE, INACTIVE, etc.)
    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status) throws Exception {

        // Call service to update seller's status
        Seller updatedSeller = sellerService.updateSellerAccountStatus(id, status);

        // Return updated seller in response
        return ResponseEntity.ok(updatedSeller);
    }
}

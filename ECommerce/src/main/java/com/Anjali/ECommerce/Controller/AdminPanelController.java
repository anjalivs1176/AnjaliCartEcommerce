package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminPanelController {

    private final SellerService sellerService;

    // Get sellers filtered by status
    @GetMapping("/sellers")
    public ResponseEntity<List<Seller>> getSellers(
            @RequestParam(required = false) AccountStatus status
    ) {

        // If no status provided → get ALL by passing null-friendly logic
        List<Seller> sellers = sellerService.getAllSellers(status);

        return ResponseEntity.ok(sellers);
    }


    //  Update seller status 
    @PutMapping("/sellers/{id}/status")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest req
    ) throws Exception {

        Seller updated = sellerService.updateSellerAccountStatus(id, req.getStatus());
        return ResponseEntity.ok(updated);
    }

    // Request body class
    public static class StatusRequest {
        private AccountStatus status;
        public AccountStatus getStatus() { return status; }
        public void setStatus(AccountStatus status) { this.status = status; }
    }
}

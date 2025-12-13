package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.Transaction;
import com.Anjali.ECommerce.Service.SellerService;
import com.Anjali.ECommerce.Service.TransactionService;
import com.Anjali.ECommerce.exception.SellerException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final SellerService sellerService;

    // Get all transactions for the logged-in seller
    @GetMapping("/seller")
    public ResponseEntity<List<Transaction>> getTransactionBySeller(
            @RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt); // Get seller info from JWT token

        List<Transaction> transactions = transactionService.getTransactionsBySellerId(seller); // Fetch seller-specific transactions
        return ResponseEntity.ok(transactions); // Return transactions list with OK status
    }

    // Get all transactions in the system (admin view or global view)
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(){
        List<Transaction> transactions = transactionService.getAllTransactions(); // Fetch all transactions
        return ResponseEntity.ok(transactions); // Return list with OK status
    }
}

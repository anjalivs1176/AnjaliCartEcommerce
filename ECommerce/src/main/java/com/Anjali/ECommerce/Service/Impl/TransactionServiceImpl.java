package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.Transaction;
import com.Anjali.ECommerce.Repository.SellerRepository;
import com.Anjali.ECommerce.Repository.TransactionRepository;
import com.Anjali.ECommerce.Service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;

    // Create a transaction for a given order
    @Override
    public Transaction createTransaction(Order order) {
        // Fetch the seller associated with the order
        Seller seller = sellerRepository.findById(order.getSellerId()).get();

        // Prepare transaction object
        Transaction transaction = new Transaction();
        transaction.setSeller(seller);
        transaction.setOrder(order);
        transaction.setCustomer(order.getUser()); // set customer from order

        // Save and return the transaction
        return transactionRepository.save(transaction);
    }

    // Get all transactions for a specific seller
    @Override
    public List<Transaction> getTransactionsBySellerId(Seller seller) {
        return transactionRepository.findBySellerId(seller.getId());
    }

    // Get all transactions in the system
    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}

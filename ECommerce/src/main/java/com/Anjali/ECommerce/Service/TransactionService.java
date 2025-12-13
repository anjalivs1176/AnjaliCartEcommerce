package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order);
    List<Transaction> getTransactionsBySellerId(Seller  seller);
    List<Transaction> getAllTransactions();

}

package com.Anjali.ECommerce.Service;

import java.util.List;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.exception.SellerException;

public interface SellerService {

    Seller getSellerProfile(String jwt) throws Exception;

    Seller createSeller(Seller seller) throws Exception;

    Seller getSellerById(Long id) throws SellerException;

    Seller getSellerByEmail(String email) throws Exception;

    List<Seller> getAllSellers(AccountStatus stats);

    Seller updateSeller(Long id, Seller seller) throws Exception;

    void deleteSeller(Long id) throws Exception;

    Seller verifyEmail(String email, String otp) throws Exception;

    Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception;

    List<Seller> getSellersByStatus(AccountStatus status);

    boolean existsByEmail(String email);

}

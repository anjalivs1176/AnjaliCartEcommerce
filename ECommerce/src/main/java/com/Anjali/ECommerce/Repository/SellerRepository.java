package com.Anjali.ECommerce.Repository;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller,Long> {
    Seller findByEmail(String email);
    List<Seller> findByAccountStatus(AccountStatus stats);

}

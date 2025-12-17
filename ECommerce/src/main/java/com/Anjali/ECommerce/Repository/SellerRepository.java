package com.Anjali.ECommerce.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Anjali.ECommerce.Domain.AccountStatus;
import com.Anjali.ECommerce.Model.Seller;

public interface SellerRepository extends JpaRepository<Seller, Long> {

    Seller findByEmail(String email);

    boolean existsByEmail(String email);

    List<Seller> findByAccountStatus(AccountStatus stats);

}

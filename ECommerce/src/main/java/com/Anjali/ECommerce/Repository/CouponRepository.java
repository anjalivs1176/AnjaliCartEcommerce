package com.Anjali.ECommerce.Repository;

import com.Anjali.ECommerce.Model.Coupons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CouponRepository extends JpaRepository<Coupons, Long> {

    Coupons findByCode(String code);

    @Query("SELECT c FROM Coupons c WHERE c.isActive = true")
    List<Coupons> findAllActive();
}

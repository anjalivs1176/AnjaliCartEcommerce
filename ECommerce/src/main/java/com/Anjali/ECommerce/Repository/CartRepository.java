package com.Anjali.ECommerce.Repository;

import com.Anjali.ECommerce.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart,Long> {

    Cart findByUserId(Long id);

}

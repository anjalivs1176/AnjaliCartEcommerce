package com.Anjali.ECommerce.Repository;

import com.Anjali.ECommerce.Model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist,Long> {

    Wishlist findByUserId(Long UserId);

}

package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Model.Wishlist;
import com.Anjali.ECommerce.Repository.WishlistRepository;
import com.Anjali.ECommerce.Service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class wishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    // Create a new wishlist for a user
    @Override
    public Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    // Get wishlist for a user; create one if it doesn't exist
    @Override
    public Wishlist getWishlistByUserId(User user) {
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId());
        if(wishlist == null){
            // Create a new wishlist if none exists
            wishlist = createWishlist(user);
        }
        return wishlist;
    }

    // Add or remove a product from user's wishlist (toggle)
    @Override
    public Wishlist addProductToWishlist(User user, Product product) {
        Wishlist wishlist = getWishlistByUserId(user);

        if(wishlist.getProducts().contains(product)){
            // If product already exists, remove it
            wishlist.getProducts().remove(product);
        } else {
            // Otherwise, add it
            wishlist.getProducts().add(product);
        }

        return wishlistRepository.save(wishlist);
    }
}

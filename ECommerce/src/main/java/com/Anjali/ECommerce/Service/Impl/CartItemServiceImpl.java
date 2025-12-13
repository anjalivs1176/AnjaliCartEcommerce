package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.CartItem;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.CartItemRepository;
import com.Anjali.ECommerce.Service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    // Repository for performing CRUD operations on CartItem
    private final CartItemRepository cartItemRepository;

    /**
     * Update a cart item for a user.
     * Checks if the user owns the cart item and updates quantity and prices.
     */
    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
        CartItem item = findCartItemById(id);

        // Check if the user owns the cart item
        User cartItemUser = item.getCart().getUser();
        if(cartItemUser.getId().equals(userId)){
            // Update quantity and recalculate prices
            item.setQuantity(cartItem.getQuantity());
            item.setMrpPrice(item.getQuantity() * item.getProduct().getMrpPrice());
            item.setSellingPrice(item.getQuantity() * item.getProduct().getSellingPrice());
            return cartItemRepository.save(item);
        }

        // Throw exception if user is not the owner
        throw new Exception("You cant update this cartItem");
    }

    /**
     * Remove a cart item for a user.
     * Checks if the user owns the cart item before deleting.
     */
    @Override
    public void removeCartItem(Long userId, Long CartItemId) throws Exception {
        CartItem item = findCartItemById(CartItemId);

        // Check if the user owns the cart item
        User cartItemUser = item.getCart().getUser();
        if(cartItemUser.getId().equals(userId)){
            cartItemRepository.delete(item);
        } else {
            // Throw exception if user is not the owner
            throw new Exception("you cant delete this item");
        }
    }

    /**
     * Find a cart item by its ID.
     * Throws exception if the cart item does not exist.
     */
    @Override
    public CartItem findCartItemById(Long id) throws Exception {
        return cartItemRepository.findById(id).orElseThrow(() ->
                new Exception("cart item not found with id " + id));
    }
}

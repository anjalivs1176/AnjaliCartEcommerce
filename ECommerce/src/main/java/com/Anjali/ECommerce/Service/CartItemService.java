package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.CartItem;

public interface CartItemService {

    CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception;
    void removeCartItem(Long userId, Long CartItemId) throws Exception;
    CartItem findCartItemById(Long id) throws Exception;
}

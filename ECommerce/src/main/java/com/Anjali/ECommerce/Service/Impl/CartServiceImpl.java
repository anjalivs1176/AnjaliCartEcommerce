package com.Anjali.ECommerce.Service.Impl;

import java.util.HashSet;

import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.CartItem;
import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.CartItemRepository;
import com.Anjali.ECommerce.Repository.CartRepository;
import com.Anjali.ECommerce.Service.CartService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    // Repository for Cart CRUD operations
    private final CartRepository  cartRepository;

    // Repository for CartItem CRUD operations
    private final CartItemRepository cartItemRepository;

    /**
     * Add a product to the user's cart.
     * If the product with the same size already exists, returns the existing cart item.
     * Otherwise, creates a new cart item and updates prices.
     */
    @Override
    public CartItem addCartItem(User user, Product product, String size, int quantity) {
        Cart cart = findUserCart(user);

        // Check if the product of same size is already in the cart
        CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart, product, size);

        if(isPresent == null){
            // Create a new cart item
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setSize(size);

            // Calculate total prices
            int totalPrice = quantity * product.getSellingPrice();
            cartItem.setSellingPrice(totalPrice);
            cartItem.setMrpPrice(quantity * product.getMrpPrice());

            // Associate cart item with cart
            cart.getCartItems().add(cartItem);
            cartItem.setCart(cart);

            // Save and return the new cart item
            return cartItemRepository.save(cartItem);
        }

        // Return existing cart item if already present
        return isPresent;
    }

    /**
     * Find the user's cart and update total prices, total items, and discount.
     */
//     @Override
// public Cart findUserCart(User user) {
//     Cart cart = cartRepository.findByUserId(user.getId());

//     double totalMrp = 0.0;
//     double totalSelling = 0.0;
//     int totalItem = 0;

//     for (CartItem cartItem : cart.getCartItems()) {
//         totalMrp += cartItem.getMrpPrice();
//         totalSelling += cartItem.getSellingPrice();
//         totalItem += cartItem.getQuantity();
//     }

//     cart.setTotalMrpPrice(totalMrp);
//     cart.setTotalSellingPrice(totalSelling);
//     cart.setTotalItem(totalItem);

//     // Discount Amount in rupees (correct)
//     double discountAmount = totalMrp - totalSelling;
//     cart.setDiscount(discountAmount);

//     return cart;
// }












































@Override
public Cart findUserCart(User user) {
    Cart cart = cartRepository.findByUserId(user.getId());

    // ⭐ If user has no cart, create a fresh one
    if (cart == null) {
        cart = new Cart();
        cart.setUser(user);
        cart.setCartItems(new HashSet<>());
        cart.setTotalMrpPrice(0d);
        cart.setTotalSellingPrice(0d);
        cart.setBaseDiscountAmount(0d);
        cart.setCouponDiscountAmount(0d);
        cart.setCouponCode(null);
        cart.setTotalItem(0);
        
        cart = cartRepository.save(cart);
    }

    double totalMrp = 0d;
    double totalSelling = 0d;
    int totalQty = 0;

    for (CartItem cartItem : cart.getCartItems()) {
        int itemMrp = (cartItem.getMrpPrice() != null)
            ? cartItem.getMrpPrice()
            : cartItem.getProduct().getMrpPrice();

        int itemSelling = (cartItem.getSellingPrice() != null)
            ? cartItem.getSellingPrice()
            : cartItem.getProduct().getSellingPrice();

        totalMrp += itemMrp;
        totalSelling += itemSelling;
        totalQty += cartItem.getQuantity();
    }

    cart.setTotalMrpPrice(totalMrp);
    cart.setTotalSellingPrice(totalSelling);
    cart.setTotalItem(totalQty);

    double baseDiscount = totalMrp - totalSelling;
    if (baseDiscount < 0) baseDiscount = 0;
    cart.setBaseDiscountAmount(baseDiscount);

    return cart;
}















    /**
     * Calculate discount percentage from MRP and selling price.
     */
    private int calculateDiscountpercentage(int mrpPrice, int sellingPrice) {
        if(mrpPrice <= 0){
            return 0;
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

}

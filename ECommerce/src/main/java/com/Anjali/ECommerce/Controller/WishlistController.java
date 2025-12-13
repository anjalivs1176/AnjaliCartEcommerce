package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Model.Wishlist;
import com.Anjali.ECommerce.Service.ProductService;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.Service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductService productService;

    // Endpoint to get the wishlist of the logged-in user
    @GetMapping()
    public ResponseEntity<Wishlist> getWishlistByUserId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Fetch user from JWT token
        User user = userService.findUserByJwtToken(jwt);

        // Get wishlist associated with this user
        Wishlist wishlist = wishlistService.getWishlistByUserId(user);

        // Return wishlist
        return ResponseEntity.ok(wishlist);
    }

    // Endpoint to add (or toggle) a product in the user's wishlist
    @PostMapping("/add-product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Fetch the product by ID
        Product product = productService.findProductById(productId);

        // Fetch the user from JWT token
        User user = userService.findUserByJwtToken(jwt);

        // Add or remove the product in user's wishlist
        Wishlist updatedWishlist = wishlistService.addProductToWishlist(user, product);

        // Return the updated wishlist
        return ResponseEntity.ok(updatedWishlist);
    }
}

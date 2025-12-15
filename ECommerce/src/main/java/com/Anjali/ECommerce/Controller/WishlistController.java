package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Model.Wishlist;
import com.Anjali.ECommerce.Service.ProductService;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.Service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductService productService;

    private User getCurrentUser() throws Exception {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userService.findUserByEmail(email);
    }

    @GetMapping
    public ResponseEntity<Wishlist> getWishlist() throws Exception {
        User user = getCurrentUser();
        Wishlist wishlist = wishlistService.getWishlistByUserId(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/add-product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(
            @PathVariable Long productId
    ) throws Exception {

        User user = getCurrentUser();
        Product product = productService.findProductById(productId);

        Wishlist updated = wishlistService.addProductToWishlist(user, product);
        return ResponseEntity.ok(updated);
    }
}

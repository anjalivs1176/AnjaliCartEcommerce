package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.CartItem;
import com.Anjali.ECommerce.Model.Product;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Request.AddItemRequest;
import com.Anjali.ECommerce.Service.CartItemService;
import com.Anjali.ECommerce.Service.CartService;
import com.Anjali.ECommerce.Service.ProductService;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.exception.ProductException;
import com.Anjali.ECommerce.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    // Get logged-in user
    private User getCurrentUser() throws Exception {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userService.findUserByEmail(email);
    }

    @GetMapping
    public ResponseEntity<Cart> getUserCart() throws Exception {
        User user = getCurrentUser();
        Cart cart = cartService.findUserCart(user);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(
            @RequestBody AddItemRequest req
    ) throws Exception, ProductException {

        User user = getCurrentUser();
        Product product = productService.findProductById(req.getProductId());

        CartItem item = cartService.addCartItem(
                user,
                product,
                req.getSize(),
                req.getQuantity()
        );

        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItem(
            @PathVariable Long cartItemId
    ) throws Exception {

        User user = getCurrentUser();
        cartItemService.removeCartItem(user.getId(), cartItemId);

        ApiResponse res = new ApiResponse();
        res.setMessage("Item deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody CartItem cartItem
    ) throws Exception {

        User user = getCurrentUser();
        CartItem updated = cartItemService.updateCartItem(
                user.getId(),
                cartItemId,
                cartItem
        );

        return new ResponseEntity<>(updated, HttpStatus.ACCEPTED);
    }
}

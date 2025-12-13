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
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart") // All routes prefixed with /api/cart
public class CartController {

    private final CartService cartService;        // Main cart operations
    private final CartItemService cartItemService; // Operations for individual cart items
    private final UserService userService;         // User-related operations (find user from JWT)
    private final ProductService productService;   // Product info

    // ---------------- Get current user's cart ----------------
    @GetMapping
    public ResponseEntity<Cart> findUserCartHandler(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // Identify user from JWT
        Cart cart = cartService.findUserCart(user);      // Fetch the user's cart
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    // ---------------- Add an item to the cart ----------------
    @PutMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddItemRequest req,
            @RequestHeader("Authorization") String jwt)
            throws Exception, ProductException {

        User user = userService.findUserByJwtToken(jwt);
        Product product = productService.findProductById(req.getProductId());

        // Add item to cart
        CartItem item = cartService.addCartItem(user,
                product,
                req.getSize(),
                req.getQuantity());

        ApiResponse res = new ApiResponse();
        res.setMessage("Item added successfully");
        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }

    // ---------------- Delete a cart item ----------------
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        cartItemService.removeCartItem(user.getId(), cartItemId);

        ApiResponse res = new ApiResponse();
        res.setMessage("Item deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

    // ---------------- Update quantity/details of a cart item ----------------
    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemHandler(
            @PathVariable Long cartItemId,
            @RequestBody CartItem cartItem,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserByJwtToken(jwt); // Identify user
        CartItem updatedCartItem = null;

        // Only update if quantity is greater than zero
        if (cartItem.getQuantity() > 0) {
            updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
        }

        return new ResponseEntity<>(updatedCartItem, HttpStatus.ACCEPTED);
    }
}

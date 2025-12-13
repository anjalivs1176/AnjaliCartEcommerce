package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Domain.OrderStatus;
import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Service.OrderService;
import com.Anjali.ECommerce.Service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;
    private final SellerService sellerService;

    // Get all orders for the logged-in seller
    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersHandler(@RequestHeader("Authorization") String jwt) throws Exception {
        Seller seller = sellerService.getSellerProfile(jwt); // Fetch seller profile using JWT
        List<Order> orders = orderService.sellerOrders(seller.getId()); // Get all orders for this seller
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    // Update order status for a specific order
    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<Order> updateOrderHandler(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt); // Get logged-in seller
        Order order = orderService.findOrderById(orderId); // Fetch the order

        // Check if the order belongs to this seller
        if (!order.getSellerId().equals(seller.getId())) {
            throw new Exception("You are not authorized to update this order.");
        }

        // Proceed to update order status
        Order updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);
        return new ResponseEntity<>(updatedOrder, HttpStatus.ACCEPTED);
    }

}

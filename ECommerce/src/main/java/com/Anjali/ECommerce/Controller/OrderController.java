package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Domain.PaymentMethod;
import com.Anjali.ECommerce.Model.*;
import com.Anjali.ECommerce.Repository.PaymentOrderRepository;
import com.Anjali.ECommerce.Service.*;
import com.Anjali.ECommerce.response.PaymentLinkResponse;
import com.razorpay.PaymentLink;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final CartService cartService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final PaymentService paymentService;
    private final PaymentOrderRepository paymentOrderRepository;

    // Create orders for the user and generate payment link
    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
            @RequestBody Address shippingAddress,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Get user from JWT
        User user = userService.findUserByJwtToken(jwt);

        // Get user's cart
        Cart cart = cartService.findUserCart(user);

        // Create orders for the items in the cart
        Set<Order> orders = orderService.createOrder(user,shippingAddress,cart);

        // Create a payment order for the created orders
        PaymentOrder paymentOrder = paymentService.createOrder(user,orders);

        PaymentLinkResponse res = new PaymentLinkResponse();

        // Generate payment link based on selected payment method
        if(paymentMethod.equals(PaymentMethod.RAZORPAY)){
            PaymentLink payment =  paymentService.createRazorpayPaymentLink(user,
                    paymentOrder.getAmount(),
                    paymentOrder.getId());

            // Get Razorpay payment URL and ID
            String paymentUrl=payment.get("short_url");
            String paymentUrlId=payment.get("id");

            res.setPayment_link_url(paymentUrl);

            // Save payment link ID in payment order
            paymentOrder.setPaymentLinkId(paymentUrlId);
            paymentOrderRepository.save(paymentOrder);
        }
        else {
            // Generate Stripe payment link
            String paymentUrl = paymentService.createStripePaymentLink(user,
                    paymentOrder.getAmount(),
                    paymentOrder.getId());
            res.setPayment_link_url(paymentUrl);
        }

        return new  ResponseEntity<>(res, HttpStatus.OK);
    }

    // Get all orders of the logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistoryHandler(
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Get user from JWT
        User user = userService.findUserByJwtToken(jwt);

        // Retrieve all orders for the user
        List<Order> orders=orderService.usersOrderHistory(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    // Get a specific order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable long orderId, @RequestHeader("Authorization") String jwt) throws Exception {

        // Get user from JWT (authorization check if needed)
        User user=userService.findUserByJwtToken(jwt);

        // Retrieve order by ID
        Order orders=orderService.findOrderById(orderId);
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    // Get a specific order item by ID
    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemById(
            @PathVariable long orderItemId, @RequestHeader("Authorization") String jwt) throws Exception {

        // Get user from JWT
        User user = userService.findUserByJwtToken(jwt);

        // Retrieve order item by ID
        OrderItem orderItem = orderService.getOrderItemById(orderItemId);
        return new ResponseEntity<>(orderItem, HttpStatus.ACCEPTED);
    }

    // Cancel an order
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable long orderId, @RequestHeader("Authorization") String jwt) throws Exception {

        // Get user from JWT
        User user = userService.findUserByJwtToken(jwt);

        // Cancel the order
        Order order = orderService.cancelOrder(orderId,user);

        // Update seller's report with canceled order details
        Seller seller = sellerService.getSellerById(order.getSellerId());
        SellerReport report = sellerReportService.getSellerReport(seller);
        report.setCanceledOrders(report.getCanceledOrders()+1);
        report.setTotalRefunds(report.getTotalRefunds()+order.getTotalSellingPrice());
        sellerReportService.updateSellerReport(report);

        return ResponseEntity.ok(order);
    }
}

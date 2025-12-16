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
import org.springframework.security.core.context.SecurityContextHolder;
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

    // 🔑 COMMON METHOD – single source of truth
    private User getCurrentUser() throws Exception {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userService.findUserByEmail(email);
    }

    // ---------------- CREATE ORDER ----------------
    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createOrderHandler(
            @RequestBody Address shippingAddress,
            @RequestParam PaymentMethod paymentMethod) throws Exception {

        User user = getCurrentUser();
        Cart cart = cartService.findUserCart(user);

        Set<Order> orders = orderService.createOrder(user, shippingAddress, cart);
        PaymentOrder paymentOrder = paymentService.createOrder(user, orders);

        PaymentLinkResponse res = new PaymentLinkResponse();

        if (paymentMethod == PaymentMethod.RAZORPAY) {
            PaymentLink payment = paymentService.createRazorpayPaymentLink(
                    user,
                    paymentOrder.getAmount(),
                    paymentOrder.getId()
            );

            res.setPayment_link_url(payment.get("short_url"));
            paymentOrder.setPaymentLinkId(payment.get("id"));
            paymentOrderRepository.save(paymentOrder);
        }

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    // ---------------- USER ORDERS ----------------
    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistoryHandler() throws Exception {
        User user = getCurrentUser();
        return ResponseEntity.ok(orderService.usersOrderHistory(user.getId()));
    }

    // ---------------- ORDER BY ID ----------------
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable long orderId) throws Exception {
        getCurrentUser(); // ensures auth
        return ResponseEntity.ok(orderService.findOrderById(orderId));
    }

    // ---------------- ORDER ITEM ----------------
    @GetMapping("/item/{orderItemId}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable long orderItemId) throws Exception {
        getCurrentUser(); // ensures auth
        return ResponseEntity.ok(orderService.getOrderItemById(orderItemId));
    }

    // ---------------- CANCEL ORDER ----------------
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable long orderId) throws Exception {

        User user = getCurrentUser();
        Order order = orderService.cancelOrder(orderId, user);

        Seller seller = sellerService.getSellerById(order.getSellerId());
        SellerReport report = sellerReportService.getSellerReport(seller);

        report.setCanceledOrders(report.getCanceledOrders() + 1);
        report.setTotalRefunds(report.getTotalRefunds() + order.getTotalSellingPrice());

        sellerReportService.updateSellerReport(report);

        return ResponseEntity.ok(order);
    }
}

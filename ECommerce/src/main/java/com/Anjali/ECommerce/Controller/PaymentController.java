package com.Anjali.ECommerce.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.Coupons;
import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.PaymentOrder;
import com.Anjali.ECommerce.Model.Seller;
import com.Anjali.ECommerce.Model.SellerReport;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.CartItemRepository;
import com.Anjali.ECommerce.Repository.CartRepository;
import com.Anjali.ECommerce.Repository.CouponRepository;
import com.Anjali.ECommerce.Service.PaymentService;
import com.Anjali.ECommerce.Service.SellerReportService;
import com.Anjali.ECommerce.Service.SellerService;
import com.Anjali.ECommerce.Service.TransactionService;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final SellerService sellerService;
    private final SellerReportService sellerReportService;
    private final TransactionService transactionService;

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    private final CouponRepository couponRepository;

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse> paymentSuccessfulHandler(
            @PathVariable String paymentId,
            @RequestParam String paymentLinkId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);

        boolean paymentSuccess = paymentService.proceedPaymentOrder(
                paymentOrder,
                paymentId,
                paymentLinkId
        );

        if (paymentSuccess) {

            //MARK COUPON AS USED (ONLY AFTER PAYMENT)
            Cart cart = user.getCart();
            String couponCode = cart.getCouponCode();

            if (couponCode != null && !couponCode.isEmpty()) {
                Coupons coupon = couponRepository.findByCode(couponCode);

                if (coupon != null && !user.getUsedCoupons().contains(coupon)) {
                    user.getUsedCoupons().add(coupon);
                    userService.saveUser(user); // save updated user
                }
            }
            // CLEAR CART AFTER SUCCESSFUL PAYMENT
            if (cart != null) {

                // Delete each cart item from DB
                cart.getCartItems().forEach(item -> cartItemRepository.delete(item));
                cart.getCartItems().clear();

                // Reset all cart summary fields
                cart.setTotalSellingPrice(0);
                cart.setTotalMrpPrice(0);
                cart.setDiscount(0);
                cart.setTotalItem(0);
                cart.setCouponCode(null);
                cart.setBaseDiscountAmount(0);
                cart.setCouponDiscountAmount(0);

                cartRepository.save(cart);
            }

            // ================================
            // Handle seller reports & orders
            // ================================
            for (Order order : paymentOrder.getOrders()) {
                transactionService.createTransaction(order);

                Seller seller = sellerService.getSellerById(order.getSellerId());
                SellerReport report = sellerReportService.getSellerReport(seller);

                report.setTotalOrders(report.getTotalOrders() + 1);
                report.setTotalEarnings(report.getTotalEarnings() + order.getTotalSellingPrice());
                report.setTotalSales(report.getTotalSales() + order.getOrderItems().size());

                sellerReportService.updateSellerReport(report);
            }
        }

        ApiResponse res = new ApiResponse();
        res.setMessage("Payment Successful");
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }
}

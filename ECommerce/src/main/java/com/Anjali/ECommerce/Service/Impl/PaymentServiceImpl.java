package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Domain.PaymentOrderStatus;
import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.PaymentOrder;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Domain.PaymentStatus;
import com.Anjali.ECommerce.Repository.OrderRepository;
import com.Anjali.ECommerce.Repository.PaymentOrderRepository;
import com.Anjali.ECommerce.Service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    // Repository for CRUD operations on PaymentOrders
    private final PaymentOrderRepository paymentOrderRepository;

    // Repository for CRUD operations on Orders
    private final OrderRepository orderRepository;

    // Razorpay API credentials
    private String apiKey = "rzp_test_RfwfY4Qkkfk1RV";
    private String apiSecret = "IJtoeVDJ9BF9QhjPHQ5AwcKZ";

    // Stripe secret key
    private String stripeSecretKey = "stripeSecretKey";

    /**
     * Create a payment order for a set of orders.
     */
    @Override
    public PaymentOrder createOrder(User user, Set<Order> orders) {
        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setAmount(amount);
        paymentOrder.setUser(user);
        paymentOrder.setOrders(orders);

        return paymentOrderRepository.save(paymentOrder);
    }

    /**
     * Get a payment order by its ID.
     */
    @Override
    public PaymentOrder getPaymentOrderById(Long orderId) throws Exception {
        return paymentOrderRepository.findById(orderId).orElseThrow(() ->
                new Exception("Payment Order not found"));
    }

    /**
     * Get a payment order by Razorpay payment link ID.
     */
    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String orderId) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(orderId);
        if(paymentOrder == null){
            throw new Exception("Payment order not found with provided payment link ID");
        }
        return paymentOrder;
    }

    /**
     * Proceed with payment verification for a payment order using Razorpay.
     * Updates order and payment statuses based on Razorpay response.
     */
    @Override
    public Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException {
        if(paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){

            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
            Payment payment = razorpay.payments.fetch(paymentId);
            String status = payment.get("status");

            if(status.equals("captured")){
                // Mark all associated orders as paid
                Set<Order> orders = paymentOrder.getOrders();
                for(Order order : orders){
                    order.setPaymentStatus(PaymentStatus.COMPLETED);
                    orderRepository.save(order);
                }
                paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(paymentOrder);
                return true;
            }

            // Mark payment as failed if not captured
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
        }
        return false;
    }

    /**
     * Create a Razorpay payment link for the user.
     */
    @Override
    public PaymentLink createRazorpayPaymentLink(User user, Long amount, Long orderId) throws RazorpayException {
        amount = amount * 100; // Convert to paise for Razorpay

        try {
            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
            JSONObject paymentLinkRequest = new JSONObject();

            paymentLinkRequest.put("amount", amount);
            paymentLinkRequest.put("currency", "INR");

            JSONObject customer = new JSONObject();
            customer.put("name", user.getName());
            customer.put("email", user.getEmail());
            paymentLinkRequest.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("email", true);
            paymentLinkRequest.put("notify", notify);

            paymentLinkRequest.put("callback_url", "http://localhost:3000/payment-success/" + orderId);
            paymentLinkRequest.put("callback_method", "get");

            // Create payment link
            PaymentLink paymentLink = razorpay.paymentLink.create(paymentLinkRequest);

            return paymentLink;
        } catch (Exception e){
            System.out.println(e.getMessage());
            throw new RazorpayException(e.getMessage());
        }
    }

    /**
     * Create a Stripe payment session link for the user.
     */
    @Override
    public String createStripePaymentLink(User user, Long amount, Long orderId) throws StripeException {

        Stripe.apiKey = stripeSecretKey;

        // Build session parameters for Stripe checkout
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/payment-success/" + orderId)
                .setCancelUrl("http://localhost:3000/payment-cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amount * 100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("AnjaliCartPayment")
                                        .build())
                                .build())
                        .build())
                .build();

        // Create checkout session
        Session session = Session.create(params);
        return session.getUrl();
    }
}

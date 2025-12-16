package com.Anjali.ECommerce.Service.Impl;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Anjali.ECommerce.Domain.OrderStatus;
import com.Anjali.ECommerce.Domain.PaymentStatus;
import com.Anjali.ECommerce.Model.Address;
import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.CartItem;
import com.Anjali.ECommerce.Model.Order;
import com.Anjali.ECommerce.Model.OrderItem;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.OrderItemRepositry;
import com.Anjali.ECommerce.Repository.OrderRepository;
import com.Anjali.ECommerce.Service.OrderService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepositry orderItemRepositry;

    /**
     * Create orders from a user's cart. Groups cart items by seller and creates
     * separate orders for each seller.
     */
    @Transactional
    @Override
    public Set<Order> createOrder(User user, Address shippingAddress, Cart cart) {

        // -----------------------------------------
        // ADD SHIPPING ADDRESS TO USER IF NEW
        // -----------------------------------------
        if (!user.getAddresses().contains(shippingAddress)) {
            user.getAddresses().add(shippingAddress);
        }
        // NOTE: Address is @Embeddable now → no repo save needed.

        // -----------------------------------------
        // GROUP ITEMS BY SELLER ID
        // -----------------------------------------
        Map<Long, List<CartItem>> itemsBySeller = cart.getCartItems()
                .stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));

        Set<Order> orders = new HashSet<>();

        // -----------------------------------------
        // CREATE ORDERS PER SELLER
        // -----------------------------------------
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {

            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();

            int totalOrderPrice = items.stream().mapToInt(CartItem::getSellingPrice).sum();
            int totalItem = items.stream().mapToInt(CartItem::getQuantity).sum();

            Order order = new Order();
            order.setUser(user);
            order.setSellerId(sellerId);
            order.setTotalMrpPrice(totalOrderPrice);
            order.setTotalSellingPrice(totalOrderPrice);
            order.setTotalItem(totalItem);

            // -----------------------------------------
            // EMBEDDED SHIPPING ADDRESS
            // -----------------------------------------
            order.setShippingAddress(shippingAddress);

            order.setOrderStatus(OrderStatus.PENDING);
            order.getPaymentDetails().setPaymentStatus(PaymentStatus.PENDING);

            Order savedOrder = orderRepository.save(order);
            orders.add(savedOrder);

            // -----------------------------------------
            // CREATE ORDER ITEMS
            // -----------------------------------------
            for (CartItem item : items) {

                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(item.getProduct());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setMrpPrice(item.getMrpPrice());
                orderItem.setSellingPrice(item.getSellingPrice());
                orderItem.setSize(item.getSize());
                orderItem.setUserId(item.getUserId());

                orderItem.setOrder(savedOrder);

                savedOrder.getOrderItems().add(orderItem);

                orderItemRepositry.save(orderItem);
            }

            // CLEAR CART ITEMS ONLY AFTER ALL ORDERS CREATED
            cart.getCartItems().clear();
        }

        return orders;
    }

    @Override
    public Order findOrderById(long id) throws Exception {
        return orderRepository.findById(id)
                .orElseThrow(() -> new Exception("Order not found"));
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> sellerOrders(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        order.setOrderStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(Long orderId, User user) throws Exception {
        Order order = findOrderById(orderId);

        if (!user.getId().equals(order.getUser().getId())) {
            throw new Exception("You don't have access to this Order");
        }

        order.setOrderStatus(OrderStatus.CANCELED);
        return orderRepository.save(order);
    }

    @Override
    public OrderItem getOrderItemById(Long id) throws Exception {
        return orderItemRepositry.findById(id)
                .orElseThrow(() -> new Exception("Order Item doesn't Exist"));
    }
}

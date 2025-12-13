package com.Anjali.ECommerce.Service.Impl;

import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.Coupons;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Repository.CartRepository;
import com.Anjali.ECommerce.Repository.CouponRepository;
import com.Anjali.ECommerce.Repository.UserRepository;
import com.Anjali.ECommerce.Service.CartService;
import com.Anjali.ECommerce.Service.CouponService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;

    @Override
    public Cart applyCoupon(String code, double orderValue, User user) throws Exception {

        Coupons coupon = couponRepository.findByCode(code);
        if (coupon == null) {
            throw new Exception("Coupon not found");
        }

        // Recompute the cart totals before applying coupon
        Cart cart = cartService.findUserCart(user);
        if (cart == null) {
            throw new Exception("Cart not found");
        }

        LocalDate today = LocalDate.now();
        boolean validDate
                = !today.isBefore(coupon.getValidityStratDate())
                && !today.isAfter(coupon.getValidityEndDate());

        if (!coupon.isActive() || !validDate) {
            throw new Exception("Coupon expired or inactive");
        }

        if (orderValue < coupon.getMinimumOrderValue()) {
            throw new Exception("Minimum order value not reached");
        }

        // safe initialize used coupons
        Hibernate.initialize(user.getUsedCoupons());
        if (user.getUsedCoupons().contains(coupon)) {
            throw new Exception("You already used this coupon");
        }

        // selling price BEFORE coupon (already computed by cartService)
        double sellingBeforeCoupon = cart.getTotalSellingPrice();

        // calculate coupon discount ON selling price
        double couponDiscount = sellingBeforeCoupon * (coupon.getDiscountPercentage() / 100.0);
        if (couponDiscount < 0) {
            couponDiscount = 0;
        }

        double finalSellingPrice = sellingBeforeCoupon - couponDiscount;
        if (finalSellingPrice < 0) {
            finalSellingPrice = 0;
        }

        // update cart fields
        cart.setCouponCode(code);
        cart.setCouponDiscountAmount(couponDiscount);
        cart.setTotalSellingPrice(finalSellingPrice);

        // mark coupon used for the user
        List<Coupons> used = new ArrayList<>(user.getUsedCoupons());
        used.add(coupon);
        user.setUsedCoupons(used);

        userRepository.save(user);
        return cartRepository.save(cart);
    }

    @Override
    public Coupons createCoupon(Coupons coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupons> findAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public void deleteCoupon(Long id) throws Exception {
        couponRepository.deleteById(id);
    }

    @Override
    public List<Coupons> findActiveCoupons() {
        LocalDate today = LocalDate.now();

        return couponRepository.findAll().stream()
                .filter(Coupons::isActive)
                .filter(c -> !today.isBefore(c.getValidityStratDate()))
                .filter(c -> !today.isAfter(c.getValidityEndDate()))
                .toList();
    }

    @Override
    public Coupons findCouponById(Long id) throws Exception {
        return couponRepository.findById(id)
                .orElseThrow(() -> new Exception("Coupon not found with id: " + id));
    }

    @Override
    public Cart removeCoupon(String code, User user) throws Exception {
        Cart cart = cartService.findUserCart(user);
        if (cart == null) {
            throw new Exception("Cart not found");
        }

        // clear coupon fields
        cart.setCouponCode(null);
        cart.setCouponDiscountAmount(0.0);

        // recompute selling price to remove coupon effect:
        // selling price after removing coupon should be sellingBeforeCoupon (we can recompute from items)
        // cartService.findUserCart already set totalSellingPrice to sellingBeforeCoupon
        Cart updated = cartService.findUserCart(user);
        updated.setCouponCode(null);
        updated.setCouponDiscountAmount(0.0);

        // Remove coupon from user's usedCoupons if you want to allow re-use (optional)
        Hibernate.initialize(user.getUsedCoupons());
        user.getUsedCoupons().removeIf(c -> c.getCode().equalsIgnoreCase(code));
        userRepository.save(user);

        return cartRepository.save(updated);
    }
}

package com.Anjali.ECommerce.Service;

import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.Coupons;
import com.Anjali.ECommerce.Model.User;

import java.util.List;

public interface CouponService {

    Cart applyCoupon(String code, double orderValue, User user) throws Exception;
    Cart removeCoupon(String code, User user) throws Exception;
    Coupons findCouponById(Long id) throws Exception;
    Coupons createCoupon(Coupons coupon);
    List<Coupons> findAllCoupons();
    void deleteCoupon(Long id) throws Exception;
    List<Coupons> findActiveCoupons();

}

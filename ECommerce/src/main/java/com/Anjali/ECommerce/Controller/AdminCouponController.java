package com.Anjali.ECommerce.Controller;

import com.Anjali.ECommerce.Model.Cart;
import com.Anjali.ECommerce.Model.Coupons;
import com.Anjali.ECommerce.Model.User;
import com.Anjali.ECommerce.Service.CartService;
import com.Anjali.ECommerce.Service.CouponService;
import com.Anjali.ECommerce.Service.UserService;
import com.Anjali.ECommerce.Repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupons")
public class AdminCouponController {

    private final CouponService couponService;
    private final UserService userService;
    private final CartService cartService;
    private final CouponRepository couponRepository;

    // APPLY COUPON
    @GetMapping("/apply")
    public ResponseEntity<?> applyCoupon(
            @RequestParam String code,
            @RequestParam double orderValue,
            @RequestHeader("Authorization") String jwt
    ) {
        try {
            User user = userService.findUserByJwtToken(jwt);

            Cart cart = couponService.applyCoupon(code, orderValue, user);

            return ResponseEntity.ok(cart);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //REMOVE COUPON
    @GetMapping("/remove")
    public ResponseEntity<?> removeCoupon(
            @RequestParam String code,
            @RequestHeader("Authorization") String jwt
    ) {
        try {
            User user = userService.findUserByJwtToken(jwt);

            Cart cart = couponService.removeCoupon(code, user);

            return ResponseEntity.ok(cart);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // CREATE COUPON (ADMIN)
    @PostMapping("/admin/create")
    public ResponseEntity<Coupons> createCoupon(@RequestBody Coupons coupon) throws Exception {
        Coupons createdCoupon = couponService.createCoupon(coupon);
        return ResponseEntity.ok(createdCoupon);
    }

    // GET ACTIVE COUPONS (USER)
    @GetMapping("/active")
    public List<Coupons> getActiveCoupons(@RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        List<Coupons> allCoupons = couponRepository.findAllActive();

        // REMOVE coupons this user has already used
        return allCoupons.stream()
                .filter(c -> !user.getUsedCoupons().contains(c))
                .toList();
    }

    // DELETE COUPON (ADMIN)
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) throws Exception {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok("Coupon deleted successfully");
    }

    // GET ALL COUPONS (ADMIN)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Coupons>> getAllCoupons() throws Exception {
        List<Coupons> coupons = couponService.findAllCoupons();
        return ResponseEntity.ok(coupons);
    }
}

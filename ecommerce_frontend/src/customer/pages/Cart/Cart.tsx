import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { LocalOffer } from "@mui/icons-material";
import { teal } from "@mui/material/colors";
import { Button, TextField } from "@mui/material";
import PricingCard from "./PricingCard";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const [cart, setCart] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setCouponCode(e.target.value);
  };

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get("/coupons/active");
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setCoupons([]);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      alert("Please enter or select a coupon");
      return;
    }

    try {
      const { data } = await api.get(
        `/coupons/apply?code=${couponCode}&orderValue=${cart.totalSellingPrice}`
      );

      alert("Coupon Applied 🎉");
      setCart(data);
    } catch (err: any) {
      alert(err?.response?.data || "Invalid coupon");
    }
  };

  const navigateToProduct = (item: any) => {
    const category = item.product.category.categoryId;
    const title = encodeURIComponent(item.product.title);
    const id = item.product.id;

    navigate(`/product-details/${category}/${title}/${id}`);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="pt-10 px-5 sm:px-10 md:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="cartItemSection lg:col-span-2 space-y-3">
          {cart?.cartItems?.length > 0 ? (
            cart.cartItems.map((item: any) => (
              <CartItem
                key={item.id}
                item={{
                  ...item,
                  onDelete: fetchCart,
                  onNavigate: navigateToProduct,
                }}
              />
            ))
          ) : (
            <p>Your cart is empty 🤧</p>
          )}
        </div>

        <div className="col-span-1 text-sm space-y-3">
          <div className="border rounded-md px-5 py-3 space-y-5">
            <div className="flex gap-3 text-sm items-center">
              <LocalOffer sx={{ color: teal[600], fontSize: "17px" }} />
              <span>Apply Coupon</span>
            </div>

            <div className="flex justify-between items-center">
              <TextField
                onChange={handleChange}
                placeholder="coupon code"
                size="small"
                variant="outlined"
                value={couponCode}
              />
              <Button size="small" onClick={applyCoupon}>
                Apply
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              <p className="font-semibold text-gray-700">
                Available Coupons
              </p>

              {coupons.length === 0 && (
                <p className="text-xs text-gray-500">
                  No coupons available
                </p>
              )}

              {coupons.map((cp: any) => (
                <div
                  key={cp.id}
                  className="border p-2 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{cp.code}</p>
                    <p className="text-xs text-gray-500">
                      {cp.discountPercentage}% OFF • Min ₹
                      {cp.minimumOrderValue}
                    </p>
                  </div>

                  <Button
                    size="small"
                    onClick={() => setCouponCode(cp.code)}
                  >
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-md">
            <PricingCard cart={cart} />
            <div className="p-5">
              <Button
                onClick={() => navigate("/checkout")}
                fullWidth
                variant="contained"
                sx={{ py: "11px" }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


import { Divider } from '@mui/material';
import React from 'react';

const PricingCard = ({ cart }: any) => {

  if (!cart || !cart.cartItems?.length) {
    return (
      <div className="p-5 text-center text-gray-500">
        No items in your cart.
      </div>
    );
  }

  const originalMRP = cart.totalMrpPrice ?? 0;
  const finalSellingPrice = cart.totalSellingPrice ?? 0;


  const baseDiscount = cart.baseDiscountAmount ?? 0;
  const couponDiscount = cart.couponDiscountAmount ?? 0;

  const shipping = finalSellingPrice > 1500 ? 0 : 100;




  const totalPayable = cart.totalSellingPrice
    - cart.couponDiscountAmount
    + shipping;



  return (
    <>
      <div className="space-y-3 p-5">

        <div className="flex justify-between items-center">
          <span>Total MRP</span>
          <span>{originalMRP.toFixed(2)} Rs</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Base Discount</span>
          <span className="text-green-600">
            -{baseDiscount.toFixed(2)} Rs
          </span>
        </div>

        {cart.couponCode && (
          <div className="flex justify-between items-center">
            <span>Coupon Discount ({cart.couponCode})</span>
            <span className="text-green-600">
              -{couponDiscount.toFixed(2)} Rs
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Shipping Fee</span>
          <span>{shipping === 0 ? "Free" : `${shipping} Rs`}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Platform Fee</span>
          <span className="text-primary-color">Free</span>
        </div>

      </div>

      <Divider />

      <div className="flex justify-between items-center p-5 text-primary-color">
        <span>Total Payable</span>
        <span>{totalPayable.toFixed(2)} Rs</span>
      </div>
    </>
  );
};

export default PricingCard;

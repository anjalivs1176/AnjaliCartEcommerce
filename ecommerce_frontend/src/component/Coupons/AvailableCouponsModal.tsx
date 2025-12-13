import React, { useEffect, useState } from "react";
import { Modal, Paper, Button } from "@mui/material";
import { getActiveCoupons } from "../../api/couponApi";

const AvailableCouponsModal = ({ open, onClose, onApply }: any) => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (open) {
      getActiveCoupons().then(setCoupons);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: "10vh" }}>
        <h2 className="font-bold text-lg mb-3">Available Coupons</h2>

        {coupons.length === 0 && <p>No active coupons 😔</p>}

        {coupons.map((coupon: any) => (
          <div
            key={coupon.id}
            className="border p-3 rounded-md my-3 flex justify-between"
          >
            <div>
              <p className="font-bold">{coupon.code}</p>
              <p className="text-sm text-gray-500">
                {coupon.discountPercentage}% OFF • Min ₹{coupon.minimumOrderValue}
              </p>
            </div>

            <Button
              variant="contained"
              onClick={() => onApply(coupon.code)}
            >
              Apply
            </Button>
          </div>
        ))}
      </Paper>
    </Modal>
  );
};

export default AvailableCouponsModal;

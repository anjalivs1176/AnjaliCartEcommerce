
import React, { useEffect, useState } from "react";
import { Box, Button, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import axios from "axios";
import { Payments } from "@mui/icons-material";
import api from "../../../config/api";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDER DETAILS ", res.data);
      setOrder(res.data);
    } catch (err) {
      console.error("Error loading order details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  const item = order.orderItems[0];
  const product = item.product;

  const address = order.shippingAddress;

  const canCancel =
    order.orderStatus !== "DELIVERED" &&
    order.orderStatus !== "CANCELLED" &&
    order.orderStatus !== "SHIPPED";

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/orders/${order.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order cancelled successfully!");
      fetchOrder();
    } catch (e) {
      console.error("Error cancelling:", e);
    }
  };

  return (
    <Box className="space-y-5">


      <section className="flex flex-col gap-5 justify-center items-center">
        <img
          className="w-[120px] rounded-md"
          src={product.images[0]}
          alt={product.title}
        />

        <div className="text-sm space-y-1 text-center">
          <h1 className="font-bold">{product.title}</h1>
          <p>{product.description}</p>
          <p>
            <strong>Size:</strong> {item.size}
          </p>
          <p>
            <strong>Quantity:</strong> {item.quantity}
          </p>
          <p className="font-semibold text-primary-color text-lg">
            ₹{product.sellingPrice}
          </p>
        </div>
      </section>


      <section className="border p-5">
        <OrderStepper orderStatus={order.orderStatus} />
      </section>


      <div className="border p-5">
        <h1 className="font-bold pb-3">Delivery Address</h1>

        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>{address.name}</p>
            <Divider flexItem orientation="vertical" />
            <p>{address.mobile}</p>
          </div>

          <p>
            {address.address}, {address.locality}, {address.city},{" "}
            {address.state} - {address.pinCode}
          </p>
        </div>
      </div>


      <div className="border space-y-4">
        <div className="flex justify-between text-sm pt-5 px-5">
          <div className="space-y-1">
            <p>
              You Saved{" "}
              <span className="text-green-500 font-medium text-xs">
                ₹{product.mrp - product.sellingPrice}
              </span>{" "}
              on this item
            </p>
          </div>

          <p className="font-medium">₹{product.sellingPrice}</p>
        </div>

        <div className="px-5">
          <div className="bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3">
            <Payments />
            <p>{order.paymentMethod}</p>
          </div>
        </div>

        <Divider />

        <div className="px-5 pb-3">
          <p className="text-xs">
            <strong>Sold By:</strong> {product.brand}
          </p>
        </div>

        <div className="p-10">
          <Button
            disabled={!canCancel}
            onClick={handleCancelOrder}
            color="error"
            sx={{ py: "0.7rem" }}
            variant="outlined"
            fullWidth
          >
            {order.orderStatus === "CANCELLED"
              ? "Order Cancelled"
              : "Cancel Order"}
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default OrderDetails;

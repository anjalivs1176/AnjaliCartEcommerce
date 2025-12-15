import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import OrderItem from "./OrderItem";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders"); // interceptor adds token
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-gray-600 text-sm">Loading orders...</p>;
  }

  return (
    <div className="text-sm min-h-screen">
      <div className="pb-5">
        <h1 className="font-semibold text-lg">All Orders</h1>
        <p className="text-gray-500">from anytime</p>
      </div>

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        ) : (
          <p className="text-gray-500 text-center pt-10">
            You don’t have any orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;

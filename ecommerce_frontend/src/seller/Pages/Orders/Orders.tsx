import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { fetchSellerOrders } from "../../../state/seller/sellerOrdersSlice";
import OrderTable from "./OrderTable";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(
    (state: any) => state.sellerOrders
  );


useEffect(() => {
  dispatch(fetchSellerOrders()).then((res) => {
    console.log("SELLER ORDERS RESPONSE:", res.payload);
  });
}, [dispatch]);



  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return <OrderTable orders={orders} />;
};

export default Orders;

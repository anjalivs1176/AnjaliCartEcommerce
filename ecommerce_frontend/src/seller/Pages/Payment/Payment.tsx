
import React, { useEffect } from "react";
import { Card, Divider, Button } from "@mui/material";
import Transaction from "./Transaction";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { fetchSellerTransactions } from "../../../state/seller/sellerTransactionsSlice";
import { Order } from "../../../state/seller/sellerTransactionsSlice";

const Payment: React.FC = () => {
  const dispatch = useAppDispatch();

  const { transactions } = useAppSelector(
    (state) => state.sellerTransactions
  );

  useEffect(() => {
    dispatch(fetchSellerTransactions());
  }, [dispatch]);

  const totalEarnings = transactions.reduce(
    (sum: number, order: Order) => sum + order.totalSellingPrice,
    0
  );

  const lastPayment =
    transactions.length > 0
      ? transactions[transactions.length - 1].totalSellingPrice
      : 0;

  return (
    <div className="space-y-5">
      <Card className="rounded-md space-y-4 p-5">
        <h1 className="text-gray-600 font-medium">Total Earnings</h1>
        <h1 className="font-bold text-xl pb-1">₹{totalEarnings}</h1>

        <Divider />

        <p className="text-gray-600 font-medium pt-1">
          Last Payment: <strong>₹{lastPayment}</strong>
        </p>
      </Card>

      <div className="pt-10 space-y-3">
        <Button variant="contained">Transactions</Button>
        <Transaction />
      </div>
    </div>
  );
};

export default Payment;

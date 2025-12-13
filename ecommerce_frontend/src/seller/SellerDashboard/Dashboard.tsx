import React, { useEffect } from "react";
import { Card, CardContent, Typography, Grid, Divider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { fetchSellerOrders } from "../../state/seller/sellerOrdersSlice";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state:any) => state.sellerOrders);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading Dashboard...</p>;


  const totalEarnings = orders.reduce((sum:any, o:any) => sum + (o.totalSellingPrice || 0), 0);
  const delivered = orders.filter((o:any) => o.orderStatus === "DELIVERED").length;
  const pending = orders.filter((o:any) => o.orderStatus === "PENDING").length;

  
  const chartData = orders.map((o:any) => ({
    date: new Date(o.orderDate).toLocaleDateString(),
    amount: o.totalSellingPrice,
  }));

  return (
    <div className="p-5 space-y-6">

      {/* TOP CARDS */}
      <Grid container spacing={3}>
        <Grid size={{xs:12,sm:4}}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Total Earnings
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{totalEarnings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:4}}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Delivered Orders
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {delivered}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:4}}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Pending Orders
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SALES CHART */}
      <Card className="mt-6 p-4">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Sales Overview
        </Typography>
        <Divider className="mb-4" />

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;

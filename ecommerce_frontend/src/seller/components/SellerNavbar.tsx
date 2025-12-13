import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const SellerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("sellerName");

    navigate("/login");
  };

  const sellerName = localStorage.getItem("sellerName");

  return (
    <div
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        background: "#009688",
        color: "white",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        AnjaliCart Seller
      </div>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span>{sellerName}</span>

        <Button
          variant="contained"
          color="warning"
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SellerNavbar;

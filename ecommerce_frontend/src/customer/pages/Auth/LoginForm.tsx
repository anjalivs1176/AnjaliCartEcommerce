import React, { useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  //SEND OTP
  const handleSendOtp = async () => {
    setErrorMsg("");

    try {
      await api.post("/auth/send/login-signup-otp", {
        email: email,             
        role: "ROLE_CUSTOMER"
      });

      setOtpSent(true);
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Failed to send OTP";
      setErrorMsg(msg);
    }
  };

  //LOGIN WITH OTP
  const handleLogin = async () => {
    setErrorMsg("");

    try {
      const res = await api.post("/auth/signing", {
        email: email,              
        otp: otp,                  
        role: "ROLE_CUSTOMER"
      });

      const { jwt, role, id, name, profileImage } = res.data;

      localStorage.setItem("token", jwt);
      localStorage.setItem("role", role);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          name,
          profileImage: profileImage || null,
        })
      );

      window.dispatchEvent(new Event("authChange"));

      if (role === "ROLE_ADMIN") navigate("/admin");
      else if (role === "ROLE_SELLER") navigate("/seller");
      else navigate("/");

    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Invalid OTP";
      setErrorMsg(msg);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {errorMsg && (
        <p className="text-red-600 text-sm mb-3">{errorMsg}</p>
      )}

      <input
        type="email"
        placeholder="Enter email"
        className="w-full border p-2 rounded mb-2"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrorMsg("");
        }}
      />

      {!otpSent && (
        <Button
          className="w-full p-2 mt-2"
          variant="contained"
          onClick={handleSendOtp}
        >
          Send OTP
        </Button>
      )}

      {otpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-2 rounded mt-4"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setErrorMsg("");
            }}
          />

          <Button
            className="w-full p-2 mt-4"
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        </>
      )}
    </div>
  );
};

export default LoginForm;

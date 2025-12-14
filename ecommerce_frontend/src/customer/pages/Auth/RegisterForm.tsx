import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import api from '../../../config/api';

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = async () => {
    setErrorMsg("");

    try {
      await api.post("/auth/send/login-signup-otp", {
        email,
        role: "ROLE_CUSTOMER"
      });

      setOtpSent(true);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Something went wrong";
      setErrorMsg(msg);
    }
  };

  const handleSignup = async () => {
    setErrorMsg("");

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        mobile,
        otp
      });

      alert("Account created successfully!");
      console.log(res.data);

    } catch (error: any) {
      const msg = error.response?.data?.message || "Signup failed";
      setErrorMsg(msg);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Register</h1>


      {errorMsg && (
        <p className="text-red-600 text-sm mb-3">{errorMsg}</p>
      )}

      {!otpSent && (
        <>
          <input
            className='w-full border p-2 mb-2'
            placeholder='Name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg("");
            }}
          />

          <input
            className='w-full border p-2 mb-2'
            placeholder='Mobile'
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setErrorMsg("");
            }}
          />

          <input
            className='w-full border p-2 mb-2'
            placeholder='Email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg("");
            }}
          />

          <Button
            variant='contained'
            fullWidth
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        </>
      )}

      {otpSent && (
        <>
          <input
            className='w-full border p-2 mb-2'
            placeholder='Enter OTP'
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setErrorMsg("");
            }}
          />

          <Button
            variant='contained'
            fullWidth
            onClick={handleSignup}
          >
            Create Account
          </Button>
        </>
      )}
    </div>
  );
};

export default RegisterForm;

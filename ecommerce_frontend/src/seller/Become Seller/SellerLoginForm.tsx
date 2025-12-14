import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { loginSeller, clearSellerError } from "../../state/AuthSlice";
import { useNavigate } from "react-router-dom";
import { fetchSellerProfile } from "../../state/seller/sellerProfileSlice";

const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      dispatch(loginSeller(values));
    },
  });

  const handleChange = (e: any) => {
    formik.handleChange(e);
    dispatch(clearSellerError());
  };

 useEffect(() => {
  if (message === "Login successful") {
    dispatch(fetchSellerProfile()); 
    navigate("/seller");
  }
}, [message, navigate, dispatch]);


  return (
    <div>
      <h1 className="text-center text-xl font-bold text-primary-color pb-5">
        Login as Seller
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-5">

        {/* Email */}
        <TextField
          fullWidth
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  fontSize: "14px",
                  opacity: 0.7
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            ),
          }}
        />

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ py: "11px" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default SellerLoginForm;

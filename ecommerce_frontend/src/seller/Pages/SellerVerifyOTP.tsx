import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const SellerVerifyOTP: React.FC = () => {
  const { email, otp } = useParams<{ email?: string; otp?: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (email && otp) {
      const t = setTimeout(() => verify(), 300);
      return () => clearTimeout(t);
    }
  }, [email, otp]);

  const verify = async () => {
    if (!email || !otp) {
      setError("Invalid verification link.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const encodedEmail = encodeURIComponent(email);
      const encodedOtp = encodeURIComponent(otp);

      const url = `http://localhost:8080/api/seller/verify/${encodedEmail}/${encodedOtp}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json().catch(() => null);

      if (res.ok) {
        setStatusMessage("Email verified successfully 🎉 Redirecting to login...");
        setTimeout(() => navigate("/become-seller"), 1500);
      } else {
        setError(body?.error || "Verification failed. Please try again.");
      }

    } catch (err: any) {
      setError("Network error while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-6 max-w-xl mx-auto">
      <Typography variant="h5" gutterBottom>
        Seller Email Verification
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Email: {email}  
        <br />
        OTP: {otp}
      </Typography>

      {loading ? (
        <Box className="flex items-center gap-3">
          <CircularProgress size={20} />
          <Typography>Verifying...</Typography>
        </Box>
      ) : (
        <Box className="space-y-3">
          <Button variant="contained" onClick={verify}>
            Verify Now
          </Button>

          {statusMessage && (
            <Typography color="green">{statusMessage}</Typography>
          )}

          {error && <Typography color="error">{error}</Typography>}
        </Box>
      )}
    </Box>
  );
};

export default SellerVerifyOTP;

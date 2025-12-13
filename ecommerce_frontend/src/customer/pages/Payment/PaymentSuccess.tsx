
import React, { useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { paymentOrderId } = useParams();
  const [query] = useSearchParams();

  const paymentId = query.get("razorpay_payment_id");
  const linkId = query.get("razorpay_payment_link_id");
  const status = query.get("razorpay_payment_link_status");

  useEffect(() => {
    if (!paymentId || !linkId) return;

    const confirmPayment = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const res = await fetch(
          `http://localhost:8080/api/payment/${paymentId}?paymentLinkId=${linkId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          console.log("PAYMENT VERIFIED🔥");
          setTimeout(() => navigate("/account/orders"), 2000);
        } else {
          console.log("Payment verification failed");
        }
      } catch (err) {
        console.log(err);
      }
    };

    confirmPayment();
  }, [paymentId, linkId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>

      <p className="mt-4 text-gray-700">
        Payment ID: <strong>{paymentId}</strong>
      </p>

      <p className="text-gray-700">
        Payment Link ID: <strong>{linkId}</strong>
      </p>

      <p className="text-gray-700">
        Status: <strong>{status}</strong>
      </p>

      <p className="mt-6 text-lg font-medium text-gray-800">
        Verifying your payment… please wait ❤️
      </p>
    </div>
  );
};

export default PaymentSuccess;


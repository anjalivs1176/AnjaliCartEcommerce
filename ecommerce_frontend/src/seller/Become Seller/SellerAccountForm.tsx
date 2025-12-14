
import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box, Button } from "@mui/material";
import { useFormik } from "formik";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const steps = [
  "Tax Details & Mobile",
  "Pickup Address",
  "Bank Details",
  "Supplier Details",
];

const SellerAccountForm = () => {

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      sellerName: "",
      email: "",
      password: "",
      mobile: "",
      gstin: "",

      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
        businessAddress: "",
        logo: null,
        banner: null,
      },

      bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
      },

      pickupAddress: {
        name: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        mobile: "",
      }
    },
    onSubmit: (values) => handleCreateAccount(values)
  });



const handleCreateAccount = async (values: any) => {
  try {
    const { data } = await api.post("/seller", values);

    console.log("SELLER CREATED:", data);
    alert(
      "Seller account created! Check your email for the verification link (it contains the OTP)."
    );
  } catch (error: any) {
    console.error("Error creating seller:", error);
    alert("Signup failed");
  }
};



  const handleStep = (value: number) => {
    if (activeStep === steps.length - 1 && value === 1) {
      formik.handleSubmit();
      return;
    }

    setActiveStep(activeStep + value);
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <section className="mt-20 space-y-10">
        <div>
          {activeStep === 0 && <BecomeSellerFormStep1 formik={formik} />}
          {activeStep === 1 && <BecomeSellerFormStep2 formik={formik} />}
          {activeStep === 2 && <BecomeSellerFormStep3 formik={formik} />}
          {activeStep === 3 && <BecomeSellerFormStep4 formik={formik} />}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => handleStep(-1)}
            variant="contained"
            disabled={activeStep === 0}
          >
            Back
          </Button>

          <Button
            onClick={() => handleStep(1)}
            variant="contained"
          >
            {activeStep === steps.length - 1 ? "Create Account" : "Continue"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SellerAccountForm;


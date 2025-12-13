
import { Box } from "@mui/material";
import { CheckCircle, FiberManualRecord } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

const steps = [
  { name: "Order Placed", description: "We have received your order", value: "PLACED" },
  { name: "Packed", description: "Item packed & ready to ship", value: "CONFIRMED" },
  { name: "Shipped", description: "Your item is on the way", value: "SHIPPED" },
  { name: "Arriving", description: "Out for delivery 🚚", value: "ARRIVING" },
  { name: "Delivered", description: "Delivered successfully 🎉", value: "DELIVERED" },
];

const canceledFlow = [
  { name: "Order Placed", description: "We received your order", value: "PLACED" },
  { name: "Cancelled", description: "Order was cancelled ❌", value: "CANCELLED" },
];

const getStepIndex = (status: string) => {
  return steps.findIndex((s) => s.value === status);
};

const OrderStepper = ({ orderStatus }: any) => {
  const [flow, setFlow] = useState(steps);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (orderStatus === "CANCELLED") {
      setFlow(canceledFlow);
      setCurrentStep(1);
    } else {
      setFlow(steps);
      setCurrentStep(getStepIndex(orderStatus));
    }
  }, [orderStatus]);

  return (
    <Box className="my-10">
      {flow.map((step, index) => (
        <div key={index} className="flex px-4">
          {/* LEFT SIDE DOT + LINE */}
          <div className="flex flex-col items-center">

            <Box
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${index <= currentStep ? "bg-primary-color text-white" : "bg-gray-300 text-gray-600"}
              `}
            >
              {index === currentStep ? (
                <CheckCircle fontSize="small" />
              ) : (
                <FiberManualRecord fontSize="small" />
              )}
            </Box>

            {index < flow.length - 1 && (
              <div
                className={`border h-20 w-[2px] 
                  ${index < currentStep ? "bg-primary-color" : "bg-gray-300"}
                `}
              ></div>
            )}
          </div>

          <div className="ml-3 w-full">
            <div
              className={`
                p-2 rounded-md 
                ${index === currentStep ? "bg-primary-color text-white" : ""}
                ${orderStatus === "CANCELLED" && step.value === "CANCELLED" ? "bg-red-500 text-white" : ""}
              `}
            >
              <p className="font-medium">{step.name}</p>
              <p className={`text-xs ${index === currentStep ? "text-gray-200" : "text-gray-500"}`}>
                {step.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Box>
  );
};

export default OrderStepper;

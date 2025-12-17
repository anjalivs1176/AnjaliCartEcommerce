import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from "@mui/material";
import React from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import PricingCard from "../Cart/PricingCard";
import api from "../../../config/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const paymentGatewayList = [
  {
    value: "RAZORPAY",
    image:
      "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png",
    label: "",
  },
  {
    value: "STRIPE",
    image: "https://logo.svgcdn.com/logos/stripe.png",
    label: "",
  },
];

const Checkout = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [paymentGateway, setPaymentGateway] = React.useState("RAZORPAY");
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] =
    React.useState<number | null>(null);
  const [cart, setCart] = React.useState<any>(null);

  const handlePaymentChange = (event: any) => {
    setPaymentGateway(event.target.value);
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/address");
      setAddresses(data);

      if (data.length > 0 && selectedAddressIndex === null) {
        setSelectedAddressIndex(0);
      }
    } catch (err) {
      console.log("Error fetching addresses:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");

      if (!data.cartItems || data.cartItems.length === 0) {
        setCart({
          cartItems: [],
          totalMrpPrice: 0,
          totalSellingPrice: 0,
          baseDiscountAmount: 0,
          couponDiscountAmount: 0,
          couponCode: null,
        });
        return;
      }

      setCart(data);
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  };

  const handleCheckout = async () => {
    if (selectedAddressIndex === null) {
      alert("Please select an address");
      return;
    }

    const selectedAddress = addresses[selectedAddressIndex];

    try {
      const { data } = await api.post(
        `/orders?paymentMethod=${paymentGateway}`,
        selectedAddress
      );

      if (data?.payment_link_url) {
        window.location.href = data.payment_link_url;
      } else {
        alert("Payment link could not be generated.");
      }
    } catch (err) {
      console.log("Checkout error:", err);
    }
  };

  React.useEffect(() => {
    fetchAddresses();
    fetchCart();
  }, []);

  return (
    <>
      <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
        <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
          <div className="col-span-2 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address</h1>
              <Button onClick={handleOpen}>Add new Address</Button>
            </div>

            <div className="text-xs font-medium space-y-5">
              <p>Saved Addresses</p>

              <div className="space-y-3">
                {addresses.length > 0 ? (
                  addresses.map((item, idx) => (
                    <AddressCard
                      key={idx}
                      index={idx}
                      address={item}
                      selectedIndex={selectedAddressIndex}
                      onSelect={() => setSelectedAddressIndex(idx)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No saved addresses.</p>
                )}
              </div>
            </div>

            <div className="py-4 px-5 rounded-md border">
              <Button onClick={handleOpen}>Add new Address</Button>
            </div>
          </div>

          <div>
            <div className="space-y-3 border p-5 rounded-md">
              <h1 className="text-primary-color font-medium pb-2 text-center">
                Choose Payment Gateway
              </h1>

              <RadioGroup
                row
                onChange={handlePaymentChange}
                value={paymentGateway}
              >
                {paymentGatewayList.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    className="w-[45%]"
                    value={item.value}
                    control={<Radio />}
                    label={
                      <img className="object-cover" src={item.image} />
                    }
                  />
                ))}
              </RadioGroup>
            </div>

            <div className="border rounded-md w-full">
              <PricingCard cart={cart} />
              <div className="p-5">
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ py: "11px" }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <AddressForm onSave={fetchAddresses} onClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default Checkout;

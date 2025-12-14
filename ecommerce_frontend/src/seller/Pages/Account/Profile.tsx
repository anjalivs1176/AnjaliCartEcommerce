import React, { useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import ProfileFieldCard from "../../../component/ProfileFieldCard";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import {
  fetchSellerProfile,
  updateSellerProfile,
} from "../../../state/seller/sellerProfileSlice";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { seller, loading } = useAppSelector((state) => state.sellerProfile);

  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleSave = () => {
    dispatch(updateSellerProfile(formData));
    setOpen(false);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     dispatch(fetchSellerProfile(token));
  //   }
  // }, [dispatch]);


  useEffect(() => {
  dispatch(fetchSellerProfile());
}, [dispatch]);


  if (loading || !seller) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  // RENDER SECTION CARDS
  const profileData = {
    "Seller Name": seller.sellerName,
    "Seller Email": seller.email,
    "Seller Mobile": seller.mobile,
    "Account Status": seller.accountStatus,
  };

  const businessDetails = {
    "Business Name": seller.businessDetails?.businessName || "--",
    "Business Email": seller.businessDetails?.businessEmail || "--",
    "Business Mobile": seller.businessDetails?.businessMobile || "--",
  };

const pickupAddress: Record<string, string> = {
  Address: seller.pickupAddress?.address || "--",
  Locality: seller.pickupAddress?.locality || "--",
  City: seller.pickupAddress?.city || "--",
  State: seller.pickupAddress?.state || "--",
  Pincode: seller.pickupAddress?.pinCode || "--",
  Mobile: seller.pickupAddress?.mobile || "--",
};


const bankDetails: Record<string, string> = {
  "Account Holder Name": seller.bankDetails?.accountHolderName || "--",
  "Account Number": seller.bankDetails?.accountNumber || "--",
  IFSC: seller.bankDetails?.ifscCode || "--",
};


  const renderSection = (title: string, data: Record<string, string>) => (
    <Box className="mt-6 p-4 bg-blue-50 rounded-lg shadow-md">
      <Box className="flex items-center justify-between mb-3">
        <Typography variant="h6">{title}</Typography>

        <IconButton
          onClick={() => {
            setActiveSection(title);
            setFormData({});
            setOpen(true);
          }}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>

      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <ProfileFieldCard key={key} keys={key} value={value} />
        ))}
      </div>
    </Box>
  );

  // 🔥 FIXED — Proper nested formData updates
  const renderModalFields = () => {
    switch (activeSection) {
      case "Profile Details":
        return (
          <>
            <TextField
              label="Seller Name"
              fullWidth
              margin="normal"
              defaultValue={seller.sellerName}
              onChange={(e) =>
                setFormData({ ...formData, sellerName: e.target.value })
              }
            />

            <TextField
              label="Seller Email"
              fullWidth
              margin="normal"
              defaultValue={seller.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <TextField
              label="Seller Mobile"
              fullWidth
              margin="normal"
              defaultValue={seller.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />
          </>
        );

      case "Business Details":
        return (
          <>
            <TextField
              label="Business Name"
              fullWidth
              margin="normal"
              defaultValue={seller.businessDetails.businessName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  businessDetails: {
                    ...formData.businessDetails,
                    businessName: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="Business Email"
              fullWidth
              margin="normal"
              defaultValue={seller.businessDetails.businessEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  businessDetails: {
                    ...formData.businessDetails,
                    businessEmail: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="Business Mobile"
              fullWidth
              margin="normal"
              defaultValue={seller.businessDetails.businessMobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  businessDetails: {
                    ...formData.businessDetails,
                    businessMobile: e.target.value,
                  },
                })
              }
            />
          </>
        );

      case "Pickup Address":
        return (
          <>
            <TextField
              label="Address"
              fullWidth
              defaultValue={seller.pickupAddress.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickupAddress: {
                    ...formData.pickupAddress,
                    address: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="Locality"
              fullWidth
              defaultValue={seller.pickupAddress.locality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickupAddress: {
                    ...formData.pickupAddress,
                    locality: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="City"
              fullWidth
              defaultValue={seller.pickupAddress.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickupAddress: {
                    ...formData.pickupAddress,
                    city: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="State"
              fullWidth
              defaultValue={seller.pickupAddress.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickupAddress: {
                    ...formData.pickupAddress,
                    state: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="Pin Code"
              fullWidth
              defaultValue={seller.pickupAddress.pinCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickupAddress: {
                    ...formData.pickupAddress,
                    pinCode: e.target.value,
                  },
                })
              }
            />
          </>
        );

      case "Bank Details":
        return (
          <>
            <TextField
              label="Account Holder Name"
              fullWidth
              defaultValue={seller.bankDetails.accountHolderName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: {
                    ...formData.bankDetails,
                    accountHolderName: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="Account Number"
              fullWidth
              defaultValue={seller.bankDetails.accountNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: {
                    ...formData.bankDetails,
                    accountNumber: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="IFSC Code"
              fullWidth
              defaultValue={seller.bankDetails.ifscCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bankDetails: {
                    ...formData.bankDetails,
                    ifscCode: e.target.value,
                  },
                })
              }
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto space-y-6">
      <div className="flex justify-center mb-6">
        <Avatar
          src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
          sx={{ width: 80, height: 80 }}
        />
      </div>

      {renderSection("Profile Details", profileData)}
      {renderSection("Business Details", businessDetails)}
      {renderSection("Pickup Address", pickupAddress)}
      {renderSection("Bank Details", bankDetails)}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit {activeSection}</DialogTitle>
        <DialogContent dividers>{renderModalFields()}</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;

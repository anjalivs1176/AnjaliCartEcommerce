
import { Box, Grid, TextField } from "@mui/material";
import React from "react";

const BecomeSellerFormStep4 = ({ formik }: any) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="businessDetails.businessName"
            label="Business Name"
            value={formik.values.businessDetails.businessName}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="businessDetails.businessEmail"
            label="Business Email"
            value={formik.values.businessDetails.businessEmail}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="businessDetails.businessMobile"
            label="Business Mobile"
            value={formik.values.businessDetails.businessMobile}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="businessDetails.businessAddress"
            label="Business Address"
            value={formik.values.businessDetails.businessAddress}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <input
            type="file"
            name="businessDetails.logo"
            onChange={(e) => formik.setFieldValue("businessDetails.logo", e.target.files?.[0] || null)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <input
            type="file"
            name="businessDetails.banner"
            onChange={(e) => formik.setFieldValue("businessDetails.banner", e.target.files?.[0] || null)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="sellerName"
            label="Seller Name"
            value={formik.values.sellerName}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="password"
            type="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BecomeSellerFormStep4;
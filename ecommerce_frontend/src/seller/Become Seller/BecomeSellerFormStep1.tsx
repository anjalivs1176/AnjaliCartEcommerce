
import React from "react";
import { Box, TextField } from "@mui/material";

const BecomeSellerFormStep1 = ({ formik }: any) => {
  return (
    <Box>
      <div className="space-y-9">
        <TextField
          fullWidth
          name="mobile"
          label="Mobile"
          value={formik.values.mobile}
          onChange={formik.handleChange}
        />
        <TextField
          fullWidth
          name="gstin"
          label="GSTIN"
          value={formik.values.gstin}
          onChange={formik.handleChange}
        />
      </div>
    </Box>
  );
};

export default BecomeSellerFormStep1;
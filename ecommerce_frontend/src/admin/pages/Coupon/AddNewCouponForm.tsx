import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, Grid, TextField } from '@mui/material';
import { adminApi } from '../../services/adminApi';

interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
}

const AddNewCouponForm = () => {
  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: "",
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0
    },

    onSubmit: async (values, { resetForm }) => {
      const body = {
        code: values.code,
        discountPercentage: values.discountPercentage,
        validityStratDate: values.validityStartDate?.format("YYYY-MM-DD"),
        validityEndDate: values.validityEndDate?.format("YYYY-MM-DD"),
        minimumOrderValue: values.minimumOrderValue,
        active: true
      };

      try {
        await adminApi.createCoupon(body);
        alert("Coupon created successfully!");
        resetForm();
      } catch (err) {
        console.error("Error creating coupon:", err);
        alert("Failed to create coupon");
      }
    }
  });

  return (
    <div>
      <h1 className='text-2xl font-bold text-primary-color pb-5 text-center'>
        Create New Coupon
      </h1>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component={"form"} onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                name="code"
                label="Coupon Code"
                value={formik.values.code}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                fullWidth
                name="discountPercentage"
                label="Discount %"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <DatePicker
                label="Start Date"
                value={formik.values.validityStartDate}
                onChange={(newValue) =>
                  formik.setFieldValue("validityStartDate", newValue)
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <DatePicker
                label="End Date"
                value={formik.values.validityEndDate}
                onChange={(newValue) =>
                  formik.setFieldValue("validityEndDate", newValue)
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                name="minimumOrderValue"
                label="Minimum Order Value"
                value={formik.values.minimumOrderValue}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <Button type="submit" variant='contained' fullWidth sx={{ py: ".8rem" }}>
                Create Coupon
              </Button>
            </Grid>

          </Grid>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default AddNewCouponForm;

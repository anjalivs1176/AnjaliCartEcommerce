import {
  Box, Button, FormControl, InputLabel, MenuItem,
  Select, TextField, Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";

const CreateDealForm = ({ onCreated }: any) => {
  const [categories, setCategories] = useState<any[]>([]);

  // Load categories from backend
  useEffect(() => {
    adminApi.getHomeCategories().then((res:any) => setCategories(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      image: "",
      discount: 0,
      categoryId: "",
    },
    onSubmit: async (values) => {
      try {
        await adminApi.createDeal(values);
        alert("Deal Created!");
        if (onCreated) onCreated();
      } catch (err) {
        console.log(err);
        alert("Failed to create deal");
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="space-y-6">
      <Typography variant="h4" className="text-center">
        Create Deal
      </Typography>

      <TextField
        fullWidth
        name="title"
        label="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
      />

      <TextField
        fullWidth
        name="image"
        label="Image URL"
        value={formik.values.image}
        onChange={formik.handleChange}
      />

      <TextField
        fullWidth
        name="discount"
        label="Discount %"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
      />
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          name="categoryId"
          value={formik.values.categoryId}
          label="Category"
          onChange={formik.handleChange}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.categoryId}>
              {cat.categoryId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button fullWidth sx={{ py: ".9rem" }} type="submit" variant="contained">
        Create Deal
      </Button>
    </Box>
  );
};

export default CreateDealForm;

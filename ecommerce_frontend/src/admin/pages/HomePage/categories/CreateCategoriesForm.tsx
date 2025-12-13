import {
  Box, Button, TextField, Typography
} from "@mui/material";
import { useFormik } from "formik";
import { adminApi } from "../../../services/adminApi";

const CreateCategoriesForm = () => {

  const formik = useFormik({
    initialValues: {
      name: "",
      parentCategoryId: "",
      categoryId: "",
      level: 1,
      image: "",
      discount: 0
    },

    onSubmit: async (values) => {
      try {
        await adminApi.createCategory(values);
        alert("Category Created!");
      } catch (err) {
        console.log(err);
        alert("Failed to create Category");
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="space-y-6">

      <Typography variant="h4" className="text-center">
        Create Category
      </Typography>

      <TextField
        fullWidth
        name="name"
        label="Category Name"
        value={formik.values.name}
        onChange={formik.handleChange}
      />

      <TextField
        fullWidth
        name="parentCategoryId"
        label="Parent Category ID"
        placeholder="e.g. men_topwear"
        value={formik.values.parentCategoryId}
        onChange={formik.handleChange}
      />


      <TextField
        fullWidth
        name="categoryId"
        label="Category ID (slug)"
        placeholder="e.g. women_saree"
        value={formik.values.categoryId}
        onChange={formik.handleChange}
      />

      <TextField
        fullWidth
        name="level"
        type="number"
        label="Level (1, 2, or 3)"
        value={formik.values.level}
        onChange={formik.handleChange}
      />

      <TextField
        fullWidth
        name="image"
        label="Image URL"
        placeholder="https://example.com/cat.jpg"
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


      <Button fullWidth type="submit" variant="contained" sx={{ py: ".9rem" }}>
        Create Category
      </Button>
    </Box>
  );
};

export default CreateCategoriesForm;

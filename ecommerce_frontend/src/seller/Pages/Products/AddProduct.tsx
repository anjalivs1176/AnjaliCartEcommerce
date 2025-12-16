import {
  AddPhotoAlternate,
  Close
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { uploadToCloudinary } from "../../../Util/uploadToCloudinary";

import { menLevelTwo } from "../../../data/category/level2/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level2/womenLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/level2/furnitureLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/level2/electroniscLevelTwo";

import { menLevelThree } from "../../../data/category/level3/menLevelThree";
import { womenLevelThree } from "../../../data/category/level3/womenLevelThree";
import { furnitureLevelThree } from "../../../data/category/level3/furnitureLevelThree";
import { electronicsLevelThree } from "../../../data/category/level3/electronicsLevelThree";

import { colors } from "../../../data/Filter/color";
import { mainCategory } from "../../../data/category/mainCategory";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../state/store";
import { createProduct } from "../../../state/seller/sellerProductSlice";

const categoryTwo: Record<string, any[]> = {
  men: menLevelTwo,
  women: womenLevelTwo,
  kids: [],
  home_furniture: furnitureLevelTwo,
  beauty: [],
  electronics: electronicsLevelTwo
};

const categoryThree: Record<string, any[]> = {
  men: menLevelThree,
  women: womenLevelThree,
  kids: [],
  home_furniture: furnitureLevelThree,
  beauty: [],
  electronics: electronicsLevelThree
};

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const sellerProduct = useSelector((state: any) => state.sellerProduct);

  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrp_price: "",
      sellingPrice: "",
      colors: "",
      sizes: "",
      image: [],
      category: "",
      categoryTwo: "",
      categoryThree: ""
    },
    onSubmit: (values) => {
      const payload = {
        title: values.title,
        description: values.description,
        mrpPrice: Number(values.mrp_price),
        sellingPrice: Number(values.sellingPrice),
        color: values.colors,
        images: values.image,
        category: values.category,
        category2: values.categoryTwo,
        category3: values.categoryThree,
        size: values.sizes
      };

      dispatch(createProduct({ request: payload }));
    }
  });
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const uploaded = await uploadToCloudinary(file);
    formik.setFieldValue("image", [...formik.values.image, uploaded]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formik.values.image];
    updated.splice(index, 1);
    formik.setFieldValue("image", updated);
  };

  useEffect(() => {
    if (!sellerProduct.loading) {
      if (sellerProduct.error || sellerProduct.success) {
        setOpenSnackbar(true);
      }

      if (sellerProduct.success) {
        formik.resetForm();
      }
    }
  }, [sellerProduct.loading, sellerProduct.success, sellerProduct.error]);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div className="p-4">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Grid container spacing={2}>

          <Grid size={{ xs: 12 }} className="flex flex-wrap gap-5">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label htmlFor="fileInput" className="relative">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                <AddPhotoAlternate className="text-gray-700" />
              </span>

              {uploadImage && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <CircularProgress />
                </div>
              )}
            </label>

            {/* Show Images */}
            <div className="flex flex-wrap gap-2">
              {formik.values.image.map((img, index) => (
                <div key={index} className="relative">
                  <img className="w-24 h-24 object-cover" src={img} />

                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    size="small"
                    color="error"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <Close sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              name="mrp_price"
              label="MRP Price"
              value={formik.values.mrp_price}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              name="sellingPrice"
              label="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Color</InputLabel>
              <Select
                name="colors"
                label="Color"
                value={formik.values.colors}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {colors.map((c, i) => (
                  <MenuItem key={i} value={c.name}>
                    <div className="flex gap-3 items-center">
                      <span
                        style={{ backgroundColor: c.hex }}
                        className={`h-5 w-5 rounded-full ${c.name === "white" ? "border" : ""
                          }`}
                      />
                      <p>{c.name}</p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Size</InputLabel>
              <Select
                name="sizes"
                label="Size"
                value={formik.values.sizes}
                onChange={formik.handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {sizeOptions.map((s, i) => (
                  <MenuItem key={i} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
              >
                {mainCategory.map((item, i) => (
                  <MenuItem key={i} value={item.categoryId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl
              fullWidth
              required
              disabled={!formik.values.category}
            >
              <InputLabel>Sub Category</InputLabel>
              <Select
                name="categoryTwo"
                label="Sub Category"
                value={formik.values.categoryTwo}
                onChange={formik.handleChange}
              >
                {(categoryTwo[formik.values.category] || []).map(
                  (item, i) => (
                    <MenuItem key={i} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl
              fullWidth
              required
              disabled={!formik.values.categoryTwo}
            >
              <InputLabel>Sub Sub Category</InputLabel>
              <Select
                name="categoryThree"
                label="Sub Sub Category"
                value={formik.values.categoryThree}
                onChange={formik.handleChange}
              >
                {(categoryThree[formik.values.category] || [])
                  .filter(
                    (item) =>
                      item.parentCategoryId === formik.values.categoryTwo
                  )
                  .map((item, i) => (
                    <MenuItem key={i} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ p: "14px" }}
              disabled={sellerProduct.loading}
            >
              {sellerProduct.loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Add Product"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={sellerProduct.error ? "error" : "success"}
          variant="filled"
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {sellerProduct.error
            ? sellerProduct.error
            : "Product Created Successfully 🎉"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProduct;

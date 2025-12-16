import {
  AddPhotoAlternate,
  Close
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
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
import { useParams, useNavigate } from "react-router-dom";

import api from "../../../config/api";
import { uploadToCloudinary } from "../../../Util/uploadToCloudinary";
import { useAppDispatch } from "../../../state/store";
import { updateProduct } from "../../../state/seller/sellerProductSlice";

/* CATEGORY DATA */
import { mainCategory } from "../../../data/category/mainCategory";
import { menLevelTwo } from "../../../data/category/level2/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level2/womenLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/level2/furnitureLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/level2/electroniscLevelTwo";

import { menLevelThree } from "../../../data/category/level3/menLevelThree";
import { womenLevelThree } from "../../../data/category/level3/womenLevelThree";
import { furnitureLevelThree } from "../../../data/category/level3/furnitureLevelThree";
import { electronicsLevelThree } from "../../../data/category/level3/electronicsLevelThree";
import { Product } from "../../../type/productType";

import { colors } from "../../../data/Filter/color";

const categoryTwo = {
  men: menLevelTwo,
  women: womenLevelTwo,
  kids: [],
  home_furniture: furnitureLevelTwo,
  beauty: [],
  electronics: electronicsLevelTwo
};

const categoryThree = {
  men: menLevelThree,
  women: womenLevelThree,
  kids: [],
  home_furniture: furnitureLevelThree,
  beauty: [],
  electronics: electronicsLevelThree
};

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
const { productId: pid } = useParams<{ productId: string }>();
const productId = Number(pid);

const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/seller/products/${productId}`);
        setProduct(res.data);
      } catch (e) {
        console.error("Error loading product", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  /* ---------------- FORMIK ---------------- */
const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    title: product?.title || "",
    description: product?.description || "",
    mrp_price: product?.mrpPrice || "",
    sellingPrice: product?.sellingPrice || "",
    colors: product?.color || "",
    sizes: product?.sizes || "",
    image: product?.images || [],
    category:
      product?.category?.parentCategory?.parentCategory?.categoryId || "",
    categoryTwo: product?.category?.parentCategory?.categoryId || "",
    categoryThree: product?.category?.categoryId || ""
  },

  onSubmit: async (values) => {
    // ✅ GUARD (important)
    if (!productId || !values.categoryThree) {
      alert("Invalid product or category");
      return;
    }

    // ✅ FIX: convert categoryId to NUMBER
    const payload = {
      title: values.title,
      description: values.description,
      mrpPrice: Number(values.mrp_price),
      sellingPrice: Number(values.sellingPrice),
      color: values.colors,
      images: values.image,
      sizes: values.sizes,
      categoryId: Number(values.categoryThree)
    };

    // ✅ productId is number here
    await dispatch(updateProduct({ productId, request: payload }));

    setSnackbarOpen(true);
    navigate("/seller/products");
  }
});


  /* ---------------- IMAGE HANDLERS ---------------- */
  const handleImageUpload = async (e:any) => {
    if (!e.target.files?.[0]) return;

    setUploadingImage(true);
    const url = await uploadToCloudinary(e.target.files[0]);
    setUploadingImage(false);

    formik.setFieldValue("image", [...formik.values.image, url]);
  };

  const handleRemoveImage = (index:any) => {
    formik.setFieldValue(
      "image",
      formik.values.image.filter((_, i:any) => i !== index)
    );
  };

  if (loading) return <p className="p-10 text-center">Loading product…</p>;

  /* ---------------- JSX ---------------- */
  return (
    <div className="p-4">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-xl font-semibold mb-3">Edit Product</h2>
        <Divider className="mb-4" />

        <Grid container spacing={2}>
          {/* IMAGES */}
          <Grid size={{ xs: 12 }} className="flex flex-wrap gap-4">
            <input hidden type="file" id="fileInput" onChange={handleImageUpload} />
            <label htmlFor="fileInput">
              <div className="w-24 h-24 border rounded flex items-center justify-center cursor-pointer">
                <AddPhotoAlternate />
                {uploadingImage && <CircularProgress size={22} />}
              </div>
            </label>

            {formik.values.image.map((img:any, i:any) => (
              <div key={i} className="relative">
                <img src={img} className="w-24 h-24 object-cover rounded" />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveImage(i)}
                  sx={{ position: "absolute", top: 0, right: 0 }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </div>
            ))}
          </Grid>

          {/* TITLE */}
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Title" name="title" value={formik.values.title} onChange={formik.handleChange} />
          </Grid>

          {/* DESCRIPTION */}
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth multiline rows={4} label="Description" name="description" value={formik.values.description} onChange={formik.handleChange} />
          </Grid>

          {/* PRICES */}
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth type="number" label="MRP Price" name="mrp_price" value={formik.values.mrp_price} onChange={formik.handleChange} />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField fullWidth type="number" label="Selling Price" name="sellingPrice" value={formik.values.sellingPrice} onChange={formik.handleChange} />
          </Grid>

          {/* COLOR */}
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select name="colors" value={formik.values.colors} onChange={formik.handleChange}>
                {colors.map((c, i) => (
                  <MenuItem key={i} value={c.name}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* SIZE */}
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select name="sizes" value={formik.values.sizes} onChange={formik.handleChange}>
                {sizeOptions.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* CATEGORY */}
          <Grid size={{ xs: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={formik.values.category} onChange={formik.handleChange}>
                {mainCategory.map((c) => (
                  <MenuItem key={c.categoryId} value={c.categoryId}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <FormControl fullWidth disabled={!formik.values.category}>
              <InputLabel>Sub Category</InputLabel>
              <Select
  name="categoryTwo"
  value={formik.values.categoryTwo}
  onChange={formik.handleChange}
>
  {(
    (categoryTwo as Record<string, any[]>)[formik.values.category] || []
  ).map((c: any) => (
    <MenuItem key={c.categoryId} value={c.categoryId}>
      {c.name}
    </MenuItem>
  ))}
</Select>

            </FormControl>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <FormControl fullWidth disabled={!formik.values.categoryTwo}>
              <InputLabel>Sub Sub Category</InputLabel>
              <Select
  name="categoryThree"
  value={formik.values.categoryThree}
  onChange={formik.handleChange}
>
  {(
    (categoryThree as Record<string, any[]>)[formik.values.category] || []
  )
    .filter((c: any) => c.parentCategoryId === formik.values.categoryTwo)
    .map((c: any) => (
      <MenuItem key={c.categoryId} value={c.categoryId}>
        {c.name}
      </MenuItem>
    ))}
</Select>

            </FormControl>
          </Grid>

          {/* SUBMIT */}
          <Grid size={{ xs: 12 }}>
            <Button fullWidth type="submit" variant="contained">
              Update Product
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={3000}>
        <Alert severity="success" variant="filled">
          Product Updated Successfully 🎉
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditProduct;

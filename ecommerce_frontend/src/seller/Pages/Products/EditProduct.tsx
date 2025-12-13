import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { uploadToCloudinary } from "../../../Util/uploadToCloudinary";

import { api } from "../../../config/api";
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

import { colors } from "../../../data/Filter/color";

const categoryTwo: any = {
  men: menLevelTwo,
  women: womenLevelTwo,
  kids: [],
  home_furniture: furnitureLevelTwo,
  beauty: [],
  electronics: electronicsLevelTwo,
};

const categoryThree: any = {
  men: menLevelThree,
  women: womenLevelThree,
  kids: [],
  home_furniture: furnitureLevelThree,
  beauty: [],
  electronics: electronicsLevelThree,
};

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* ---------------- FETCH PRODUCT BY ID ---------------- */
  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/api/sellers/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Product:", res.data);

      setProduct(res.data);
    } catch (error) {
      console.log("❌ Error loading product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      colors: "",
      image: [],
      category: "",
      categoryTwo: "",
      categoryThree: "",
      sizes: "",
    },

    onSubmit: async (values) => {
      const payload = {
        title: values.title,
        description: values.description,
        mrpPrice: Number(values.mrpPrice),
        sellingPrice: Number(values.sellingPrice),
        color: values.colors,
        images: values.image,
        sizes: values.sizes,
        categoryId: values.categoryThree,
      };

      console.log("UPDATE PAYLOAD:", payload);

      await dispatch(updateProduct({ productId, request: payload }));

      alert("Product updated successfully!");
      navigate("/seller/products");
    },
  });
  useEffect(() => {
    if (!product) return;

    const mainCat = product.category?.parentCategory?.parentCategory?.categoryId;
    const subCat = product.category?.parentCategory?.categoryId;
    const subSubCat = product.category?.categoryId;

    formik.setValues({
      title: product.title,
      description: product.description,
      mrpPrice: product.mrpPrice,
      sellingPrice: product.sellingPrice,
      colors: product.color,
      image: product.images || [],

      category: mainCat || "",
      categoryTwo: subCat || "",
      categoryThree: subSubCat || "",

      sizes: product.sizes,
    });
  }, [product]);

  const handleImageUpload = async (e: any) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setUploadingImage(true);
    const url = await uploadToCloudinary(file);
    setUploadingImage(false);

    formik.setFieldValue("image", [...formik.values.image, url]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = formik.values.image.filter((_: any, i: number) => i !== index);
    formik.setFieldValue("image", updated);
  };

  if (loading) return <p className="p-10 text-center">Loading product…</p>;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold pb-3">Edit Product</h2>
      <Divider />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} className="flex gap-4 flex-wrap">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <label htmlFor="fileInput" className="relative">
            <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md">
              <AddPhotoAlternate />
            </span>

            {uploadingImage && (
              <div className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center">
                <CircularProgress />
              </div>
            )}
          </label>

          {formik.values.image.map((img: string, index: number) => (
            <div key={index} className="relative">
              <img src={img} alt="product" className="w-24 h-24 rounded object-cover" />

              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveImage(index)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <Close sx={{ fontSize: "1rem" }} />
              </IconButton>
            </div>
          ))}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Title" name="title" value={formik.values.title} onChange={formik.handleChange} required />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={3} label="Description" name="description" value={formik.values.description} onChange={formik.handleChange} required />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField fullWidth label="MRP Price" name="mrpPrice" type="number" value={formik.values.mrpPrice} onChange={formik.handleChange} required />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField fullWidth label="Selling Price" name="sellingPrice" type="number" value={formik.values.sellingPrice} onChange={formik.handleChange} required />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Color</InputLabel>
            <Select value={formik.values.colors} name="colors" label="Color" onChange={formik.handleChange}>
              {colors.map((c: any, i: number) => (
                <MenuItem key={i} value={c.name}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Main Category</InputLabel>
            <Select value={formik.values.category} name="category" label="Main Category" onChange={formik.handleChange}>
              {mainCategory.map((cat, i) => (
                <MenuItem key={i} value={cat.categoryId}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth disabled={!formik.values.category}>
            <InputLabel>Sub Category</InputLabel>
            <Select value={formik.values.categoryTwo} name="categoryTwo" label="Sub Category" onChange={formik.handleChange}>
              {(categoryTwo[formik.values.category] || []).map((sub: any) => (
                <MenuItem key={sub.categoryId} value={sub.categoryId}>{sub.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth disabled={!formik.values.categoryTwo}>
            <InputLabel>Sub Sub Category</InputLabel>
            <Select
              value={formik.values.categoryThree}
              name="categoryThree"
              label="Sub Sub Category"
              onChange={formik.handleChange}
            >
              {(categoryThree[formik.values.category] || [])
                .filter((c: any) => c.parentCategoryId === formik.values.categoryTwo)
                .map((sub: any) => (
                  <MenuItem key={sub.categoryId} value={sub.categoryId}>
                    {sub.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField fullWidth label="Size" name="sizes" value={formik.values.sizes} onChange={formik.handleChange} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button fullWidth variant="contained" type="submit">
            Update Product
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditProduct;

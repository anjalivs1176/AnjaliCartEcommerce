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
  const params = useParams<{ productId: string }>();
  const productId = params.productId ? Number(params.productId) : null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  const fetchProduct = async () => {
    if (!productId) return;

    try {
      const res = await api.get(`/sellers/products/${productId}`);
      setProduct(res.data);
    } catch (error) {
      console.error("❌ Error loading product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      colors: "",
      image: [] as string[],
      category: "",
      categoryTwo: "",
      categoryThree: "",
      sizes: "",
    },

    onSubmit: async (values) => {
      if (!productId) {
        alert("Invalid product ID");
        return;
      }

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
      title: product.title || "",
      description: product.description || "",
      mrpPrice: product.mrpPrice || "",
      sellingPrice: product.sellingPrice || "",
      colors: product.color || "",
      image: product.images || [],
      category: mainCat || "",
      categoryTwo: subCat || "",
      categoryThree: subSubCat || "",
      sizes: product.sizes || "",
    });
  }, [product]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploadingImage(true);
    const url = await uploadToCloudinary(e.target.files[0]);
    setUploadingImage(false);

    formik.setFieldValue("image", [...formik.values.image, url]);
  };

  const handleRemoveImage = (index: number) => {
    formik.setFieldValue(
      "image",
      formik.values.image.filter((_, i) => i !== index)
    );
  };

  if (loading) return <p className="p-10 text-center">Loading product…</p>;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold pb-3">Edit Product</h2>
      <Divider />

      <Grid container spacing={2}>
        <Grid xs={12} className="flex gap-4 flex-wrap">
          <input
            type="file"
            accept="image/*"
            hidden
            id="fileInput"
            onChange={handleImageUpload}
          />

          <label htmlFor="fileInput">
            <div className="w-24 h-24 border rounded-md flex items-center justify-center cursor-pointer">
              <AddPhotoAlternate />
              {uploadingImage && <CircularProgress size={24} />}
            </div>
          </label>

          {formik.values.image.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} className="w-24 h-24 rounded object-cover" />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveImage(index)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <Close fontSize="small" />
              </IconButton>
            </div>
          ))}
        </Grid>

        <Grid xs={12}>
          <Button fullWidth variant="contained" type="submit">
            Update Product
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditProduct;

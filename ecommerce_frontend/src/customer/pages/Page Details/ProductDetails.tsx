import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { teal } from "@mui/material/colors";
import { Button, Divider } from "@mui/material";
import {
  Add,
  AddShoppingCart,
  FavoriteBorder,
  Remove,
} from "@mui/icons-material";
import SimilarProduct from "./SimilarProduct";
import ReviewCard from "../Review/ReviewCard";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { fetchProductById } from "../../../state/customer/ProductSlice";
import { fetchReviews, deleteReview } from "../../../state/reviews/reviewSlice";
import AddReviewForm from "../Review/AddReviewForm";
import { jwtDecode } from "jwt-decode";
import api from "../../../config/api";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { product } = useAppSelector((store) => store);
  const { reviews } = useAppSelector((store) => store.reviews);

  const authSlice = useAppSelector((state) => state.auth);
  const authUser = authSlice.user;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const token = localStorage.getItem("token") || "";
  let currentUserId: number | null = null;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      currentUserId = decoded.id;
    } catch {}
  }

  useEffect(() => {
    dispatch(fetchProductById(Number(productId)));
  }, [productId]);



useEffect(() => {
  if (product.product?.id) {
    dispatch(fetchReviews(product.product.id));
    checkIfInCart();
    checkWishlist();

    console.log("SIZES 👉", product.product.sizes);
  }
}, [product.product]);



  useEffect(() => {
    if (product.product?.id) {
      dispatch(fetchReviews(product.product.id));
      checkIfInCart();
      checkWishlist();

      // ✅ AUTO-SET SIZE (IMPORTANT FIX)
      if (product.product.sizes) {
        setSelectedSize(product.product.sizes);
      }
    }
  }, [product.product]);

  useEffect(() => {
    if (location.hash === "#write-review-section") {
      setTimeout(() => {
        document
          .getElementById("write-review-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [location]);

  const handleActiveImage = (value: number) => () => {
    setActiveImage(value);
  };

  const checkIfInCart = async () => {
    try {
      const { data } = await api.get("/cart");
      const exists = data.cartItems?.some(
        (item: any) => item.product.id === product.product?.id
      );
      setIsInCart(!!exists);
    } catch {}
  };

const handleAddToCart = async () => {
  if (!product.product) return;

  const sizeToSend =
    selectedSize || product.product.sizes || "DEFAULT";

  try {
    await api.put("/cart/add", {
      productId: product.product.id,
      size: sizeToSend,
      quantity,
    });

    setIsInCart(true);
  } catch (err) {
    console.error("Add to cart failed", err);
  }
};


  const checkWishlist = async () => {
    try {
      const { data } = await api.get("/wishlist");
      const exists = data?.products?.some(
        (p: any) => p.id === product.product?.id
      );
      setIsInWishlist(!!exists);
    } catch {}
  };

  const handleToggleWishlist = async () => {
    try {
      if (!product.product?.id) return;
      await api.post(`/wishlist/add-product/${product.product.id}`);
      setIsInWishlist((prev) => !prev);
    } catch {}
  };

  // ✅ IMAGE FALLBACK
  const imageSrc =
    product.product?.images?.[activeImage] ||
    product.product?.category?.image ||
    "/placeholder.png";

  return (
    <div className="px-5 lg:px-20 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
            {(product.product?.images?.length
              ? product.product.images
              : [product.product?.category?.image]
            ).map((item, index) => (
              <img
                key={index}
                onClick={handleActiveImage(index)}
                className="lg:w-full w-[50px] cursor-pointer rounded-md"
                src={item}
              />
            ))}
          </div>

          <div className="w-full h-full lg:w-[85%]">
            <img className="w-full rounded-md" src={imageSrc} />
          </div>
        </section>

        <section>
          <h1 className="font-bold text-lg text-primary-color">
            {product.product?.seller?.businessDetails.businessName}
          </h1>
          <p className="text-gray-500 font-semibold">
            {product.product?.title}
          </p>

          <div className="flex justify-between items-center py-2 border w-[180px] px-3 mt-5">
            <div className="flex gap-1 items-center">
              <span>4</span>
              <StarIcon sx={{ color: teal[500], fontSize: "17px" }} />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>259 Ratings</span>
          </div>

          <div className="price flex items-center gap-3 mt-5 text-2xl">
            <span className="text-gray-800">
              ₹{product.product?.sellingPrice}
            </span>
            <span className="line-through text-gray-400">
              ₹{product.product?.mrpPrice}
            </span>
            <span className="text-primary-color font-semibold">
              {product.product?.discountPercent}%
            </span>
          </div>

          <div className="mt-7 space-y-2">
            <h1>QUANTITY</h1>
            <div className="flex items-center w-[140px] justify-between">
              <Button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}>
                <Remove />
              </Button>
              <span>{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)}>
                <Add />
              </Button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-5">
            <Button
              onClick={isInCart ? () => navigate("/cart") : handleAddToCart}
              fullWidth
              variant={isInCart ? "outlined" : "contained"}
              startIcon={<AddShoppingCart />}
              sx={{ py: "1rem" }}
            >
              {isInCart ? "Go To Bag" : "Add To Bag"}
            </Button>

            <Button
              fullWidth
              variant={isInWishlist ? "contained" : "outlined"}
              startIcon={<FavoriteBorder />}
              sx={{ py: "1rem" }}
              onClick={handleToggleWishlist}
            >
              {isInWishlist ? "ADDED TO WISHLIST" : "WISHLIST"}
            </Button>
          </div>

          {token && (
            <div id="write-review-section" className="mt-16">
              <AddReviewForm productId={product.product?.id ?? 0} />
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>

            {reviews.length === 0 && (
              <p className="text-gray-500">No reviews yet</p>
            )}

            <div className="space-y-10">
              {reviews.map((rev) => (
                <div key={rev.id}>
                  <ReviewCard
                    userName={rev.user.name}
                    createdAt={rev.createdAt}
                    rating={rev.rating}
                    text={rev.reviewText}
                    images={rev.productImages || []}
                    canDelete={rev.user.id === currentUserId}
                    userImage={null}
                    onDelete={() => dispatch(deleteReview(rev.id))}
                  />
                  <hr className="border-gray-200 mt-5" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;

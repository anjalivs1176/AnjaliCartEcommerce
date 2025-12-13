import {
  Avatar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Badge
} from "@mui/material";

import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategorySheet from "./CategorySheet";
import { mainCategory } from "../../../data/category/mainCategory";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../state/store";
import { useAppDispatch } from "../../../state/store";
import { fetchCart } from "../../../state/cart/cartSlice";
import { fetchWishlist } from "../../../state/wishlist/wishlistSlice";





const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* ---------------- AUTH STATE ---------------- */
  const getToken = () => localStorage.getItem("token");
  const getUser = () => {
    const raw = localStorage.getItem("user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState(getToken());
  const [authUser, setAuthUser] = useState(getUser());

  const userName = authUser?.name || "User";
  const userImage = authUser?.profileImage || null;

  useEffect(() => {
    const updateAuth = () => {
      setToken(getToken());
      setAuthUser(getUser());
    };

    window.addEventListener("authChange", updateAuth);
    return () => window.removeEventListener("authChange", updateAuth);
  }, []);


  useEffect(() => {
  if (token) {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }
}, [token, dispatch]);

  /* ---------------- REDUX COUNTS ---------------- */
  const cartItemCount = useAppSelector(
    (state) => state.cart?.cart?.totalItem || 0
  );

  const wishlistCount = useAppSelector(
    (state) => state.wishlist?.items?.length || 0
  );

  /* ---------------- CATEGORY STATE ---------------- */
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  return (
    <>
      <Box
        className="fixed top-0 left-0 right-0 bg-white shadow-sm"
        sx={{ zIndex: 60 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 h-[70px]">
          {/* ---------- LEFT ---------- */}
          <div className="flex items-center gap-4 md:gap-9">
            <h1
              onClick={() => navigate("/")}
              className="cursor-pointer text-xl md:text-2xl text-primary-color font-semibold"
            >
              AnjaliCart
            </h1>

            {isLarge && (
              <ul className="flex items-center font-medium text-gray-800">
                {mainCategory.map((item) => (
                  <li
                    key={item.categoryId}
                    onMouseEnter={() => {
                      setShowCategorySheet(true);
                      setSelectedCategory(item.categoryId);
                    }}
                    onMouseLeave={() => setShowCategorySheet(false)}
                    className="hover:text-primary-color hover:border-b-2 h-[70px] px-4 
                               border-primary-color flex items-center cursor-pointer transition"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ---------- RIGHT ---------- */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* <IconButton>
              <SearchIcon />
            </IconButton> */}

            {token ? (
              <Button
                className="flex items-center gap-2"
                onClick={() => navigate("/account/orders")}
              >
                <Avatar sx={{ width: 32, height: 32 }} src={userImage || undefined}>
                  {!userImage && userName.charAt(0).toUpperCase()}
                </Avatar>
                <span className="hidden lg:block font-semibold">
                  {userName}
                </span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                className="px-4"
              >
                Login
              </Button>
            )}

            {/* ---------- WISHLIST ---------- */}
            <IconButton onClick={() => navigate("/wishlist")}>
              <Badge
                badgeContent={wishlistCount}
                color="error"
                invisible={wishlistCount === 0}
              >
                <FavoriteBorderIcon sx={{ fontSize: 26 }} />
              </Badge>
            </IconButton>

            {/* ---------- CART ---------- */}
            <IconButton onClick={() => navigate("/cart")}>
              <Badge
                badgeContent={cartItemCount}
                color="error"
                invisible={cartItemCount === 0}
              >
                <AddShoppingCartIcon sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>

            {isLarge && (
              <Button
                onClick={() => navigate("/become-seller")}
                startIcon={<StorefrontIcon />}
                variant="outlined"
              >
                Become Seller
              </Button>
            )}
          </div>
        </div>

        {/* ---------- CATEGORY DROPDOWN ---------- */}
        {isLarge && showCategorySheet && (
          <div
            className="fixed left-4 right-4 sm:left-6 sm:right-6 md:left-10 md:right-10 lg:left-20 lg:right-20
                       top-[70px] bg-white border shadow-lg rounded-md 
                       max-h-[450px] overflow-y-auto p-5"
            style={{ zIndex: 70 }}
            onMouseEnter={() => setShowCategorySheet(true)}
            onMouseLeave={() => setShowCategorySheet(false)}
          >
            <CategorySheet selectedCategory={selectedCategory} />
          </div>
        )}
      </Box>

      {/* Spacer */}
      <div className="h-[70px]" />
    </>
  );
};

export default Navbar;

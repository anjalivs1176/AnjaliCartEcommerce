import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<any>(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data);
    } catch (err) {
      console.log("wishlist fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: number, e: any) => {
    e.stopPropagation();

    try {
      await api.post(`/wishlist/add-product/${productId}`);
      fetchWishlist();
    } catch (err) {
      console.log("Remove wishlist error:", err);
    }
  };

  const handleMoveToCart = async (product: any, e: any) => {
    e.stopPropagation();
    try {
      const body = {
        productId: product.id,
        size: product.sizes || "DEFAULT",
        quantity: 1,
      };

      await api.put("/cart/add", body);
      await handleRemove(product.id, e);
    } catch (err) {
      console.log("move to cart error:", err);
    }
  };

  return (
    <div className="px-5 lg:px-20 pt-10">
      <h1 className="text-2xl font-bold mb-7">My Wishlist ❤️</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist?.products?.length > 0 ? (
          wishlist.products.map((product: any) => {
            const url = `/product-details/${product.category?.categoryId}/${product.title}/${product.id}`;

            return (
              <div
                key={product.id}
                onClick={() => navigate(url)}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white"
              >
                <img
                  src={product.images[0]}
                  className="w-full h-[220px] object-cover rounded-md"
                />

                <h2 className="font-semibold mt-3 text-lg">
                  {product.title}
                </h2>

                <p className="text-primary-color font-bold mt-1 text-md">
                  ₹{product.sellingPrice}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={(e) => handleRemove(product.id, e)}
                    className="px-3 py-1 border rounded-md text-sm hover:bg-red-50 hover:text-red-600 transition"
                  >
                    Remove
                  </button>

                  <button
                    onClick={(e) => handleMoveToCart(product, e)}
                    className="px-3 py-1 bg-primary-color text-white rounded-md text-sm hover:opacity-90 transition"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 col-span-full text-lg mt-10">
            Your wishlist is empty 💔
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

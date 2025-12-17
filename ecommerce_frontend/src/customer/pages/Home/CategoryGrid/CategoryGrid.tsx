import React, { useEffect, useState } from "react";
import { homeApi } from "../../../services/homeApi";

const CategoryGrid = () => {

const [loading, setLoading] = useState(true);


  const [items, setItems] = useState<any[]>([]);

const fetchHomeCategories = async () => {
  try {
    const res = await homeApi.getHomeCategories();
    setItems(res.data.slice(0, 6));
  } catch (err) {
    console.log("HOME CATEGORIES ERROR:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchHomeCategories();
  }, []);

  if (loading) {
  return (
    <div className="grid gap-4 grid-rows-12 grid-cols-12 lg:h-[600px] px-5 lg:px-20">
      {[1,2,3,4,5,6].map(i => (
        <div
          key={i}
          className="bg-gray-200 animate-pulse rounded-md col-span-4 row-span-6"
        />
      ))}
    </div>
  );
}


  return (
    <div className="grid gap-4 grid-rows-12 grid-cols-12 lg:h-[600px] px-5 lg:px-20">
      {items[0] && (
        <div className="col-span-3 row-span-12">
          <img className="w-full h-full object-cover rounded-md" src={items[0].image} alt="" />
        </div>
      )}

      {items[1] && (
        <div className="col-span-2 row-span-6">
          <img className="w-full h-full object-cover rounded-md" src={items[1].image} alt="" />
        </div>
      )}

      {items[2] && (
        <div className="col-span-4 row-span-6">
          <img className="w-full h-full object-cover rounded-md" src={items[2].image} alt="" />
        </div>
      )}

      {items[3] && (
        <div className="col-span-3 row-span-12">
          <img className="w-full h-full object-cover rounded-md" src={items[3].image} alt="" />
        </div>
      )}

      {items[4] && (
        <div className="col-span-4 row-span-6">
          <img className="w-full h-full object-cover rounded-md" src={items[4].image} alt="" />
        </div>
      )}

      {items[5] && (
        <div className="col-span-2 row-span-6">
          <img className="w-full h-full object-cover rounded-md" src={items[5].image} alt="" />
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;


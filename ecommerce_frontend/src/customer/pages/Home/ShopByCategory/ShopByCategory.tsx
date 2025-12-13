import { useEffect, useState } from "react";
import ShopByCategoryCard from "./ShopByCategoryCard";
import { categoriesApi } from "../../../../api/categoriesApi";

interface Category {
  id: number;
  name: string;
  image?: string;
  level?: number;
}

const ShopByCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getCategories().then((res) => {
      
      const level3 = res.data.filter((c: any) => c.level === 3);
      setCategories(level3);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {categories.map((item) => (
        <ShopByCategoryCard key={item.id} ctg={item} />
      ))}
    </div>
  );
};

export default ShopByCategory;

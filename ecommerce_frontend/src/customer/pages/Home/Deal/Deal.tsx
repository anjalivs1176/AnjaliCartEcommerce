import { useEffect, useState } from "react";
import { DealsCarousel } from "./DealCard";
import { dealApi } from "../../../../api/dealApi";

const Deal = () => {
  interface Deal {
    id: number;
    title: string;
    image: string;
    discount: number;
    categoryId: string;
  }

  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    dealApi.getDeals().then((res) => setDeals(res.data));
  }, []);

  return (
    <div className="p-4">
      <DealsCarousel deals={deals} />
    </div>
  );
};

export default Deal;

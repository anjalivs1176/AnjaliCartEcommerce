
import { useNavigate } from "react-router-dom";

const ShopByCategoryCard = ({ ctg }: any) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer rounded-md overflow-hidden shadow-sm bg-white"
      onClick={() => navigate(`/products/${ctg.categoryId}`)}
    >
      <img
        className="w-full h-48 object-cover"
        src={ctg.image}
        alt={ctg.name}
      />

      <div className="p-3 text-center bg-white space-y-1">
        <p className="text-lg font-semibold">{ctg.name}</p>
        <p className="text-sm text-gray-600">UP TO {ctg.discount}% OFF</p>
        <p className="text-sm font-medium text-pink-600">Shop Now</p>
      </div>
    </div>
  );
};

export default ShopByCategoryCard;

import { ElectricBolt } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { teal } from "@mui/material/colors";
import React from "react";
import { Order } from "../../../type/orderType";
import { useNavigate } from "react-router-dom";

interface Props {
  order: Order;
}

const OrderItem: React.FC<Props> = ({ order }) => {
  const navigate = useNavigate();

  const firstItem = order.orderItems?.[0];
  const product = firstItem?.product;

  if (!firstItem || !product) return null;

  const handleNavigate = () => {
    navigate(`/account/order/${order.id}/${firstItem.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center gap-5">
        <Avatar sx={{ bgcolor: teal[500] }}>
          <ElectricBolt />
        </Avatar>

        <div>
          <h1 className="font-bold text-primary-color">
            {order.orderStatus}
          </h1>

          {order.orderStatus !== "DELIVERED" && (
            <p>
              Arriving by{" "}
              <span className="font-medium">
                {new Date(order.deliverDate).toDateString()}
              </span>
            </p>
          )}

          <p className="text-xs text-gray-500">
            Ordered on {new Date(order.orderDate).toDateString()}
          </p>
        </div>
      </div>

      <div className="p-5 bg-teal-50 flex gap-3 rounded-md">
        <img
          className="w-[70px] h-[70px] object-cover rounded-md"
          src={product.images?.[0]}
          alt={product.title}
        />

        <div className="w-full space-y-2">
          <h1 className="font-bold">{product.title}</h1>
          <p className="text-xs text-gray-600">{product.description}</p>

          <p>
            <strong>Size:</strong> {firstItem.size}
          </p>

          <p>
            <strong>Qty:</strong> {firstItem.quantity}
          </p>

          <p className="font-semibold text-primary-color">
            ₹{product.sellingPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;

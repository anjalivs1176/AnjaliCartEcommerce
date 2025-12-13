import { Avatar, IconButton, Rating } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import React from "react";

export interface ReviewCardProps {
  userName: string;
  createdAt: string;
  rating: number;
  text: string;
  images: string[];
  userImage?: string | null;
  onDelete?: () => void;
  onEdit?: () => void;
  canDelete?: boolean;
  canEdit?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  userName,
  createdAt,
  rating,
  text,
  images,
  userImage,
  onDelete,
  onEdit,
  canDelete = false,
  canEdit = false,
}) => {
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex justify-between items-start bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="flex gap-4 w-full">
        
        <Avatar
          className="text-white"
          sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
          src={userImage || undefined}
        >
          {userImage ? null : initial}
        </Avatar>

        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="font-semibold text-lg">{userName}</p>
            <p className="text-gray-500 text-sm">{createdAt}</p>
          </div>

          <Rating value={rating} readOnly precision={0.5} />

          <p className="text-gray-800">{text}</p>

          {images?.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-300"
                  src={img}
                  alt={`review-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        {canEdit && (
          <IconButton onClick={onEdit}>
            <Edit sx={{ color: "#4B5563" }} />
          </IconButton>
        )}
        {canDelete && (
          <IconButton onClick={onDelete}>
            <Delete sx={{ color: "#DC2626" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;

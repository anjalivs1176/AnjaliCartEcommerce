import React, { useEffect, useState } from "react"
import "./productCard.css"
import { Button, useMediaQuery, useTheme } from "@mui/material"
import { Favorite, ModeComment } from "@mui/icons-material"
import { teal } from "@mui/material/colors"
import { useNavigate } from "react-router-dom"
import { Product } from "../../../type/productType"




const ProductCard = ({ item }: { item: Product }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))


  useEffect(() => {
    let interval: any;

    if (isHovered && !isMobile && item.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % item.images.length);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isHovered, isMobile, item.images.length]);

  const navigate = useNavigate()
  return (
    <div onClick={() =>
      navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)
    }
      className="group relative w-full">
      <div
        className="card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.images.map((img, index) => (
          <img
            key={index}
            className="card-media"
            src={img}
            alt={item.title}
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
              transition: "transform 0.4s ease"
            }}
          />
        ))}
        {isHovered && !isMobile && (
          <div className="indicator flex flex-col items-center space-y-2">
            <div className="flex gap-3">
              <Button variant="contained" color="secondary">
                <Favorite sx={{ color: teal[500] }} />
              </Button>
              <Button variant="contained" color="secondary">
                <ModeComment sx={{ color: teal[500] }} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="details group-hover-effect rounded-md">
        <div className="name">
          <h1>{item.seller?.businessDetails?.businessName ?? "Unknown Seller"}</h1>
          <p>{item.title}</p>
        </div>
        <div className="price flex items-center gap-3">
          <span className="font-sans text-gray-800">₹{item.sellingPrice}</span>
          <span className="thin-line-through text-gray-400">₹{item.mrpPrice}</span>
          <span className="text-primary-color font-semibold">{item.discountPercent}%</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

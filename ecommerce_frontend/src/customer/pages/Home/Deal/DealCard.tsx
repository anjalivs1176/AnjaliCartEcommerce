
import React from "react";
import Slider from "react-slick";

interface Deal {
  id: number;
  title: string;
  image: string;
  discount: number;
  categoryId: string;
}

const DealCard = ({ deal }: { deal: Deal }) => {
  return (
    <div className="px-2 cursor-pointer">
      <div className="rounded-md overflow-hidden bg-white shadow-sm">
        <img
          className="w-full h-40 object-cover border-b-4 border-pink-600"
          src={deal.image}
          alt={deal.title}
        />

        <div className="bg-black text-white p-3 text-center space-y-1">
          <p className="text-base font-semibold">{deal.title}</p>
          <p className="text-xl font-bold">{deal.discount}% OFF</p>
          <p className="text-sm">Shop Now</p>
        </div>
      </div>
    </div>
  );
};

export const DealsCarousel = ({ deals }: { deals: Deal[] }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="px-4 py-6">
      <Slider {...settings}>
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </Slider>
    </div>
  );
};

export default DealCard;


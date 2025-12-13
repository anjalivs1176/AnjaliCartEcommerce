import React from 'react';

interface CardProps {
  name: string;
  img: string;
}

const ElectricCategoryCard: React.FC<CardProps> = ({ name, img }) => {
  return (
    <div className='flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200 p-3 rounded-lg'>
      <img className='object-contain h-12 w-12' src={img} alt={name} />
      <h2 className='font-medium text-sm text-gray-800'>{name}</h2>
    </div>
  );
};

export default ElectricCategoryCard;

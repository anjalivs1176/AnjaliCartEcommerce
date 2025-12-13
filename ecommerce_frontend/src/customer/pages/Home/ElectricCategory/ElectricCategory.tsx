import React from 'react'
import ElectricCategoryCard from './ElectricCategoryCard'
import { electricCategories } from '../ElectricCategory/electricCategories'

const ElectricCategory = () => {
  return (
    <div className='pt-[50px] py-5 border-b px-4 sm:px-6 lg:px-20'>
      <div
        className='
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:flex 
          lg:flex-wrap 
          lg:justify-between 
          gap-4 
          lg:gap-6
        '
      >
        {electricCategories.map((item, index) => (
          <ElectricCategoryCard 
            key={index} 
            name={item.name} 
            img={item.img} 
          />
        ))}
      </div>
    </div>
  )
}

export default ElectricCategory

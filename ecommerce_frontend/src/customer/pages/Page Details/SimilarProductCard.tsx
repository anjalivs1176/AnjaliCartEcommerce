import React from 'react'

const SimilarProductCard = () => {
  return (
    <div>
        <div className='group px-4 relative'>
            <div className="card">
                <img 
                className='card-media object-top'
                src="https://rukminim2.flixcart.com/image/312/312/xif0q/lehenga-choli/v/y/4/free-full-sleeve-renuka-kf-kedar-fab-original-imahf775szngrbqf.jpeg?q=70&crop=false" alt="" />
            </div>
            <div className='details pt-3 space-y-1 group-hover-effectrounded md'>
                <div className='name'>
                    <h1>Savyasachi</h1>
                    <p>Blue Lehenga</p>
                </div>
                <div className='price flex items-center gap-3'>
                    <span className='font-sans text-gray-800'>
                        Rs.400
                    </span>
                    <span className='line-through text-gray-999'>
                        Rs.999
                    </span>
                    <span className='text-primary-color font-semibold'>
                        60%
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SimilarProductCard
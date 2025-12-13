import React from 'react'
import ElectricCategory from './ElectricCategory/ElectricCategory'
import CategoryGrid from './CategoryGrid/CategoryGrid'
import Deal from './Deal/Deal'
import ShopByCategory from './ShopByCategory/ShopByCategory'
import Button from '@mui/material/Button'
import { Storefront } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className='space-y-5 lg:space-y-10 relative pb-20'>

        <ElectricCategory />
        <CategoryGrid />

        {/* TODAY'S DEAL */}
        <div className='pt-16 lg:pt-20'>
          <h1 className='text-xl lg:text-4xl font-bold text-primary-color pb-4 lg:pb-10 text-center'>
            Today's Top Deals
          </h1>
          <Deal />
        </div>

        {/* SHOP BY CATEGORY */}
        <section className='pt-16 lg:pt-20'>
          <h1 className='text-xl lg:text-4xl font-bold text-primary-color pb-4 lg:pb-10 text-center'>
            Shop BY Category
          </h1>
          <ShopByCategory />
        </section>

        {/* SELLER BANNER */}
        <section className='lg:px-20 relative h-[250px] md:h-[320px] lg:h-[450px]'>
          <img
            className='w-full h-full object-cover rounded-md'
            src="https://mag-udemy-clone.netlify.app/images/hero%20img.jpeg"
            alt=""
          />

          <div className='absolute top-1/2 left-4 md:left-10 lg:left-[15rem] -translate-y-1/2 text-white space-y-3'>

            <h1 className='text-lg md:text-3xl lg:text-4xl font-bold'>
              Sell your Product
            </h1>

            <p className='text-md md:text-2xl'>
              With <span className='logo'>Anjali Cart</span>
            </p>

            <div className='pt-4 md:pt-6'>
              <Button
               onClick={()=>navigate("/become-seller")}
                startIcon={<Storefront />}
                variant='contained'
                size='large'
              >
                Become Seller
              </Button>
            </div>

          </div>
        </section>

      </div>
    </>
  )
}

export default Home

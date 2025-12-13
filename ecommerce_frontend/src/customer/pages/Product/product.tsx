import React, { useEffect, useState } from 'react'
import FilterSection from './FilterSection'
import ProductCard from './ProductCard'
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme
} from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useAppDispatch, useAppSelector } from '../../../state/store'
import { fetchAllProducts } from '../../../state/customer/ProductSlice'
import { useParams, useSearchParams } from 'react-router-dom'

const Product = () => {
  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))
  const [sort, setSort] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const { product } = useAppSelector((store => store))

  const handleSortChange = (event: any) => {
    setSort(event.target.value);
  }

  const handlePageChange = (value: number) => {
    setPage(value)
  }

useEffect(() => {
  const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
  const color = searchParams.get("color");
  const minDiscount = searchParams.get("discount")
    ? Number(searchParams.get("discount"))
    : undefined;

  const pageNumber = page - 1;

  const newFilter = {
    category,
    color: color || "",
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minDiscount,
    pageNumber,
    sort
  };

  dispatch(fetchAllProducts(newFilter));
}, [category, searchParams, sort, page]); 

  return (
    <div className='mt-10'>
      <div>
        <h1 className='text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2'>
          {category?.replace("-", " ") || "Products"}
        </h1>
      </div>
      <div className='lg:flex'>

        <section className='filter_section hidden lg:block w-[20%]'>
          <FilterSection />
        </section>

        <div className='w-full lg:w-[80%] space-y-5'>
          <div className='flex justify-between items-center px-4 sm:px-9 h-[40px]'>
            <div className='relative w-[50%]'>
              {!isLarge && (
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterAltIcon />
                </IconButton>
              )}

              {!isLarge && showFilters && (
                <Box className='absolute top-12 left-0 z-50 bg-white shadow-lg rounded-md p-4 w-[250px]'>
                  <FilterSection />
                </Box>
              )}
            </div>

            <FormControl size='small' sx={{ width: '200px' }}>
              <InputLabel id='sort-select-label'>Sort</InputLabel>
              <Select
                labelId='sort-select-label'
                id='sort-select'
                value={sort}
                label='Sort'
                onChange={handleSortChange}
              >
                <MenuItem value={'price_low'}>Price : Low - High</MenuItem>
                <MenuItem value={'price_high'}>Price : High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          <section className='products_section grid gap-6 px-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {product.products.map((item) => <ProductCard item={item} />)}
          </section>

          <div className='flex justify-center py-10'>
            <Pagination
              onChange={(e, value) => handlePageChange(value)}
              count={10}
              shape="rounded"
              color='primary'
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Product

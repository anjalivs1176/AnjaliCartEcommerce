import React from 'react'
import { menLevelTwo } from '../../../data/category/level2/menLevelTwo'
import { womenLevelTwo } from '../../../data/category/level2/womenLevelTwo'
import { electronicsLevelTwo } from '../../../data/category/level2/electroniscLevelTwo'
import { furnitureLevelTwo } from '../../../data/category/level2/furnitureLevelTwo'
import { menLevelThree } from '../../../data/category/level3/menLevelThree'
import { womenLevelThree } from '../../../data/category/level3/womenLevelThree'
import { electronicsLevelThree } from '../../../data/category/level3/electronicsLevelThree'
import { furnitureLevelThree } from '../../../data/category/level3/furnitureLevelThree'
import { Box } from '@mui/material'
import { Category } from '@mui/icons-material'
import zIndex from '@mui/material/styles/zIndex'
import { useNavigate } from 'react-router-dom'
const categoryTwo: { [key: string]: any[] } = {
    men: menLevelTwo,
    women: womenLevelTwo,
    electronics: electronicsLevelTwo,
    home_furniture: furnitureLevelTwo
}
const categoryThree: { [key: string]: any[] } = {
    men: menLevelThree,
    women: womenLevelThree,
    electronics: electronicsLevelThree,
    home_furniture: furnitureLevelThree
}

const CategorySheet = ({ selectedCategory, setShowSheet }: any) => {

    const navigate = useNavigate()

    const childCategory = (category: any, parentCategoryId: any) => {
        return category.filter((child: any) => child.parentCategoryId == parentCategoryId)
    }
    return (
        <Box
            sx={{ zIndex: 2 }}
            className="bg-white shadow-lg lg:h-[500px] overflow-y-auto">
            <div className='flex text-sm flex-wrap'>
                {
                    categoryTwo[selectedCategory]?.map((item: any, index) => <div
                        className={`p-8 lg:w-[20%] ${index % 2 == 0 ? "bg-slate-50" : "bg-white"}`}
                    >
                        <p className='text-primary-color mb-5 font-semibold'>{item.name}</p>
                        <ul className='space-y-3'>

                            {childCategory(categoryThree[selectedCategory], item.categoryId).map
                                ((item: any) => <div>
                                    <li onClick={() => navigate("/products/" + item.categoryId)} className='hover:text-primary-color cursor-pointer'>
                                        {item.name}
                                    </li>
                                </div>)}
                        </ul>
                    </div>)
                }
            </div>
        </Box>
    )
}

export default CategorySheet
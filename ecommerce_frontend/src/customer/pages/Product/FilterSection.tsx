
import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { teal } from '@mui/material/colors'
import React, { useState } from 'react'
import { colors } from '../../../data/Filter/color'
import { useSearchParams } from 'react-router-dom'
import { price } from '../../../data/Filter/price'
import { discount } from '../../../data/Filter/discount'

const FilterSection = () => {
  const [expandColor, setExpandColor] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleColorToggle = () => {
    setExpandColor(!expandColor)
  }

  const updateFilterParams = (e: any) => {
    const { value, name } = e.target

    const updated = new URLSearchParams(searchParams)

    if (value) {
      updated.set(name, value)
    } else {
      updated.delete(name)
    }

    setSearchParams(updated)
  }

  const clearAllFilters = () => {
    const updated = new URLSearchParams()
    setSearchParams(updated)
  }

  return (
    <div
      className="-z-50 space-y-5 bg-white h-screen overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#009688 #e5e5e5",
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: #e5e5e5;
          }
          div::-webkit-scrollbar-thumb {
            background-color: #009688;
            border-radius: 20px;
          }
        `}
      </style>

      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-large font-semibold">Filters</p>
        <Button
          onClick={clearAllFilters}
          size="small"
          className="text-teal-600 cursor-pointer font-semibold"
        >
          Clear All
        </Button>
      </div>

      <Divider />

      <div className="px-9 space-y-6">
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[500], pb: '14px' }}
              className="text-2xl font-semibold"
              id="color"
            >
              Color
            </FormLabel>
            <RadioGroup aria-labelledby="color" defaultValue="" name="color" onChange={updateFilterParams}>
              {colors
                .slice(0, expandColor ? colors.length : 5)
                .map((item) => (
                  <FormControlLabel
                    key={item.name}
                    value={item.name}
                    control={<Radio />}
                    label={
                      <div className="flex items-center gap-3">
                        <p style={{ fontSize: "14px" }}>{item.name}</p>
                        <p
                          style={{ backgroundColor: item.hex }}
                          className={`h-5 w-5 rounded-full ${item.name === 'white' ? 'border' : ''}`}
                        ></p>
                      </div>
                    }
                  />
                ))}
            </RadioGroup>
            {colors.length > 5 && (
              <button
                onClick={handleColorToggle}
                className="text-primary-color cursor-pointer hover:text-teal-900 flex items-center mt-2"
              >
                {expandColor ? 'Hide' : `+${colors.length - 5} more`}
              </button>
            )}
          </FormControl>
        </section>
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[500], pb: '14px' }}
              className="text-2xl font-semibold"
              id="price"
            >
              Price
            </FormLabel>
            <RadioGroup
              aria-labelledby="price"
              defaultValue=""
              name="price"
              onChange={updateFilterParams}
            >
              {price.map((item) => (
                <FormControlLabel style={{ fontSize: "14px" }}
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>

        <Divider />
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: '16px', fontWeight: 'bold', color: teal[600], pb: '14px' }}
              className="text-2xl font-semibold"
              id="discount"
            >
              Discount
            </FormLabel>
            <RadioGroup
              aria-labelledby="discount"
              defaultValue=""
              name="discount"
              onChange={updateFilterParams}
            >
              {discount.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={item.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  )
}

export default FilterSection

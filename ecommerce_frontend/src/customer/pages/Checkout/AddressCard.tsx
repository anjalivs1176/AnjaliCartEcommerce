
import { Radio } from '@mui/material'
import React from 'react'

const AddressCard = ({ address, selected, onSelect }: any) => {
  return (
    <div
      className='p-5 border rounded-md flex cursor-pointer'
      onClick={() => onSelect(address.id)}
    >
      <Radio checked={selected === address.id} />

      <div>
        <h1 className="font-semibold">{address.name}</h1>

        <p className='w-[320px] text-sm text-gray-700'>
          {address.locality}, {address.city}, {address.state}
        </p>

        <p>
          <strong>Mobile: </strong>{address.mobile}
        </p>
      </div>
    </div>
  )
}

export default AddressCard

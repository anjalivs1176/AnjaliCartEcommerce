
import React from 'react'

const UserAddressCard = ({ address, index }: { address: any, index: number }) => {

  const handleSelect = () => {
    window.dispatchEvent(
      new CustomEvent("addressSelected", { detail: index })
    )
  }

  return (
    <div
      className='p-5 border rounded-md flex cursor-pointer'
      onClick={handleSelect}
    >
      <input
        type="radio"
        name="selectedAddress"
        className="mr-3"
        onChange={handleSelect}
      />

      <div className='space-y-3'>
        <h1>{address.name}</h1>

        <p className='w-[320px]'>
          {address.locality}, {address.city}, {address.state} - {address.pinCode}
        </p>

        <p>
          <strong>Mobile: </strong> {address.mobile}
        </p>
      </div>
    </div>
  )
}

export default UserAddressCard

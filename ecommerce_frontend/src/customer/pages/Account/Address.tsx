import React, { useEffect, useState } from 'react'
import UserAddressCard from './UserAddressCard'
import axios from 'axios'
import api from '../../../config/api'

const Address = () => {
  const [addresses, setAddresses] = useState<any[]>([])

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get('/address', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAddresses(res.data)
    } catch (err) {
      console.error("Failed to fetch addresses", err)
    }
  }

  useEffect(() => {
    fetchAddresses()

    const handler = () => fetchAddresses()
    window.addEventListener("addressAdded", handler)

    return () => window.removeEventListener("addressAdded", handler)
  }, [])

  return (
    <div className='space-y-3'>
      {addresses.length === 0 && (
        <p className='text-gray-500'>No saved addresses yet.</p>
      )}

      {addresses.map((addr, index) => (
        <UserAddressCard 
          key={index}
          index={index}
          address={addr} 
        />
      ))}
    </div>
  )
}

export default Address


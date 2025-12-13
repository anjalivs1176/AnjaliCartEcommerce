import { Add, Close, Remove } from '@mui/icons-material'
import { Button, Divider, IconButton } from '@mui/material'
import React from 'react'
const CartItem = ({ item }: any) => {


  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token") || "";

      await fetch(`http://localhost:8080/api/cart/item/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (item && item.onDelete) {
        item.onDelete();
      }

    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (newQty: number) => {
    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`http://localhost:8080/api/cart/item/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });

      const data = await res.json();

      if (item.onDelete) {
        item.onDelete();
      }

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className='border rounded-md relative'>


      <div className='p-5 flex gap-3 cursor-pointer'
        onClick={() => item.onNavigate(item)}
      >

        <div>
          <img
            className='w-[90px] rounded-md'
            src={item.product.images[0]}
            alt=""
          />
        </div>


        <div className='space-y-2'>
          <h1 className='font-semibold text-lg'>{item.product.title}</h1>
          <p className='text-gray-600 font-medium text-sm'>
            {item.product.description}
          </p>
          <p className='text-gray-400 text-xs'>
            <strong>Size:</strong> {item.size}
          </p>
          <p className='text-sm text-gray-500'>
            <strong>Quantity:</strong> {item.quantity}
          </p>
        </div>

      </div>

      <Divider />


      <div className='flex justify-between items-center'>


        <div className='px-5 py-2 flex justify-between items-center'>
          <div className='flex items-center gap-2 w-[140px] justify-between'>

            <Button
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.quantity - 1)}
            >
              <Remove />
            </Button>

            <span>{item.quantity}</span>

            <Button onClick={() => updateQuantity(item.quantity + 1)}>
              <Add />
            </Button>

          </div>
        </div>


        <div className='pr-5'>
          <p className='text-gray-700'>Rs.{item.sellingPrice}</p>
        </div>

      </div>


      <div className='absolute top-1 right-1'>
        <IconButton color='primary' onClick={handleDelete}>
          <Close />
        </IconButton>
      </div>

    </div>
  )
}

export default CartItem

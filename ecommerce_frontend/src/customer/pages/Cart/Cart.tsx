
import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import { LocalOffer } from '@mui/icons-material'
import { teal } from '@mui/material/colors'
import { Button, TextField } from '@mui/material'
import PricingCard from './PricingCard'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

    const [couponCode, setCouponCode] = useState("")
    const [cart, setCart] = useState<any>(null)
    const [coupons, setCoupons] = useState<any[]>([])

    const navigate = useNavigate()

    const handleChange = (e: any) => {
        setCouponCode(e.target.value)
    }

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token") || "";

            const res = await fetch("http://localhost:8080/api/cart", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("MY CART:", data);
            setCart(data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem("token") || "";

            const res = await fetch("http://localhost:8080/api/coupons/active", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("COUPONS RESPONSE:", data);

            if (Array.isArray(data)) {
                setCoupons(data);
            } else {
                setCoupons([]);
            }

        } catch (err) {
            console.log(err);
            setCoupons([]);
        }
    };

    const applyCoupon = async () => {
        if (!couponCode) {
            alert("Please enter or select a coupon");
            return;
        }

        try {
            const token = localStorage.getItem("token") || "";

            const res = await fetch(
                `http://localhost:8080/api/coupons/apply?code=${couponCode}&orderValue=${cart.totalSellingPrice}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            );

            if (!res.ok) {
                const message = await res.text();
                alert(message);
                return;
            }

            const updatedCart = await res.json();
            alert("Coupon Applied 🎉");
            setCart(updatedCart);


        } catch (err) {
            console.log(err);
            alert("Invalid coupon");
        }
    };

    const navigateToProduct = (item: any) => {
        const category = item.product.category.categoryId;
        const title = encodeURIComponent(item.product.title);
        const id = item.product.id;

        navigate(`/product-details/${category}/${title}/${id}`);
    };


    useEffect(() => {
        fetchCart();
        fetchCoupons();
    }, []);

    return (
        <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>


                <div className='cartItemSection lg:col-span-2 space-y-3'>
                    {
                        cart?.cartItems?.length > 0 ? (
                            cart.cartItems.map((item: any) => (
                                <CartItem
                                    key={item.id}
                                    item={{
                                        ...item,
                                        onDelete: fetchCart,
                                        onNavigate: navigateToProduct
                                    }}
                                />
                            ))
                        ) : (
                            <p>Your cart is empty 🤧</p>
                        )
                    }
                </div>


                <div className='col-span-1 text-sm space-y-3'>


                    <div className='border rounded-md px-5 py-3 space-y-5'>

                        <div className='flex gap-3 text-sm items-center'>
                            <LocalOffer sx={{ color: teal[600], fontSize: "17px" }} />
                            <span>Apply Coupon</span>
                        </div>

                        <div className='flex justify-between items-center'>
                            <TextField
                                onChange={handleChange}
                                placeholder='coupon code'
                                size='small'
                                variant='outlined'
                                value={couponCode}
                            />
                            <Button size='small' onClick={applyCoupon}>Apply</Button>
                        </div>

                        <div className='mt-3 space-y-2'>
                            <p className='font-semibold text-gray-700'>Available Coupons</p>

                            {coupons.length === 0 && (
                                <p className='text-xs text-gray-500'>No coupons available</p>
                            )}

                            {coupons.map((cp: any) => (
                                <div
                                    key={cp.id}
                                    className='border p-2 rounded-md flex justify-between items-center'
                                >
                                    <div>
                                        <p className='font-bold'>{cp.code}</p>
                                        <p className='text-xs text-gray-500'>
                                            {cp.discountPercentage}% OFF • Min ₹{cp.minimumOrderValue}
                                        </p>
                                    </div>

                                    <Button
                                        size='small'
                                        onClick={() => setCouponCode(cp.code)}
                                    >
                                        Use
                                    </Button>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className='border rounded-md'>
                        <PricingCard cart={cart} />
                        <div className='p-5'>
                            <Button
                                onClick={() => navigate("/checkout")}
                                fullWidth
                                variant='contained'
                                sx={{ py: "11px" }}>Buy Now</Button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Cart


import React, { useState } from 'react'
import SellerAccountForm from './SellerAccountForm';
import SellerLoginForm from './SellerLoginForm';
import { Button } from '@mui/material';

const BecomeSeller = () => {
    const [isLogin, setIsLogin] = useState(false);

    const handleShowPage = () => {
        setIsLogin(!isLogin);
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <section className="w-full sm:w-[450px] p-10 shadow-lg rounded-md bg-white">

                {isLogin ? <SellerAccountForm /> : <SellerLoginForm />}
                <div className="mt-10">
                    <Button
                        onClick={handleShowPage}
                        fullWidth
                        sx={{ py: "11px" }}
                        variant='outlined'
                    >
                        {isLogin
                            ? "Already have an account? Login"
                            : "Don't have an account? Register"
                        }
                    </Button>
                </div>
            </section>
            <section className='hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center'>
                <div className='lg:w-[70%] px-5 space-y-10'>
                    <div className='space-y-2 font-bold text-center'>
                        <p className='text-2xl'>Join the market place Revolution</p>
                        <p className='text-lg text-primary-color'>Boost your Sales Today</p>
                    </div>
                    <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRKTZG03qIM0P4wEp_WW8ZOwY__oLBmySBGwjKVmLMgAM187NkE" alt="" />
                </div>
            </section>
        </div>
    )
}

export default BecomeSeller

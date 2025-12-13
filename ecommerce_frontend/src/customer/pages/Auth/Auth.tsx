import React, { useState } from 'react'
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { Button } from '@mui/material';

const Auth = () => {
  const [isLogin,setIsLogin] = useState(true);
  return (
    <div className='flex justify-center h-[90vh] items-center'>
      <div className='max-w-md h-[85vh] shadow-ld rounded-md'>
        <div className='mt-8 px-10'>
          {isLogin? <LoginForm/> : <RegisterForm/>}
        <div className='flex items-center gap-1 justify-center mt-5'>
          <p className='text-sm text-gray-600'>
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
          </p>
          <Button size='small' onClick={()=>setIsLogin(!isLogin)}>{isLogin? "Create Account":"Login"}</Button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Auth

import React, { useEffect, useState } from 'react'
import ProfileFieldCard from '../../../component/ProfileFieldCard'
import { Divider } from '@mui/material'
import axios from "axios";
import { User } from "../../../type/userType";

const UserDetails = () => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data);
      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className='flex justify-center py-10'>
      <div className='w-full lg:w-[70%]'>

        <div className='flex items-center pb-3 justify-between'>
          <h1 className='text-2xl font-bold text-gray-600'>Personal Details</h1>
        </div>

        {!user && <p>Loading...</p>}

        {user && (
          <div>
            <ProfileFieldCard keys='Name' value={user.name} />
            <Divider />

            <ProfileFieldCard keys='Mobile' value={user.mobile} />
            <Divider />

            <ProfileFieldCard keys='Email' value={user.email} />
          </div>
        )}

      </div>
    </div>
  )
}

export default UserDetails;

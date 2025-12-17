import React, { useEffect, useState } from "react";
import ProfileFieldCard from "../../../component/ProfileFieldCard";
import { Divider } from "@mui/material";
import api from "../../../config/api";
import { User } from "../../../type/userType";

const UserDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/profile"); 
      setUser(res.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="flex justify-center py-10">
      <div className="w-full lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">
            Personal Details
          </h1>
        </div>

        {!user && (
          <p className="text-gray-500">Unable to load profile.</p>
        )}

        {user && (
          <div>
            <ProfileFieldCard keys="Name" value={user.name} />
            <Divider />

            <ProfileFieldCard keys="Mobile" value={user.mobile} />
            <Divider />

            <ProfileFieldCard keys="Email" value={user.email} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

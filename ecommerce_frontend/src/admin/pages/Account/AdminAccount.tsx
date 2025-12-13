import React, { useState } from "react";
import { Button, Avatar, Modal } from "@mui/material";

const AdminAccount = () => {
  const savedAvatar = localStorage.getItem("adminAvatar") || "";

  const [avatar, setAvatar] = useState(savedAvatar);
  const [open, setOpen] = useState(false);

  const handleAvatarClick = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
      localStorage.setItem("adminAvatar", base64); 
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Admin Account</h1>

      <div className="border rounded-md p-6 shadow-sm max-w-md bg-white space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar
            src={avatar || "/default-user.png"}
            sx={{ width: 90, height: 90, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />

          <label className="cursor-pointer text-primary-color font-medium">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="space-y-3 pt-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Name</span>
            <span className="font-semibold">Anjali</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email</span>
            <span className="font-semibold">anjalivs.dev@gmail.com</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Role</span>
            <span className="font-semibold">ROLE_ADMIN</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status</span>
            <span className="font-semibold text-green-600">ACTIVE</span>
          </div>
        </div>

      </div>

      <Modal open={open} onClose={handleClose}>
        <div className="flex items-center justify-center h-screen bg-black/60">
          <div className="relative">
            <button 
              onClick={handleClose}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-200"
            >
              ✕
            </button>
            <img
              src={avatar || "/default-user.png"}
              alt="Avatar Preview"
              className="max-w-xs rounded-lg shadow-xl"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAccount;

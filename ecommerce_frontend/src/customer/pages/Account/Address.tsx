import React, { useEffect, useState } from "react";
import UserAddressCard from "./UserAddressCard";
import api from "../../../config/api";

const Address = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/address"); // 🔥 interceptor adds token
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();

    const handler = () => fetchAddresses();
    window.addEventListener("addressAdded", handler);

    return () => window.removeEventListener("addressAdded", handler);
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading addresses...</p>;
  }

  return (
    <div className="space-y-3">
      {addresses.length === 0 && (
        <p className="text-gray-500">No saved addresses yet.</p>
      )}

      {addresses.map((addr, index) => (
        <UserAddressCard
          key={addr.id ?? index}
          index={index}
          address={addr}
        />
      ))}
    </div>
  );
};

export default Address;

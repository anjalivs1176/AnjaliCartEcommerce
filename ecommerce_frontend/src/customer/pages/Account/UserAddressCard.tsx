import React, { useState } from "react";

interface Props {
  address: any;
  index: number;
}

const UserAddressCard: React.FC<Props> = ({ address, index }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(true);
    window.dispatchEvent(
      new CustomEvent("addressSelected", { detail: index })
    );
  };

  return (
    <div
      className={`p-5 border rounded-md flex cursor-pointer ${
        selected ? "border-primary-color bg-teal-50" : ""
      }`}
      onClick={handleSelect}
    >
      <input
        type="radio"
        name="selectedAddress"
        className="mr-3 mt-1"
        checked={selected}
        onChange={handleSelect}
      />

      <div className="space-y-3">
        <h1 className="font-medium">{address.name}</h1>

        <p className="w-[320px] text-sm text-gray-700">
          {address.locality}, {address.city}, {address.state} -{" "}
          {address.pinCode}
        </p>

        <p className="text-sm">
          <strong>Mobile:</strong> {address.mobile}
        </p>
      </div>
    </div>
  );
};

export default UserAddressCard;

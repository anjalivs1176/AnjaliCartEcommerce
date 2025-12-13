import { Button } from '@mui/material';
import React, { useState } from 'react';
import DealTable from './DealTable';
import CreateDealForm from './CreateDealForm';
import EditDeal from './EditDeal';

const tabs = ["Deals", "Create Deal"];

const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");
  const [editData, setEditData] = useState<any>(null);

  return (
    <div>
      <div className="flex gap-4 mb-6">
        {tabs.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveTab(item)}
            variant={activeTab === item ? "contained" : "outlined"}
          >
            {item}
          </Button>
        ))}
      </div>
      {activeTab === "Deals" && (
        <DealTable onEdit={(deal: any) => setEditData(deal)} />
      )}

      {activeTab === "Create Deal" && (
        <div className="mt-5 flex flex-col justify-center items-center h-[70vh]">
          <CreateDealForm />
        </div>
      )}
      <EditDeal
        open={Boolean(editData)}
        deal={editData}
        onClose={() => setEditData(null)}
        onUpdated={() => window.location.reload()}
      />
    </div>
  );
};

export default Deal;

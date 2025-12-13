import { Button } from '@mui/material';
import React, { useState } from 'react';
import CreateCategoriesForm from './CreateCategoriesForm';
import EditCategories from './EditCategories';
import CategoriesTable from './categoriesTable';

const tabs = ["Categories", "Create Category"];

const Categories = () => {
  const [activeTab, setActiveTab] = useState("Categories");
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

      {activeTab === "Categories" && (
        <CategoriesTable onEdit={(ctg: any) => setEditData(ctg)} />
      )}

      {activeTab === "Create Category" && (
        <div className="mt-5 flex flex-col justify-center items-center h-[70vh]">
          <CreateCategoriesForm />
        </div>
      )}

      {editData && (
        <EditCategories
          open={Boolean(editData)}
          ctg={editData}
          onClose={() => setEditData(null)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default Categories;

import React, { useEffect, useState } from "react";
import {
  Modal,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";

import { mainCategory } from "../../../data/category/mainCategory";
import { menLevelTwo } from "../../../data/category/level2/menLevelTwo";
import { menLevelThree } from "../../../data/category/level3/menLevelThree";
import { womenLevelTwo } from "../../../data/category/level2/womenLevelTwo";
import { womenLevelThree } from "../../../data/category/level3/womenLevelThree";
import { electronicsLevelTwo } from "../../../data/category/level2/electroniscLevelTwo";
import { electronicsLevelThree } from "../../../data/category/level3/electronicsLevelThree";
import { furnitureLevelTwo } from "../../../data/category/level2/furnitureLevelTwo";
import { furnitureLevelThree } from "../../../data/category/level3/furnitureLevelThree";
import { adminApi } from "../../../admin/services/adminApi";

const UpdateHomeCategory = ({ open, onClose, data, onUpdated }: any) => {
  const [formData, setFormData] = useState({
    image: "",
    category: "",
    category2: "",
    category3: "",
  });

  const [level2List, setLevel2List] = useState<any[]>([]);
  const [level3List, setLevel3List] = useState<any[]>([]);

useEffect(() => {
  if (!data) return;

  const cat3 = data.categoryId;

  const allLevel3 = [
    ...menLevelThree,
    ...womenLevelThree,
    ...electronicsLevelThree,
    ...furnitureLevelThree,
  ];

  const level3Obj = allLevel3.find((c) => c.categoryId === cat3);

  if (!level3Obj) return;

  const cat2 = level3Obj.parentCategoryId;
  const cat1 = cat2.split("_")[0];

  loadLevel2(cat1);
  loadLevel3(cat2);

  setFormData({
    image: data.image,
    category: cat1,
    category2: cat2,
    category3: cat3,
  });
}, [data]);




  const loadLevel2 = (mainCatId: string) => {
    switch (mainCatId) {
      case "men":
        setLevel2List(menLevelTwo);
        break;
      case "women":
        setLevel2List(womenLevelTwo);
        break;
      case "home_furniture":
        setLevel2List(furnitureLevelTwo);
        break;
      case "electronics":
        setLevel2List(electronicsLevelTwo);
        break;
      default:
        setLevel2List([]);
    }
  };

  const loadLevel3 = (category2Id: string) => {
    let list: any[] = [];

    if (category2Id.startsWith("men_")) list = menLevelThree;
    if (category2Id.startsWith("women_")) list = womenLevelThree;
    if (category2Id.startsWith("electronics_")) list = electronicsLevelThree;
    if (category2Id.startsWith("home_furniture_"))
      list = furnitureLevelThree;

    const filtered = list.filter(
      (c) => c.parentCategoryId === category2Id
    );

    setLevel3List(filtered);
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      loadLevel2(value);
      setFormData((prev) => ({
        ...prev,
        category2: "",
        category3: "",
      }));
      setLevel3List([]);
    }

    if (name === "category2") {
      loadLevel3(value);
      setFormData((prev) => ({
        ...prev,
        category3: "",
      }));
    }
  };

  const handleUpdate = async () => {
    const payload = {
      image: formData.image,
      categoryId: formData.category3,
    };

    await adminApi.updateHomeCategory(data.id, payload);
    onUpdated();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{ maxWidth: 430, p: 4, mx: "auto", mt: "10vh", borderRadius: 3 }}
      >
        <Typography variant="h6" mb={2}>
          Update Category
        </Typography>

        <TextField
          fullWidth
          label="Image URL"
          margin="normal"
          name="image"
          value={formData.image}
          onChange={onChange}
        />

        <TextField
          fullWidth
          select
          margin="normal"
          label="Category"
          name="category"
          value={formData.category}
          onChange={onChange}
        >
          {mainCategory.map((cat) => (
            <MenuItem key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          margin="normal"
          label="Category 2"
          name="category2"
          value={formData.category2}
          onChange={onChange}
        >
          {level2List.map((cat) => (
            <MenuItem key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          margin="normal"
          label="Category 3"
          name="category3"
          value={formData.category3}
          onChange={onChange}
        >
          {level3List.map((cat) => (
            <MenuItem key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleUpdate}>
          Update
        </Button>
      </Paper>
    </Modal>
  );
};

export default UpdateHomeCategory;

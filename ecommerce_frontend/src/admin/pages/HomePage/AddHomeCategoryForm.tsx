import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { adminApi } from "../../services/adminApi";

// LEVEL 1
import { mainCategory } from "../../../data/category/mainCategory";

// LEVEL 2
import { menLevelTwo } from "../../../data/category/level2/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level2/womenLevelTwo";
import { electronicsLevelTwo } from "../../../data/category/level2/electroniscLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/level2/furnitureLevelTwo";

// LEVEL 3
import { menLevelThree } from "../../../data/category/level3/menLevelThree";
import { womenLevelThree } from "../../../data/category/level3/womenLevelThree";
import { electronicsLevelThree } from "../../../data/category/level3/electronicsLevelThree";
import { furnitureLevelThree } from "../../../data/category/level3/furnitureLevelThree";

const AddHomeCategoryForm = ({ initialData = null, onSuccess }: any) => {
  const [formData, setFormData] = useState({
    image: "",
    category: "",
    category2: "",
    category3: "",
  });

  const [level2List, setLevel2List] = useState<any[]>([]);
  const [level3List, setLevel3List] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        image: initialData.image || "",
        category: initialData.category || "",
        category2: initialData.category2 || "",
        category3: initialData.category3 || "",
      });

      loadLevel2(initialData.category);
      loadLevel3(initialData.category2);
    }
  }, [initialData]);


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


  const loadLevel3 = (level2Id: string) => {
    let list: any[] = [];

    if (level2Id.startsWith("men_")) list = menLevelThree;
    if (level2Id.startsWith("women_")) list = womenLevelThree;
    if (level2Id.startsWith("electronics_")) list = electronicsLevelThree;
    if (level2Id.startsWith("home_furniture_")) list = furnitureLevelThree;

    const filtered = list.filter(
      (c) => c.parentCategoryId === level2Id
    );

    setLevel3List(filtered);
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      loadLevel2(value);
      setFormData((prev) => ({ ...prev, category2: "", category3: "" }));
      setLevel3List([]);
    }

    if (name === "category2") {
      loadLevel3(value);
      setFormData((prev) => ({ ...prev, category3: "" }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        image: formData.image,
        categoryId: formData.category3,
      };

      if (initialData) {
        await adminApi.updateHomeCategory(initialData.id, payload);
        alert("Updated!");
      } else {
        await adminApi.createHomeCategory(payload);
        alert("Added!");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 450, mx: "auto", mt: 5 }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        {initialData ? "Update Category" : "Add Home Category"}
      </Typography>
      <TextField
        label="Image URL"
        fullWidth
        margin="normal"
        name="image"
        value={formData.image}
        onChange={onChange}
      />
      <TextField
        select
        fullWidth
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
        select
        fullWidth
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
        select
        fullWidth
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

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        {initialData ? "Update" : "Submit"}
      </Button>
    </Paper>
  );
};

export default AddHomeCategoryForm;

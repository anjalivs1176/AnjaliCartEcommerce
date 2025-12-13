import { useState } from "react";
import { Button, TextField, MenuItem, Paper, Typography } from "@mui/material";
import { adminApi } from "../../services/adminApi";
import { allLevelThree } from "../../../data/category/level3/allLevelThree";

const AddDealCategoryForm = ({ initial = null, onSuccess }: any) => {
  const [form, setForm] = useState({
    title: initial?.title || "",
    image: initial?.image || "",
    discount: initial?.discount || "",
    categoryId: initial?.categoryId || "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (initial) {
      await adminApi.updateDeal(initial.id, form);
      alert("Deal updated!");
    } else {
      await adminApi.createDeal(form);
      alert("Deal added!");
    }
    if (onSuccess) onSuccess();
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 450, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        {initial ? "Update Deal" : "Add Deal"}
      </Typography>

      <TextField label="Title" name="title" fullWidth margin="normal"
        value={form.title} onChange={handleChange} />

      <TextField label="Image URL" name="image" fullWidth margin="normal"
        value={form.image} onChange={handleChange} />

      <TextField label="Discount" name="discount" type="number" fullWidth
        margin="normal" value={form.discount} onChange={handleChange} />

      <TextField select label="Category"
        name="categoryId" fullWidth margin="normal"
        value={form.categoryId} onChange={handleChange}
      >
        {allLevelThree.map(cat => (
          <MenuItem key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        {initial ? "Update" : "Submit"}
      </Button>
    </Paper>
  );
};

export default AddDealCategoryForm;

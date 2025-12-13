import { Modal, TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import { adminApi } from "../../../services/adminApi";

const EditCategories = ({ open, onClose, ctg, onUpdated }: any) => {
  const [name, setName] = useState(ctg?.name || "");
  const [level, setLevel] = useState(ctg?.level || 1);
  const [discount, setDiscount] = useState(ctg?.discount || 0);
  const [image, setImage] = useState(ctg?.image || "");

  const handleUpdate = async () => {
    await adminApi.updateCategory(ctg.id, {
      name,
      level,
      discount,
      image
    });

    onUpdated();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, width: 350, mx: "auto", mt: "10%", bgcolor: "white" }}>
        <h2>Edit Category</h2>

        <TextField
          fullWidth
          margin="normal"
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Level"
          type="number"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Discount (%)"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button variant="contained" fullWidth onClick={handleUpdate}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditCategories;

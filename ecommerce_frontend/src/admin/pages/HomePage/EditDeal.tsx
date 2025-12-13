import { Modal, TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import { dealApi } from "../../../api/dealApi";

const EditDeal = ({ open, onClose, deal, onUpdated }: any) => {
  const [discount, setDiscount] = useState(deal?.discount || "");

  const handleUpdate = async () => {
    await dealApi.updateDeal(deal.id, { discount });
    onUpdated();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, width: 350, mx: "auto", mt: "10%", bgcolor: "white" }}>
        <h2>Edit Deal</h2>

        <TextField
          fullWidth
          margin="normal"
          label="Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <Button variant="contained" fullWidth onClick={handleUpdate}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default EditDeal;

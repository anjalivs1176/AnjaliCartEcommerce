import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { adminApi } from '../../../services/adminApi';

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
}));

export default function CategoriesTable({ onEdit }: any) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    adminApi.getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete category?")) return;
    await adminApi.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Category ID</StyledTableCell>
            <StyledTableCell>Level</StyledTableCell>
            <StyledTableCell>Discount</StyledTableCell>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
            <StyledTableCell>Delete</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categories.map((categ, index) => (
            <TableRow key={categ.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{categ.name}</TableCell>
              <TableCell>{categ.categoryId}</TableCell>
              <TableCell>{categ.level}</TableCell>
              <TableCell>{categ.discount || 0}%</TableCell>

              <TableCell>
                {categ.image ? (
                  <img
                    src={categ.image}
                    alt={categ.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px"
                    }}
                  />
                ) : "No Image"}
              </TableCell>

              <TableCell>
                <Button style={{ color: "orange" }} onClick={() => onEdit(categ)}>
                  <Edit />
                </Button>
              </TableCell>

              <TableCell>
                <Button style={{ color: "red" }} onClick={() => handleDelete(categ.id)}>
                  <Delete />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Edit, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { adminApi } from "../../../admin/services/adminApi";
import UpdateHomeCategory from "./UpdateHomeCategory";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function HomeCategoryTable() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    const res = await adminApi.getHomeCategories();
    console.log("DATA FROM BACKEND", res.data);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCategory = async (id: number) => {
    await adminApi.deleteHomeCategory(id);
    fetchData();
  };

  const handleEdit = (row: any) => {
    setEditData(row);
    setOpen(true);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{row.id}</StyledTableCell>

                <StyledTableCell>
                  <img
                    src={row.image}
                    alt=""
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                    }}
                  />
                </StyledTableCell>

                <StyledTableCell>{row.categoryId}</StyledTableCell>

                <StyledTableCell align="right">
                  <Button
                    style={{ color: "orange" }}
                    onClick={() => handleEdit(row)}
                  >
                    <Edit />
                  </Button>

                  <Button
                    style={{ color: "red" }}
                    onClick={() => deleteCategory(row.id)}
                  >
                    <Delete />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UpdateHomeCategory
        open={open}
        onClose={() => setOpen(false)}
        data={editData}
        onUpdated={fetchData}
      />
    </>
  );
}

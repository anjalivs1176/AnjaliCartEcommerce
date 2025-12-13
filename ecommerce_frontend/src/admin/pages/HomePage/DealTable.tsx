import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { dealApi } from '../../../api/dealApi';

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function DealTable({ onEdit }: any) {
  const [deals, setDeals] = useState<any[]>([]);

  // Load data
  useEffect(() => {
    dealApi.getDeals().then((res) => setDeals(res.data));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this deal?")) return;
    await dealApi.deleteDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>No</StyledTableCell>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Category</StyledTableCell>
            <StyledTableCell>Discount</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
            <StyledTableCell>Delete</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {deals.map((deal, index) => (
            <TableRow key={deal.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <img
                  src={deal.image}
                  alt="deal-img"
                  className="w-16 h-16 rounded object-cover"
                />

              </TableCell>

              <TableCell>{deal.category?.title || deal.category?.categoryId}</TableCell>


              <TableCell>{deal.discount}%</TableCell>


              <TableCell>
                <Button style={{ color: "orange" }} onClick={() => onEdit(deal)}>
                  <Edit />
                </Button>
              </TableCell>


              <TableCell>
                <Button style={{ color: "red" }} onClick={() => handleDelete(deal.id)}>
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

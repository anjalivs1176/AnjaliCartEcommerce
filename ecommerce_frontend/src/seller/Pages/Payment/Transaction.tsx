import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAppSelector } from "../../../state/store";
import { Order } from "../../../state/seller/sellerTransactionsSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../../../state/store";
import { fetchSellerTransactions } from "../../../state/seller/sellerTransactionsSlice";


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
}));

const Transaction: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector(
    (state) => state.sellerTransactions
  );
  
  useEffect(() => {
  dispatch(fetchSellerTransactions());
}, [dispatch]);



  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Customer</StyledTableCell>
            <StyledTableCell align="right">Order ID</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((order: Order) => (
            <StyledTableRow key={order.id}>
              <StyledTableCell>
                {new Date(order.deliverDate).toLocaleDateString()}
              </StyledTableCell>

              <StyledTableCell>{order.user?.name}</StyledTableCell>

              <StyledTableCell align="right">{order.id}</StyledTableCell>

              <StyledTableCell align="right">
                ₹{order.totalSellingPrice}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Transaction;

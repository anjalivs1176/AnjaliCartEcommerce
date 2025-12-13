
import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { deleteProduct } from "../../../state/seller/sellerProductSlice";

import { tableCellClasses } from "@mui/material/TableCell";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../state/store";
import {
  fetchSellerProducts,
  toggleStock,
} from "../../../state/seller/sellerProductSlice";
import { Product } from "../../../type/productType";

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

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector((state) => state.sellerProduct);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not loaded yet, waiting...");
      return;
    }

    dispatch(fetchSellerProducts());
  }, []);


  if (!products || products.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        No products found. Start adding new items!
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Images</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">MRP</StyledTableCell>
            <StyledTableCell align="right">Selling Price</StyledTableCell>
            <StyledTableCell align="right">Color</StyledTableCell>
            <StyledTableCell align="right">Stock</StyledTableCell>
            <StyledTableCell align="right">Edit</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>

          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((item: Product) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {(Array.isArray(item.images) ? item.images : []).map(
                    (image: string, index: number) => (
                      <img
                        key={index}
                        style={{ width: "80px", borderRadius: "6px" }}
                        src={image || "https://via.placeholder.com/80"}
                        alt="product"
                      />
                    )
                  )}

                  {(!item.images || item.images.length === 0) && (
                    <img
                      style={{ width: "80px", borderRadius: "6px" }}
                      src="https://via.placeholder.com/80"
                      alt="placeholder"
                    />
                  )}
                </div>
              </StyledTableCell>

              <StyledTableCell>{item.title}</StyledTableCell>
              <StyledTableCell align="right">₹{item.mrpPrice}</StyledTableCell>
              <StyledTableCell align="right">
                ₹{item.sellingPrice}
              </StyledTableCell>
              <StyledTableCell align="right">{item.color}</StyledTableCell>

              <StyledTableCell align="right">
                <span
                  style={{
                    cursor: "pointer",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color:
                      item.stockStatus === "IN_STOCK" ? "green" : "red",
                  }}
                  onClick={() => {
                    const newStatus =
                      item.stockStatus === "IN_STOCK"
                        ? "OUT_OF_STOCK"
                        : "IN_STOCK";
                    dispatch(
                      toggleStock({
                        productId: item.id,
                        stockStatus: newStatus,
                      })
                    );
                  }}
                >
                  {item.stockStatus}
                </span>
              </StyledTableCell>

              <StyledTableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() =>
                    navigate(`/seller/edit-product/${item.id}`)
                  }
                >
                  <Edit />
                </IconButton>
              </StyledTableCell>

              <StyledTableCell align="right">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => dispatch(deleteProduct(item.id))}
                >
                  <Delete />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

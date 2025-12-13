import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { Delete } from "@mui/icons-material";
import { adminApi } from "../../services/adminApi";

const accountStatuses = [
  { status: "ACTIVE", title: "Active" },
  { status: "INACTIVE", title: "Inactive" }
];

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

const Coupon = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as string);
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCoupons();
      setCoupons(res.data);
    } catch (e) {
      console.error("ERROR fetching coupons:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const deleteCoupon = async (id: number) => {
    try {
      await adminApi.deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  return (
    <>
      <div className="pb-5 w-60">
        <FormControl fullWidth>
          <InputLabel id="coupon-status-label">Status</InputLabel>
          <Select
            labelId="coupon-status-label"
            id="coupon-status-select"
            value={selectedStatus}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {accountStatuses.map((item) => (
              <MenuItem key={item.status} value={item.status}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Coupon Code</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell align="right">End Date</StyledTableCell>
              <StyledTableCell align="right">Min Order Value</StyledTableCell>
              <StyledTableCell align="right">Discount %</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </StyledTableCell>
              </StyledTableRow>
            ) : coupons.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No coupons found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              coupons
                .filter((c) =>
                  selectedStatus
                    ? (c.active ? "ACTIVE" : "INACTIVE") === selectedStatus
                    : true
                )
                .map((row: any) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.code}</StyledTableCell>
                    <StyledTableCell>{row.validityStratDate}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.validityEndDate}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.minimumOrderValue}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.discountPercentage}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.active ? "ACTIVE" : "INACTIVE"}
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Button onClick={() => deleteCoupon(row.id)}>
                        <Delete />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Coupon;

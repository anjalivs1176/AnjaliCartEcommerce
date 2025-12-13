import {
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
  Button,
  CircularProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { adminApi } from "../../services/adminApi";

const accountStatuses = [
  {
    status: "PENDING_VERIFICATION",
    title: "Pending Verification",
    description:
      "The account is awaiting verification. User cannot access full features yet.",
  },
  { status: "ACTIVE", title: "Active", description: "Fully active user." },
  {
    status: "SUSPENDED",
    title: "Suspended",
    description: "Temporarily suspended due to policy violations or issues.",
  },
  {
    status: "DEACTIVATED",
    title: "Deactivated",
    description: "User voluntarily deactivated account.",
  },
  {
    status: "BANNED",
    title: "Banned",
    description: "Permanently banned due to serious violations.",
  },
  {
    status: "CLOSED",
    title: "Closed",
    description: "Permanently closed and cannot be reactivated.",
  },
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

const SellersTable = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingMap, setUpdatingMap] = useState<Record<number, boolean>>({});
  const handleFilterChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as string);
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const statusToSend = selectedStatus && selectedStatus.length > 0 ? selectedStatus : undefined;
      const response = await adminApi.getSellers(statusToSend);
      const data = response.data?.content ?? response.data;
      setSellers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  // Whenever filter changes, fetch again
  useEffect(() => {
    fetchSellers();
  }, [selectedStatus]);

  const handleRowStatusChange = async (sellerId: number, newStatus: string) => {
    try {
      setUpdatingMap((m) => ({ ...m, [sellerId]: true }));
      await adminApi.updateSellerStatus(sellerId, newStatus);

      setSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error("Failed to update seller status:", err);
    } finally {
      setUpdatingMap((m) => ({ ...m, [sellerId]: false }));
    }
  };

  return (
    <>
      <div className="pb-5 w-60">
        <FormControl fullWidth>
          <InputLabel id="account-status-label">Account Status</InputLabel>
          <Select
            labelId="account-status-label"
            id="account-status-select"
            value={selectedStatus}
            label="Account Status"
            onChange={handleFilterChange}
            displayEmpty
          >
            {accountStatuses.map((item) => (
              <MenuItem key={item.status} value={item.status} title={item.description}>
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
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell align="right">Mobile</StyledTableCell>
              <StyledTableCell align="right">Business Name</StyledTableCell>
              <StyledTableCell align="right">GSTIN</StyledTableCell>
              <StyledTableCell align="right">Account Status</StyledTableCell>
              <StyledTableCell align="right">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </StyledTableCell>
              </StyledTableRow>
            ) : sellers.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No sellers found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              sellers.map((row: any) => {
                const isUpdating = !!updatingMap[row.id];
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{row.sellerName}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell align="right">{row.mobile}</StyledTableCell>
                    <StyledTableCell align="right">{row.businessDetails?.businessName}</StyledTableCell>
                    <StyledTableCell align="right">{row.gstin}</StyledTableCell>
                    <StyledTableCell align="right">{row.accountStatus}</StyledTableCell>

                    <StyledTableCell align="right" style={{ color: "#00927c" }}>
                      <FormControl size="small" variant="standard">
                        <Select
                          value={row.status ?? ""}
                          onChange={(e) =>
                            handleRowStatusChange(row.id, e.target.value as string)
                          }
                          disabled={isUpdating}
                          title="Change seller account status"
                        >
                          {accountStatuses.map((s) => (
                            <MenuItem key={s.status} value={s.status} title={s.description}>
                              {s.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SellersTable;

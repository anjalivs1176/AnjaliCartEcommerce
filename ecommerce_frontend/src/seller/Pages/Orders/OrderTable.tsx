import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useAppDispatch } from "../../../state/store";
import { updateSellerOrderStatus } from "../../../state/seller/sellerOrdersSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function OrderTable({ orders }: { orders: any[] }) {
  const dispatch = useAppDispatch();

  const updateStatus = (orderId: number, status: string) => {
    dispatch(updateSellerOrderStatus({ orderId, status }));
  };

  const nextButton = (status: string, id: number) => {
    if (status === "PENDING") {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateStatus(id, "SHIPPED")}
        >
          SHIP
        </Button>
      );
    }

    if (status === "SHIPPED") {
      return (
        <Button
          variant="contained"
          color="success"
          onClick={() => updateStatus(id, "DELIVERED")}
        >
          DELIVER
        </Button>
      );
    }

    return <span style={{ color: "green", fontWeight: 600 }}>Completed</span>;
  };

  const formatAddress = (addr: any) => {
    if (!addr) return "--";
    return `
      ${addr.address || ""}, 
      ${addr.locality || ""}, 
      ${addr.city || ""}, 
      ${addr.state || ""} - ${addr.pinCode || ""}
    `;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Products</StyledTableCell>
            <StyledTableCell>Buyer</StyledTableCell>
            <StyledTableCell>Shipping Address</StyledTableCell>
            <StyledTableCell>Total</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Update</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <StyledTableRow key={order.id}>
              <StyledTableCell>{order.id}</StyledTableCell>

              <StyledTableCell>
                {order.orderItems.map((item: any) => (
                  <div key={item.id} style={{ display: "flex", marginBottom: "8px" }}>
                    <img
                      src={item.product.images[0]}
                      width={45}
                      height={45}
                      style={{
                        marginRight: "10px",
                        borderRadius: "4px",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <div style={{ fontWeight: 600 }}>{item.product.title}</div>
                      <div>Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </StyledTableCell>

              <StyledTableCell>{order.user?.name}</StyledTableCell>

              <StyledTableCell>{formatAddress(order.shippingAddress)}</StyledTableCell>

              <StyledTableCell>₹{order.totalSellingPrice}</StyledTableCell>

              <StyledTableCell>
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString()
                  : "--"}
              </StyledTableCell>
              <StyledTableCell>{order.orderStatus}</StyledTableCell>

              <StyledTableCell>{nextButton(order.orderStatus, order.id)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}




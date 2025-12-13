import React, { useState } from "react";
import { Drawer, Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminDrawerList from "../../components/AdminDrawerList"
import AdminRoutes from "../../../Routes/AdminRoutes";

const drawerWidth = 260;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <AdminDrawerList toggleDrawer={isMobile ? () => setOpen(false) : undefined} />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          ml: isMobile ? 0 : `${drawerWidth}px`, 
        }}
      >
        {isMobile && (
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}

        <AdminRoutes />
      </Box>
    </Box>
  );
};

export default AdminDashboard;

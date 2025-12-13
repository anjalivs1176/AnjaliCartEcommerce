import DrawerList from "../../component/DrawerList";
import {
  AccountBox,
  Add,
  Category,
  Dashboard,
  ElectricBolt,
  Home,
  IntegrationInstructions,
  LocalOffer,
  Logout,
} from "@mui/icons-material";

const menu = [
  { name: "Dashboard", path: "/admin", icon: <Dashboard />, activeIcon: <Dashboard /> },
  { name: "Coupons", path: "/admin/coupon", icon: <IntegrationInstructions />, activeIcon: <IntegrationInstructions /> },
  { name: "Add New Coupon", path: "/admin/add-coupon", icon: <Add />, activeIcon: <Add /> },
  { name: "Home Page", path: "/admin/home-grid", icon: <Home />, activeIcon: <Home /> },
  { name: "Electronics Category", path: "/admin/electronics-category", icon: <ElectricBolt />, activeIcon: <ElectricBolt /> },
  { name: "Shop By Category", path: "/admin/shop-by-category", icon: <Category />, activeIcon: <Category /> },
  { name: "Deals", path: "/admin/deals", icon: <LocalOffer />, activeIcon: <LocalOffer /> },
];

const menu2 = [
  { name: "Account", path: "/admin/account", icon: <AccountBox />, activeIcon: <AccountBox /> },
  { name: "Logout", path: "/", icon: <Logout />, activeIcon: <Logout /> },
];

const AdminDrawerList = ({ toggleDrawer }: { toggleDrawer?: () => void }) => {
  return <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />;
};

export default AdminDrawerList;

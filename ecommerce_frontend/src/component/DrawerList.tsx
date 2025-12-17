import { ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/store";
import { logout } from "../state/AuthSlice";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

interface DrawerListProps {
  menu: MenuItem[];
  menu2: MenuItem[];
  toggleDrawer?: () => void; 
}

const DrawerList = ({ menu, menu2, toggleDrawer }: DrawerListProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleNavigate = (path: string) => {
    navigate(path);
    toggleDrawer?.(); 
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
    toggleDrawer?.();
  };

  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[260px] border-r py-5">
        {/* MAIN MENU */}
        <div className="space-y-2">
          {menu.map((item, index) => {
            const isActive = item.path === location.pathname;

            return (
              <ListItem
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`cursor-pointer flex items-center gap-4 rounded-r-full px-5 py-3 transition-all
                  ${
                    isActive
                      ? "bg-primary-color text-white shadow-md"
                      : "text-primary-color hover:bg-gray-100"
                  }`}
              >
                <ListItemIcon className="min-w-min">
                  {isActive ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            );
          })}
        </div>

        <Divider />

        {/* BOTTOM MENU */}
        <div className="space-y-2">
          {menu2.map((item, index) => {
            const isActive = item.path === location.pathname;

            return (
              <ListItem
                key={index}
                onClick={() =>
                  item.path === "/" ? handleLogout() : handleNavigate(item.path)
                }
                className={`cursor-pointer flex items-center gap-4 rounded-r-full px-5 py-3 transition-all
                  ${
                    isActive
                      ? "bg-primary-color text-white shadow-md"
                      : "text-primary-color hover:bg-gray-100"
                  }`}
              >
                <ListItemIcon className="min-w-min">
                  {isActive ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DrawerList;

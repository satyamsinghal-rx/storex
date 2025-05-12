// Sidebar.tsx
import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

const Sidebar = () => {

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
    { text: "Assets", icon: <InventoryIcon />, href: "/dashboard/assets" },
    { text: "Employee", icon: <PeopleIcon />, href: "/employee" },
    { text: "Settings", icon: <SettingsIcon />, href: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          StoreX
        </Typography>
      </Toolbar>
      <List>
        {navItems.map(({ text, icon, href }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component="a" href={href}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>

  );
};

export default Sidebar;

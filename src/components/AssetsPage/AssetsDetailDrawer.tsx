import React, { useState } from "react";
import {
  Drawer,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import {
  Laptop,
  Person,
  CalendarToday,
  Devices,
  LocationOn,
} from "@mui/icons-material";

interface Asset {
  id: string;
  brand: string;
  model: string;
  serialNo: string;
  assetType: string;
  status: "Available" | "Assigned" | "Service";
  assignedTo: string | null;
  purchaseDate: string;
  type: string;
}

interface AssetDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedAsset: Asset | null;
}

export default function AssetDetailsDrawer({
  open,
  onClose,
  selectedAsset,
}: AssetDetailsDrawerProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 500,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 500,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ width: 450, padding: 2, overflowY: "auto" }}>
        {selectedAsset && (
          <>
            {/* Drawer Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">{selectedAsset.brand} ({selectedAsset.serialNo})</Typography>
              <IconButton onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </IconButton>
            </Box>

            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Information" />
              <Tab label="Timeline" />
            </Tabs>

            {/* Tab Content */}
            {tabValue === 0 && (
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Devices />
                  </ListItemIcon>
                  <ListItemText
                    primary="Brand & Model"
                    secondary={`${selectedAsset.brand} (${selectedAsset.model})`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="3" x2="9" y2="9" />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Serial Number"
                    secondary={selectedAsset.serialNo}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Purchase Date"
                    secondary={selectedAsset.purchaseDate}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Laptop />
                  </ListItemIcon>
                  <ListItemText primary="Type" secondary={selectedAsset.type} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Owned By"
                    secondary={selectedAsset.assignedTo || "RemoteState"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText primary="Remote State" secondary="—" />
                </ListItem>
              </List>
            )}

            {tabValue === 1 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body1">Timeline content goes here.</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
}
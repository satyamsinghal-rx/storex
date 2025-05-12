import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Edit, Info, Delete } from "@mui/icons-material";

interface AssetActionsMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onEdit: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
}

export default function AssetActionsMenu({
  anchorEl,
  onClose,
  onEdit,
  onViewDetails,
  onDelete,
}: AssetActionsMenuProps) {
  const open = Boolean(anchorEl);

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onViewDetails();
          onClose();
        }}
      >
        <ListItemIcon>
          <Info fontSize="small" />
        </ListItemIcon>
        <ListItemText>View Details</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        sx={{ color: "error.main" }}
      >
        <ListItemIcon sx={{ color: "error.main" }}>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}

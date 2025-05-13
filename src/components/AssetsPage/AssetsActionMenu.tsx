import React from "react";
import {
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from "@mui/material";

interface AssetActionsMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
}

export default function AssetActionsMenu({
  anchorEl,
  onClose,
  onViewDetails,
  onDelete,
}: AssetActionsMenuProps) {
  const open = Boolean(anchorEl);

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem
        onClick={() => {
          onClose();
        }}
      >

        <ListItemText>Assign</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onViewDetails();
          onClose();
        }}
      >

        <ListItemText>Sent to Service</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
      >

        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}

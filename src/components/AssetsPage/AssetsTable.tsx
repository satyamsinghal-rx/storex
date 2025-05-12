import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Drawer,
  Typography,
  Divider,
} from "@mui/material";
import { Edit, Info, MoreVert } from "@mui/icons-material";

interface Asset {
  id: number;
  brand: string;
  model: string;
  serialNo: string;
  assetType: string;
  status: "Available" | "Assigned" | "Service";
  assignedTo: string | null;
  purchaseDate: string;
  type: string;
}

interface AssetsTableProps {
  assets: Asset[];
  page: number;
  rowsPerPage: number;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>, assetId: number) => void;
}

const getStatusChipColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "success";
    case "assigned":
      return "primary";
    case "service":
      return "warning";
    default:
      return "default";
  }
};

export default function AssetsTable({
  assets,
  page,
  rowsPerPage,
  onMenuOpen,
}: AssetsTableProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleDrawerOpen = (asset: Asset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedAsset(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="assets table">
          <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Serial No.</TableCell>
              <TableCell>Asset Type</TableCell>
              <TableCell>Asset Status</TableCell>
              <TableCell>Assigned Employee</TableCell>
              <TableCell>Purchased Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.brand}</TableCell>
                  <TableCell>{asset.model}</TableCell>
                  <TableCell>{asset.serialNo}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={asset.status}
                      color={getStatusChipColor(asset.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{asset.assignedTo || "None"}</TableCell>
                  <TableCell>{asset.purchaseDate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDrawerOpen(asset)}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => onMenuOpen(e, asset.id)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ width: 350, flexShrink: 0 }}
      >
        <Box
          sx={{
            width: 350,
            padding: 2,
            overflowY: "auto",
          }}
        >
          {selectedAsset && (
            <>
              <Typography variant="h6" gutterBottom>
                Asset Details
              </Typography>
              <Divider />
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1"><strong>Brand:</strong> {selectedAsset.brand}</Typography>
                <Typography variant="body1"><strong>Model:</strong> {selectedAsset.model}</Typography>
                <Typography variant="body1"><strong>Serial No.:</strong> {selectedAsset.serialNo}</Typography>
                <Typography variant="body1"><strong>Asset Type:</strong> {selectedAsset.type}</Typography>
                <Typography variant="body1"><strong>Status:</strong> {selectedAsset.status}</Typography>
                <Typography variant="body1"><strong>Assigned To:</strong> {selectedAsset.assignedTo || "None"}</Typography>
                <Typography variant="body1"><strong>Purchase Date:</strong> {selectedAsset.purchaseDate}</Typography>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}

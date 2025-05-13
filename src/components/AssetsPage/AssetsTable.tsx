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
} from "@mui/material";
import { Edit, Info, MoreVert } from "@mui/icons-material";
import AssetDetailsDrawer from "@/components/AssetsPage/AssetsDetailDrawer";
import EditAssetDrawer from "./EditAssetDrawer";

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
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);


  const handleDetailsDrawerOpen = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailsDrawerOpen(true);
  };

  const handleEditDrawerOpen = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDetailsDrawerOpen(false);
    setEditDrawerOpen(false);
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
                      <IconButton size="small" onClick={() => handleEditDrawerOpen(asset)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDetailsDrawerOpen(asset)}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => onMenuOpen(e, Number(asset.id))}
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

      <AssetDetailsDrawer
        open={detailsDrawerOpen}
        onClose={handleDrawerClose}
        selectedAsset={selectedAsset}
      />
      <EditAssetDrawer
        open={editDrawerOpen}
        onClose={handleDrawerClose}
        assetDetails={selectedAsset}
      />
    </>
  );
}
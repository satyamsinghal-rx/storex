"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Card, CircularProgress } from "@mui/material";
import AssetsHeader from "@/components/AssetsPage/AssetsHeader";
import AssetsTable from "@/components/AssetsPage/AssetsTable";
import AssetsPagination from "@/components/AssetsPage/AssetsPagination";
import AssetActionsMenu from "@/components/AssetsPage/AssetsActionMenu";
import { getAssets } from "@/lib/api";
import { Asset } from "@/lib/types";



export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAssetId, setMenuAssetId] = useState<string | null>(null);

  const {
    data: assets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });


  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, assetId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuAssetId(assetId.toString());
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuAssetId(null);
  };



  const handleViewDetails = () => {
    const selected = assets?.find((asset: Asset) => asset.id === menuAssetId);
    if (selected) {
      console.log("Viewing details for:", selected);
    }
  };

  const handleDeleteAsset = () => {
    console.log("Deleting asset with ID:", menuAssetId);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        Error fetching assets
      </Box>
    );
  }

  const filteredAssets = assets.filter((asset: Asset) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      asset.brand.toLowerCase().includes(query) ||
      asset.model.toLowerCase().includes(query) ||
      asset.serialNo.toLowerCase().includes(query) ||
      asset.assignedTo?.toLowerCase().includes(query);
  
    const matchesType = typeFilter.length === 0 || typeFilter.includes(asset.type);
    const matchesStatus = !statusFilter || asset.status.toLowerCase() === statusFilter.toLowerCase();
  
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Card sx={{ p: 2 }}>
      <AssetsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assetTypes={Array.from(new Set(assets?.map((asset: Asset) => asset.type) || []))}
        statuses={Array.from(new Set(assets?.map((asset: Asset) => asset.status) || []))}
      />
      <AssetsTable assets={filteredAssets} page={page} rowsPerPage={rowsPerPage} onMenuOpen={handleOpenMenu} />
      <AssetsPagination
        totalAssets={assets?.length || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
      <AssetActionsMenu
        anchorEl={menuAnchorEl}
        onClose={handleCloseMenu}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteAsset}
      />
    </Card>
  );
}

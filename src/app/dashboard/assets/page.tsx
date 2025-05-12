// "use client";

// import type React from "react";
// import { useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Breadcrumbs,
//   Link,
//   IconButton,
//   Chip,
//   Menu,
//   MenuItem,
//   InputAdornment,
//   Select,
//   FormControl,
//   InputLabel,
//   type SelectChangeEvent,
// } from "@mui/material";
// import {
//   Search,
//   Edit,
//   MoreVert,
//   Info,
//   NavigateNext,
//   NavigateBefore,
//   FirstPage,
//   LastPage,
//   FilterList,
// } from "@mui/icons-material";
// import { ThemeProvider } from "@/components/ThemeProvider";
// import { useQuery } from "@tanstack/react-query";
// import { getAssets } from "@/lib/api";

// interface Asset {
//   id: number;
//   brand: string;
//   model: string;
//   serialNo: string;
//   assetType: string;
//   status: "Available" | "Assigned" | "Service";
//   assignedTo: string | null;
//   purchasedDate: string;
//   type: string;
// }

// export default function AssetsPage() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedAsset, setSelectedAsset] = useState<number | null>(null);

//   const { data } = useQuery({
//     queryKey: ["assets"],
//     queryFn: getAssets,
//   });

//   console.log(data);

//   const filteredAssets = (data ?? []).filter((asset: Asset) => {
//     const matchesSearch =
//       asset.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       asset.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (asset.assignedTo &&
//         asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

//     const matchesType = typeFilter === "" || asset.type === typeFilter;
//     const matchesStatus = statusFilter === "" || asset.status === statusFilter;

//     return matchesSearch && matchesType && matchesStatus;
//   });

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(Number.parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleMenuOpen = (
//     event: React.MouseEvent<HTMLElement>,
//     assetId: number
//   ) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedAsset(assetId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedAsset(null);
//   };

//   const handleTypeFilterChange = (event: SelectChangeEvent) => {
//     setTypeFilter(event.target.value);
//   };

//   const handleStatusFilterChange = (event: SelectChangeEvent) => {
//     setStatusFilter(event.target.value);
//   };

//   const getStatusChipColor = (status: "available" | "assigned" | "service") => {
//     switch (status) {
//       case "available":
//         return "success";
//       case "assigned":
//         return "primary";
//       case "service":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   const assetTypes = Array.from(
//     new Set((data ?? []).map((asset: Asset) => asset.type))
//   );
//   const statuses = Array.from(
//     new Set((data ?? []).map((asset: Asset) => asset.status))
//   );

//   return (
//     <ThemeProvider>
//       <Box sx={{ p: 3 }}>
//         {/* Breadcrumbs */}
//         <Breadcrumbs
//           separator={<NavigateNext fontSize="small" />}
//           aria-label="breadcrumb"
//           sx={{ mb: 3 }}
//         >
//           <Link underline="hover" color="inherit" href="/dashboard">
//             Dashboard
//           </Link>
//           <Typography color="text.primary">Assets</Typography>
//         </Breadcrumbs>

//         {/* Search and Filters */}
//         <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
//           <TextField
//             placeholder="Search"
//             variant="outlined"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ width: 300 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <FormControl size="small" sx={{ minWidth: 120 }}>
//               <InputLabel id="type-filter-label">Type</InputLabel>
//               <Select
//                 labelId="type-filter-label"
//                 id="type-filter"
//                 value={typeFilter}
//                 label="Type"
//                 onChange={handleTypeFilterChange}
//                 startAdornment={
//                   <FilterList fontSize="small" sx={{ mr: 0.5 }} />
//                 }
//               >
//                 <MenuItem value="">
//                   <em>All</em>
//                 </MenuItem>
//                 {assetTypes.map((type) => (
//                   <MenuItem key={type} value={type}>
//                     {type}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             {typeFilter && (
//               <Chip label={typeFilter} size="small" variant="outlined" />
//             )}
//           </Box>

//           <FormControl size="small" sx={{ minWidth: 120 }}>
//             <InputLabel id="status-filter-label">Status</InputLabel>
//             <Select
//               labelId="status-filter-label"
//               id="status-filter"
//               value={statusFilter}
//               label="Status"
//               onChange={handleStatusFilterChange}
//               startAdornment={<FilterList fontSize="small" sx={{ mr: 0.5 }} />}
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               {statuses.map((status) => (
//                 <MenuItem key={status} value={status}>
//                   {status}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <Box sx={{ flexGrow: 1 }} />

//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<span>+</span>}
//           >
//             Add Asset
//           </Button>
//         </Box>

//         {/* Assets Table */}
//         <TableContainer component={Paper} sx={{ mb: 2 }}>
//           <Table sx={{ minWidth: 650 }} aria-label="assets table">
//             <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
//               <TableRow>
//                 <TableCell>Brand</TableCell>
//                 <TableCell>Model</TableCell>
//                 <TableCell>Serial No.</TableCell>
//                 <TableCell>Asset Type</TableCell>
//                 <TableCell>Asset Status</TableCell>
//                 <TableCell>Assigned Employee</TableCell>
//                 <TableCell>Purchased Date</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredAssets
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((asset) => (
//                   <TableRow key={asset.id}>
//                     <TableCell>{asset.brand}</TableCell>
//                     <TableCell>{asset.model}</TableCell>
//                     <TableCell>{asset.serialNo}</TableCell>
//                     <TableCell>{asset.type}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={asset.status}
//                         color={getStatusChipColor(asset.status) as any}
//                         size="small"
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell>{asset.assignedTo || "None"}</TableCell>
//                     <TableCell>{asset.purchaseDate}</TableCell>
//                     <TableCell>
//                       <Box sx={{ display: "flex" }}>
//                         <IconButton size="small">
//                           <Edit fontSize="small" />
//                         </IconButton>
//                         <IconButton size="small">
//                           <Info fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleMenuOpen(e, asset.id)}
//                         >
//                           <MoreVert fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             0 of 126 row(s) selected.
//           </Typography>

//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Typography variant="body2" sx={{ mr: 2 }}>
//               Rows per page:
//             </Typography>
//             <Select
//               value={rowsPerPage.toString()}
//               onChange={(e) =>
//                 handleChangeRowsPerPage(
//                   e as React.ChangeEvent<HTMLInputElement>
//                 )
//               }
//               size="small"
//               sx={{ mr: 2, minWidth: 70 }}
//             >
//               <MenuItem value={5}>5</MenuItem>
//               <MenuItem value={10}>10</MenuItem>
//               <MenuItem value={25}>25</MenuItem>
//             </Select>

//             <Typography variant="body2" sx={{ mr: 2 }}>
//               Page {page + 1} of{" "}
//               {Math.ceil(filteredAssets.length / rowsPerPage)}
//             </Typography>

//             <IconButton disabled={page === 0} onClick={() => setPage(0)}>
//               <FirstPage />
//             </IconButton>
//             <IconButton disabled={page === 0} onClick={() => setPage(page - 1)}>
//               <NavigateBefore />
//             </IconButton>
//             <IconButton
//               disabled={
//                 page >= Math.ceil(filteredAssets.length / rowsPerPage) - 1
//               }
//               onClick={() => setPage(page + 1)}
//             >
//               <NavigateNext />
//             </IconButton>
//             <IconButton
//               disabled={
//                 page >= Math.ceil(filteredAssets.length / rowsPerPage) - 1
//               }
//               onClick={() =>
//                 setPage(Math.ceil(filteredAssets.length / rowsPerPage) - 1)
//               }
//             >
//               <LastPage />
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Asset Actions Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
//           <MenuItem onClick={handleMenuClose}>Edit Asset</MenuItem>
//           <MenuItem onClick={handleMenuClose}>Delete Asset</MenuItem>
//         </Menu>
//       </Box>
//     </ThemeProvider>
//   );
// }


"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Card, CircularProgress } from "@mui/material";
import AssetsHeader from "@/components/AssetsPage/AssetsHeader";
import AssetsTable from "@/components/AssetsPage/AssetsTable";
import AssetsPagination from "@/components/AssetsPage/AssetsPagination";
import AssetActionsMenu from "@/components/AssetsPage/AssetsActionMenu";
import { getAssets } from "@/lib/api";

interface Asset {
  id: number;
  brand: string;
  model: string;
  serialNo: string;
  assetType: string;
  status: "Available" | "Assigned" | "Service";
  assignedTo: string | null;
  purchasedDate: string;
  type: string;
}

export default function AssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
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

  console.log(assets);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, assetId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuAssetId(assetId.toString());
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuAssetId(null);
  };

  const handleEditAsset = () => {
    const selected = assets?.find((asset: Asset) => asset.id === Number(menuAssetId));
    if (selected) {
      setSelectedAsset(selected);
    }
  };

  const handleViewDetails = () => {
    const selected = assets?.find((asset: Asset) => asset.id === Number(menuAssetId));
    if (selected) {
      // Implement view details logic here
      console.log("Viewing details for:", selected);
    }
  };

  const handleDeleteAsset = () => {
    // Implement delete logic here
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

  const paginatedAssets = assets?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

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
      <AssetsTable assets={paginatedAssets} page={page} rowsPerPage={rowsPerPage} onMenuOpen={handleOpenMenu} />
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
        onEdit={handleEditAsset}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteAsset}
      />
    </Card>
  );
}

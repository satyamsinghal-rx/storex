import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Breadcrumbs,
  Typography,

} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import Link from "next/link";
import { NavigateNext } from "@mui/icons-material";
import AddAssetDrawer from "./AddAssetDrawer";
import TypeFilterSelect from "./TypeFilter";

interface AssetsHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  typeFilter: string[];
  setTypeFilter: (value: string[]) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  assetTypes: string[];
  statuses: string[];
}

export default function AssetsHeader({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  assetTypes,
  statuses,
}: AssetsHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatusFilter(e.target.value);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 1 }}
        >
          <Link color="inherit" href="/dashboard">
            Dashboard
          </Link>
          <Typography color="text.primary">Assets</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ display: "flex", mb: 2, gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 500 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TypeFilterSelect
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          assetTypes={assetTypes}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Status"
            onChange={handleStatusChange}
            startAdornment={<FilterList fontSize="small" sx={{ mr: 0.5 }} />}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {statuses?.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          onClick={handleDrawerOpen}
          variant="contained"
          sx={{ backgroundColor: "black" }}
          startIcon={<span>+</span>}
        >
          Add Asset
        </Button>

        <AddAssetDrawer open={drawerOpen} onClose={handleDrawerClose} />
      </Box>
    </Box>
  );
}

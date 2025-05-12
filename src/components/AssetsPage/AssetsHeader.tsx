import React from "react";
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
  Chip,
  Breadcrumbs,
  Typography,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import Link from "next/link";
import { NavigateNext } from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

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
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

//   const handleTypeChange = (e: SelectChangeEvent) => {
//     setTypeFilter(e.target.value);
//   };

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
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={assetTypes}
            value={typeFilter}
            onChange={(_, newValue) => {

              setTypeFilter(newValue);
            }}
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props;
                return (
                  <li key={key} {...rest}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}}
            style={{ width: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
                size="small"
                placeholder="Type"
              />
            )}
          />
          {typeFilter && (
            <Chip label={typeFilter} size="small" variant="outlined" />
          )}
        </Box>

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

        <Button variant="contained" color="primary" startIcon={<span>+</span>}>
          Add Asset
        </Button>
      </Box>
    </Box>
  );
}

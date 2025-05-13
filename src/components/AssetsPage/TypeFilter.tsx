// src/components/AssetsPage/TypeFilterSelect.tsx

import React from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Checkbox,
  ListItemText,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";

interface TypeFilterSelectProps {
  typeFilter: string[];
  setTypeFilter: (value: string[]) => void;
  assetTypes: string[];
}

export default function TypeFilterSelect({
  typeFilter,
  setTypeFilter,
  assetTypes,
}: TypeFilterSelectProps) {
  const handleClearFilters = (event: React.MouseEvent) => {
    event.stopPropagation();
    setTypeFilter([]);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={assetTypes}
        value={typeFilter}
        onChange={(_, newValue) => setTypeFilter(newValue)}
        getOptionLabel={(option) => option}
        renderOption={(props, option, { selected }) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
              <Checkbox
                checked={selected}
                sx={{ mr: 1, "& .MuiSvgIcon-root": { fontSize: 20 } }}
              />
              <ListItemText primary={option} />
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Type"
            size="small"
            placeholder={typeFilter.length === 0 ? "Type" : ""}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: 20, color: "action.active" }}
                    />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { p: "4px 8px" },
              "& .MuiInputLabel-root": {
                top: "-2px",
                fontSize: "0.875rem",
              },
              "& .MuiInputBase-input": { fontSize: "0.875rem" },
            }}
          />
        )}
        renderTags={() => null}
        PaperComponent={(props) => (
          <Box
            {...props}
            sx={{
              backgroundColor: "white",
              pb: "8px",
              "& .MuiAutocomplete-listbox": { pb: 0 },
            }}
          >
            {props.children}
            <Box
              sx={{
                p: "8px 16px",
                borderTop: "1px solid",
                borderColor: "divider",
                textAlign: "right",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
                onClick={handleClearFilters}
                onMouseDown={(e) => e.preventDefault()}
              >
                Clear filters
              </Typography>
            </Box>
          </Box>
        )}
        sx={{
          width: 200,
          "& .MuiAutocomplete-option": { fontSize: "0.875rem" },
          "& .MuiAutocomplete-paper": {
            boxShadow:
              "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
          },
        }}
      />

      {typeFilter.length > 0 &&
        (typeFilter.length <= 2 ? (
          typeFilter.map((type: string) => (
            <Chip
              key={type}
              label={type}
              size="small"
              variant="outlined"
              onDelete={() =>
                setTypeFilter(typeFilter.filter((t: string) => t !== type))
              }
              deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
              sx={{
                mr: 0.5,
                mt: 1,
                borderRadius: "4px",
                fontSize: "0.75rem",
                height: "24px",
                "& .MuiChip-label": { px: "8px" },
                "& .MuiChip-deleteIcon": { ml: "4px" },
              }}
            />
          ))
        ) : (
          <Chip
            label={`${typeFilter.length} selected`}
            size="small"
            variant="outlined"
            sx={{
              mt: 1,
              borderRadius: "4px",
              fontSize: "0.75rem",
              height: "24px",
              "& .MuiChip-label": { px: "8px" },
            }}
          />
        ))}
    </Box>
  );
}

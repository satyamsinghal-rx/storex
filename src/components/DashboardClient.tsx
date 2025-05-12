"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const SummaryCard = styled(Card)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    backgroundColor: selected ? "#d0e7ff" : "#f0f7ff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    padding: theme.spacing(2),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#e0f0ff",
    },
  })
);

type AssetByType = {
    [key: string]: number;
  };
  
  type DashboardData = {
    total: {
      count: number;
      byType: AssetByType;
    };
    assigned: {
      count: number;
      byType: AssetByType;
    };
    available: {
      count: number;
      byType: AssetByType;
    };
  };
  
  type DashboardClientProps = {
    data: DashboardData;
  };
  
const DashboardClient: React.FC<DashboardClientProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<"total" | "assigned" | "available">("total");

  const assetTypesMap = {
    total: data.total.byType,
    assigned: data.assigned.byType,
    available: data.available.byType,
  };

  const displayedAssets = Object.entries(assetTypesMap[selectedCategory]).map(
    ([name, quantity]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      quantity: quantity as number,
    })
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
        mb={4}
        sx={{
          "& > *": {
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(33.33% - 16px)",
            },
          },
        }}
      >
        <Box>
          <SummaryCard
            selected={selectedCategory === "total"}
            onClick={() => setSelectedCategory("total")}
          >
            <CardContent>
              <Typography variant="h6">Total Assets</Typography>
              <Typography variant="h4">{data.total.count}</Typography>
              <Typography color="textSecondary">
                Total assets in the company
              </Typography>
            </CardContent>
          </SummaryCard>
        </Box>
        <Box>
          <SummaryCard
            selected={selectedCategory === "assigned"}
            onClick={() => setSelectedCategory("assigned")}
          >
            <CardContent>
              <Typography variant="h6">Assigned Assets</Typography>
              <Typography variant="h4">{data.assigned.count}</Typography>
              <Typography color="textSecondary">
                Assets which are assigned to employees
              </Typography>
            </CardContent>
          </SummaryCard>
        </Box>
        <Box>
          <SummaryCard
            selected={selectedCategory === "available"}
            onClick={() => setSelectedCategory("available")}
          >
            <CardContent>
              <Typography variant="h6">Available Assets</Typography>
              <Typography variant="h4">{data.available.count}</Typography>
              <Typography color="textSecondary">
                Assets which are ready to be assigned
              </Typography>
            </CardContent>
          </SummaryCard>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Asset Name</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">Asset Quantity</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedAssets.map((asset) => (
              <TableRow key={asset.name}>
                <TableCell>{asset.name}</TableCell>
                <TableCell align="right">{asset.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashboardClient;

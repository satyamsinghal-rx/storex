"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

type AssetType = 'laptop' | 'mobile' | 'monitor' | 'pendrive' | 'sim' | 'accessories' | 'ram' | 'hardisk';
type DashboardTab = 'total' | 'assigned' | 'available';

const fetchDashboardData = async (tab: DashboardTab) => {
  const response = await axios.get(`/api/dashboard?tab=${tab}`);
  return response.data;
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'total';
  const [tab, setTab] = useState<DashboardTab>(initialTab);

  useEffect(() => {
    const newTab = (searchParams.get('tab') as DashboardTab) || 'total';
    setTab(newTab);
  }, [searchParams]);

  const { data, error, isLoading } = useQuery({
    queryKey: ['dashboardData', tab],
    queryFn: () => fetchDashboardData(tab),
  });

  const handleTabClick = (newTab: DashboardTab) => {
    setTab(newTab);
    router.push(`?tab=${newTab}`);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {(error as Error).message}</Typography>;

  const total = data?.total || 0;
  const assigned = data?.assigned || 0;
  const available = data?.available || 0;
  const byType = data?.byType || {};

  const assetTypes: AssetType[] = [
    'laptop',
    'mobile',
    'monitor',
    'pendrive',
    'sim',
    'accessories',
    'ram',
    'hardisk',
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ padding: 2, backgroundColor: tab === 'total' ? '#e3f2fd' : 'inherit', cursor: 'pointer' }}
            onClick={() => handleTabClick('total')}
          >
            <Typography variant="h6">Total Assets</Typography>
            <Typography variant="h4">{total}</Typography>
            <Typography>Total assets in the company</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ padding: 2, backgroundColor: tab === 'assigned' ? '#e3f2fd' : 'inherit', cursor: 'pointer' }}
            onClick={() => handleTabClick('assigned')}
          >
            <Typography variant="h6">Assigned Assets</Typography>
            <Typography variant="h4">{assigned}</Typography>
            <Typography>Assets which are assigned to employees</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{ padding: 2, backgroundColor: tab === 'available' ? '#e3f2fd' : 'inherit', cursor: 'pointer' }}
            onClick={() => handleTabClick('available')}
          >
            <Typography variant="h6">Available Assets</Typography>
            <Typography variant="h4">{available}</Typography>
            <Typography>Assets which are ready to be assigned</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Asset Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetTypes.map((type) => (
              <TableRow key={type}>
                <TableCell>{type.charAt(0).toUpperCase() + type.slice(1)}</TableCell>
                <TableCell>{byType[type] || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
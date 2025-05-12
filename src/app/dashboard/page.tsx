// "use client";

// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { getDashboardData } from "@/lib/api";

// const SummaryCard = styled(Card)<{ selected?: boolean }>(
//   ({ theme, selected }) => ({
//     backgroundColor: selected ? "#d0e7ff" : "#f0f7ff",
//     borderRadius: "12px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     textAlign: "center",
//     padding: theme.spacing(2),
//     cursor: "pointer",
//     "&:hover": {
//       backgroundColor: "#e0f0ff",
//     },
//   })
// );

// const Dashboard = () => {
//   const [selectedCategory, setSelectedCategory] = useState("total");

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["dashboardData"],
//     queryFn: getDashboardData,
//   });

//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error || !data) {
//     return (
//       <Box p={3}>
//         <Typography color="error">
//           Error: {error?.message || "No data available"}
//         </Typography>
//       </Box>
//     );
//   }

//   const TotalAssetTypes = Object.keys(data.total.byType).map((type) => ({
//     name: type.charAt(0).toUpperCase() + type.slice(1),
//     quantity: data.total.byType[type],
//   }));

//   const AssignedAssetTypes = Object.keys(data.assigned.byType).map((type) => ({
//     name: type.charAt(0).toUpperCase() + type.slice(1),
//     quantity: data.assigned.byType[type],
//   }));

//   const AvailableAssetTypes = Object.keys(data.available.byType).map(
//     (type) => ({
//       name: type.charAt(0).toUpperCase() + type.slice(1),
//       quantity: data.available.byType[type],
//     })
//   );

//   const displayedAssetTypes =
//     selectedCategory === "total"
//       ? TotalAssetTypes
//       : selectedCategory === "assigned"
//       ? AssignedAssetTypes
//       : AvailableAssetTypes;

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Dashboard
//       </Typography>

//       {/* Summary Cards */}
//       <Box
//         display="flex"
//         flexWrap="wrap"
//         gap={3} // Replaces spacing={3}
//         mb={4}
//         sx={{
//           // Responsive breakpoints similar to Grid's xs and sm
//           "& > *": {
//             flex: {
//               xs: "1 1 100%", // Full width on extra small screens
//               sm: "1 1 calc(33.33% - 16px)", // 3 cards per row on small screens and up
//             },
//           },
//         }}
//       >
//         <Box>
//           <SummaryCard
//             selected={selectedCategory === "total"}
//             onClick={() => setSelectedCategory("total")}
//           >
//             <CardContent>
//               <Typography variant="h6">Total Assets</Typography>
//               <Typography variant="h4">{data.total.count}</Typography>
//               <Typography color="textSecondary">
//                 Total assets in the company
//               </Typography>
//             </CardContent>
//           </SummaryCard>
//         </Box>
//         <Box>
//           <SummaryCard
//             selected={selectedCategory === "assigned"}
//             onClick={() => setSelectedCategory("assigned")}
//           >
//             <CardContent>
//               <Typography variant="h6">Assigned Assets</Typography>
//               <Typography variant="h4">{data.assigned.count}</Typography>
//               <Typography color="textSecondary">
//                 Assets which are assigned to employees
//               </Typography>
//             </CardContent>
//           </SummaryCard>
//         </Box>
//         <Box>
//           <SummaryCard
//             selected={selectedCategory === "available"}
//             onClick={() => setSelectedCategory("available")}
//           >
//             <CardContent>
//               <Typography variant="h6">Available Assets</Typography>
//               <Typography variant="h4">{data.available.count}</Typography>
//               <Typography color="textSecondary">
//                 Assets which are ready to be assigned
//               </Typography>
//             </CardContent>
//           </SummaryCard>
//         </Box>
//       </Box>

//       {/* Asset Table */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Typography variant="h6">Asset Name</Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography variant="h6">Asset Quantity</Typography>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {displayedAssetTypes.map((asset) => (
//               <TableRow key={asset.name}>
//                 <TableCell>{asset.name}</TableCell>
//                 <TableCell align="right">{asset.quantity}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default Dashboard;

import { cookies } from "next/headers";
import { getDashboardData } from "@/lib/api";
import DashboardClient from "@/components/DashboardClient";
import { redirect } from "next/navigation"; 
import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const cookieStore = cookies();
  const cookieArray = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`);
  const cookieHeader = cookieArray.join("; ");
  const data = await getDashboardData(cookieHeader);
  return <DashboardClient data={data} />;
};

export default DashboardPage;

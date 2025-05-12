import React from "react";
import { TablePagination } from "@mui/material";

interface AssetsPaginationProps {
  totalAssets: number;
  rowsPerPage: number;
  page: number;
  setPage: (newPage: number) => void;
  setRowsPerPage: (newRows: number) => void;
}

export default function AssetsPagination({
  totalAssets,
  rowsPerPage,
  page,
  setPage,
  setRowsPerPage,
}: AssetsPaginationProps) {
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <TablePagination
      component="div"
      count={totalAssets}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50]}
    />
  );
}

import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { red } from "@mui/material/colors";

export default function PositionTable({ rows, side, sendCancelMessage }) {
  const columns = [
    {
      field: "cancel",
      headerName: "",
      width: 40,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const onClick = (e) => {
          sendCancelMessage(params.row.id, params.row.asset);
        };
        return (
          <IconButton aria-label="delete" onClick={onClick}>
            <CloseIcon sx={{ fontSize: 10, color: red[500] }} />
          </IconButton>
        );
      },
    },
    {
      field: "asset",
      headerName: "Asset",
      width: 60,
      type: "number",
    },
    {
      field: "quantity",
      headerName: "Q",
      width: 50,
      type: "number",
    },
    {
      field: "price",
      headerName: "P",
      width: 50,
      type: "number",
      valueFormatter: (value) =>
        value == null ? "" : `$${value.toLocaleString()}`,
    },
  ];
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        sorting: {
          sortModel: [{ field: "id", sort: "asc" }],
        },
      }}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      disableColumnSorting
      disableColumnMenu
      columnGroupingModel={[
        {
          groupId: side,
          children: [
            { field: "cancel" },
            { field: "asset" },
            { field: "price" },
            { field: "quantity" },
          ],
          headerAlign: "center",
        },
      ]}
      rowHeight={25}
      columnHeaderHeight={25}
      hideFooter
      disableColumnFilter
    />
  );
}

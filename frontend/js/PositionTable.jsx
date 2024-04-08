import CancelIcon from "@mui/icons-material/Cancel";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import React from "react";
import TableTitle from "./TableTitle";
import { red } from "@mui/material/colors";

export default function PositionTable({ rows, side, sendCancelMessage }) {
  function PositionTableTitle() {
    return <TableTitle title={side} />;
  }

  const columns = [
    {
      field: "cancel",
      headerName: "",
      maxWidth: 50,
      flex: 1,
      align: "center",
      renderCell: (params) => {
        const onClick = (e) => {
          sendCancelMessage(params.row.id, params.row.asset);
        };
        return (
          <IconButton aria-label="delete" onClick={onClick} sx={{ padding: 0 }}>
            <CancelIcon sx={{ fontSize: 20, color: red[500] }} />
          </IconButton>
        );
      },
    },
    {
      field: "asset",
      headerName: "Asset",
      minWidth: 60,
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Q",
      minWidth: 50,
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "P",
      minWidth: 50,
      flex: 1,
      type: "number",
      align: "center",
      headerAlign: "center",
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
      rowHeight={25}
      columnHeaderHeight={25}
      hideFooter
      disableColumnFilter
      disableColumnResize
      slots={{
        toolbar: PositionTableTitle,
      }}
    />
  );
}

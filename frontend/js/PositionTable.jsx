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
      width: 50,
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
      width: 60,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Q",
      width: 50,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "P",
      width: 50,
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
      // columnGroupingModel={[
      //   {
      //     groupId: side,
      //     children: [
      //       { field: "cancel" },
      //       { field: "asset" },
      //       { field: "price" },
      //       { field: "quantity" },
      //     ],
      //     headerAlign: "center",
      //   },
      // ]}
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

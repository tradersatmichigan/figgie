import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const columns = [
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

export default function OrderTable({ side, rows }) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        sorting: {
          sortModel: [
            { field: "price", sort: side === "Bids" ? "desc" : "asc" },
          ],
        },
      }}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      disableColumnSorting
      disableColumnMenu
      columnGroupingModel={[
        {
          groupId: side,
          children: [{ field: "price" }, { field: "quantity" }],
          headerAlign: "center",
        },
      ]}
      rowHeight={25}
      columnHeaderHeight={25}
      hideFooter
      // filterModel={{
      //   items: [{ field: "quantity", operator: ">", value: "0" }],
      // }}
      disableColumnFilter
    />
  );
}

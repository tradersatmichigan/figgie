import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import TableTitle from "./TableTitle";

const columns = [
  {
    field: "price",
    headerName: "P",
    flex: 1,
    type: "number",
    align: "center",
    headerAlign: "center",
    valueFormatter: (value) =>
      value == null ? "" : `$${value.toLocaleString()}`,
  },
  {
    field: "quantity",
    headerName: "Q",
    flex: 1,
    type: "number",
    align: "center",
    headerAlign: "center",
  },
];

export default function OrderTable({ side, rows }) {
  function OrderTableTitle() {
    return <TableTitle title={side} />;
  }
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
      rowHeight={25}
      columnHeaderHeight={25}
      hideFooter
      // We hopefully won't need this, but will uncomment for production
      // filterModel={{
      //   items: [{ field: "quantity", operator: ">", value: "0" }],
      // }}
      disableColumnFilter
      disableColumnResize
      slots={{
        toolbar: OrderTableTitle,
      }}
    />
  );
}

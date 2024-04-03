import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const columns = [
  {
    field: "id",
    headerName: "Rank",
    width: 55,
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
  },
  {
    field: "value",
    headerName: "Portfolio Value",
    width: 200,
    type: "number",
    align: "right",
    valueFormatter: (value) =>
      value == null ? "" : `$${value.toLocaleString()}`,
  },
];

export default function Leaderboard({ rows, username }) {
  return (
    <DataGrid
      sx={{
        "& .leaderboard-user-row": {
          backgroundColor: "info.dark",
        },
      }}
      rows={rows}
      columns={columns}
      initialState={{
        sorting: {
          sortModel: [{ field: "value", sort: "desc" }],
        },
      }}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      disableColumnSorting
      disableColumnMenu
      // columnGroupingModel={[
      //   {
      //     groupId: side,
      //     children: [{ field: "price" }, { field: "quantity" }],
      //     headerAlign: "center",
      //   },
      // ]}
      rowHeight={25}
      columnHeaderHeight={25}
      hideFooter
      // filterModel={{
      //   items: [{ field: "quantity", operator: ">", value: "0" }],
      // }}
      disableColumnFilter
      getRowClassName={(params) =>
        params.row.username === username ? "leaderboard-user-row" : null
      }
    />
  );
}

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "quantity",
    headerName: "Q",
    width: 50,
  },
  {
    field: "price",
    headerName: "P",
    width: 50,
    valueFormatter: (value) =>
      value == null ? "" : `$${value.toLocaleString()}`,
  },
];

export default function OrderBook({ bids, asks }) {
  let id = 1;
  const bidList = Object.entries(bids)
    .filter(([price, quantity]) => price > 0)
    .map(([price, quantity]) => ({
      id: id++,
      price: price,
      quantity: quantity,
    }));

  id = 1;
  const askList = Object.entries(asks)
    .filter(([price, quantity]) => price > 0)
    .map(([price, quantity]) => ({
      id: id++,
      price: price,
      quantity: quantity,
    }));

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Box sx={{ height: 225, width: 100 }}>
          <DataGrid
            rows={bidList}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: "price", sort: "desc" }],
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnSorting
            disableColumnMenu
            columnGroupingModel={[
              {
                groupId: "Bids",
                children: [{ field: "price" }, { field: "quantity" }],
                headerAlign: "center",
              },
            ]}
            rowHeight={25}
            columnHeaderHeight={25}
            hideFooter
          />
        </Box>
        <Box sx={{ height: 225, width: 100 }}>
          <DataGrid
            rows={askList}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: "price", sort: "asc" }],
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnSorting
            disableColumnMenu
            columnGroupingModel={[
              {
                groupId: "Asks",
                children: [{ field: "price" }, { field: "quantity" }],
                headerAlign: "center",
              },
            ]}
            rowHeight={25}
            columnHeaderHeight={25}
            hideFooter
          />
        </Box>
      </Stack>
    </Box>
  );
}

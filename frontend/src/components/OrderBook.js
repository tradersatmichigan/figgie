import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns = [
  {
    field: 'quantity',
    headerName: 'Q',
    width: 50,
  },
  {
    field: 'price',
    headerName: 'P',
    width: 50,
    valueFormatter: (value) =>
      value == null ? '' : `\$${value.toLocaleString()}`,
  },
];

function OrderBook({ asset, amountHeld, orderBook }) {

  let bids = [];
  let asks = [];

  let i = 0;
  let added = false;

  for (const order in orderBook) {
    for (const j in orderBook)
    {
      if (orderBook[order]["price"] == orderBook[j]["price"])
      {
        orderBook[j]["quanity"] += orderBook[order]["quantity"];
        added = true;
      }
    }
    if (!added)
    {
      if (orderBook[order]["side"] == "B") {
        bids.push({
          id: i++,
          price: orderBook[order]["price"],
          quantity: orderBook[order]["quantity"]
        })
      } else if (orderBook[order]["side"] == "A") {
        asks.push({
          id: i++,
          price: orderBook[order]["price"],
          quantity: orderBook[order]["quantity"]
        })
      }
    }
  };


  return (
    <Box>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center">
          {asset} (× {amountHeld})
        </Box>
        <Stack direction="row" spacing={2}>
          <Box sx={{ height: 225, width: 100 }}>
            <DataGrid
              rows={bids}
              columns={columns}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'price', sort: 'desc' }],
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              disableColumnSorting
              disableColumnMenu
              columnGroupingModel={[
                {
                  groupId: 'Bids',
                  children: [{ field: 'price' }, { field: 'quantity' }],
                  headerAlign: 'center',
                },
              ]}
              rowHeight={25}
              columnHeaderHeight={25}
              hideFooter
            />
          </Box>
          <Box sx={{ height: 225, width: 100 }}>
            <DataGrid
              rows={asks}
              columns={columns}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'price', sort: 'asc' }],
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              disableColumnSorting
              disableColumnMenu
              columnGroupingModel={[
                {
                  groupId: 'Asks',
                  children: [{ field: 'price' }, { field: 'quantity' }],
                  headerAlign: 'center',
                },
              ]}
              rowHeight={25}
              columnHeaderHeight={25}
              hideFooter
            />
          </Box>
        </Stack>
      </Stack>
      </Box>
  );
}

export default OrderBook;
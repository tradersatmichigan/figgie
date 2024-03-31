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
  const bidgrouping  = {};
  const askgrouping  = {};
  let i = 0;

  for (const order in orderBook) {
    if (orderBook[order]["side"] == "B") {
      if(bidgrouping.hasOwnProperty(orderBook[order]["price"])) {
        bidgrouping[orderBook[order]["price"]] += orderBook[order]["quantity"]
      }
      else{
        bidgrouping[orderBook[order]["price"]] = orderBook[order]["quantity"]
      }
    } else if (orderBook[order]["side"] == "A") {
      if(askgrouping.hasOwnProperty(orderBook[order]["price"])) {
        askgrouping[orderBook[order]["price"]] += orderBook[order]["quantity"]
      }
      else{
        askgrouping[orderBook[order]["price"]] = orderBook[order]["quantity"]
      }
    }
  };

  for (let price in bidgrouping){
    bids.push({
      id: i++,
      price: price,
      quantity: bidgrouping[price]
    })
  };
  for (let price in askgrouping){
    asks.push({
      id: i++,
      price: price,
      quantity: askgrouping[price]
    })
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
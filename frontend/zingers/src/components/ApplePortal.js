import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import WebSocket from 'ws';

// VARIABLES
const user_id = 123
var outstandingOrders = {
  1 : {
    "side" : "B", //"B" = bid, "A" = ask
    "trader" : 12321,
    "quantity" : 4,
    "price" : 6
  },
  2 : {
    "side" : "B", //"B" = bid, "A" = ask
    "trader" : 12301,
    "quantity" : 30,
    "price" : 6
  },
  3 : {
    "side" : "A", //"B" = bid, "A" = ask
    "trader" : 12372,
    "quantity" : 15,
    "price" : 6
  },
}
var previousMessageId = 0
let bids = []
let asks = []
// const exampleMessage = {
//   "message_id" : 1,
//   "trades" : [
//     {
//       "order_id" : 1,
//       "buyer_id" : 12321,
//       "seller_id" : 12372,
//       "quantity" : 6,
//       "price" : 6
//     },
//     {
//       "order_id" : 2,
//       "buyer_id" : 12301,
//       "seller_id" : 12372,
//       "quantity" : 9,
//       "price" : 6
//     },
//   ],
//   "new_order" : [
//     {
//       "order_id" : 3,
//       "side" : "b",
//       "buyer_id" : 12301,
//       "seller_id" : 12372,
//       "quantity" : 15,
//       "price" : 6
//     }
//   ]
// }

function fetchInitialState() {
  // TODO
  // Remember to update previousMessageId to the current message ID
}

const assetSocket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/market/apples/'
)

assetSocket.onmessage = function(e) {
  const data = JSON.parse(e.data)
  if (data.message_id - 1 != previousMessageId) fetchInitialState()
  else previousMessageId++
  let netValues = []
  netValues = updateOutstandingOrders(data)
  // updatePortfolioValues(netValues[0], netValues[1])
// Update state based on portfolio (regardless of any change)
}

function updateOutstandingOrders(data) {
  // Computer net loss/gain for each trade by user
  let netQ = 0
  let netCash = 0
  data.trades.forEach((trade) => {
    outstandingOrders[trade.order_id]["quantity"] -= trade.quantity
    
    if (trade.buyer_id == user_id) {
      netQ += -1 * trade.quantity
      netCash += trade.price * trade.quantity
    } else if (trade.seller_id == user_id) {
      netQ += trade.quantity
      netCash += -1 * trade.price * trade.quantity
    }

    if (outstandingOrders[trade.order_id]["quantity"] == 0) {
      delete outstandingOrders[trade.order_id]
    }
  });

  // Add new order to outstanding orders
  outstandingOrders[data.new_order.order_id] = {
    order_id : data.new_order.order_id,
    side : data.new_order.side,
    buyer_id : data.new_order.buyer_id,
    seller_id : data.new_order.seller_id,
    quantity : data.new_order.quantity,
    price : data.new_order.price
  }

  updateRowsCols()

  return [netQ, netCash]
}

function updateRowsCols() {
  bids = []
  asks = []
  outstandingOrders.forEach((order) => {
    if (order.side == 'B') 
      bids.push({id: order.message_id, price: order.price, quantity: order.quantity})
    else if (order.side == 'A')
      asks.push({id: order.message_id, price: order.price, quantity: order.quantity})
  });
}

function updatePortfolio(netQ, netCash) {
 // TODO
}

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

function ApplePortal({ asset, amountHeld, setApples, setCash }) {


  return (
    <Box height={260} width={350} p={1} sx={{ border: '2px solid grey' }}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center">
          {asset} (× {amountHeld})
        </Box>
        <Stack direction="row" spacing={2}>
          <Box sx={{ height: 225, width: 100 }}>
            <DataGrid
              rows={bids}
              columns={asks}
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
          <FormControl sx={{ height: 225, width: 100 }}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="bid"
            >
              <FormControlLabel value="bid" control={<Radio />} label="Bid" />
              <FormControlLabel value="ask" control={<Radio />} label="Ask" />
            </RadioGroup>
            <TextField
              id="outlined-number"
              label="Quantity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <Input
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Price"
              type="number"
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <Button variant="contained">Place</Button>
          </FormControl>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ApplePortal;
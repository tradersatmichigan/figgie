import Box from "@mui/material/Box";
import OrderTable from "./OrderTable";
import React from "react";
import Stack from "@mui/material/Stack";

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
    <Stack direction="row" spacing={2}>
      <Box>
        <OrderTable side={"Bids"} rows={bidList} />
      </Box>
      <Box>
        <OrderTable side={"Asks"} rows={askList} />
      </Box>
    </Stack>
  );
}

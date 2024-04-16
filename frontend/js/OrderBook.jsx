import Grid from "@mui/material/Grid";
import OrderTable from "./OrderTable";
import React from "react";

export default function OrderBook({ asset, bids, asks }) {
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
    <Grid container columns={2} spacing={2} id={`order-book-${asset}`}>
      <Grid item xs={1} height={250} id={`bid-table-${asset}`}>
        <OrderTable side={"Bids"} rows={bidList} />
      </Grid>
      <Grid item xs={1} height={250} id={`ask-table-${asset}`}>
        <OrderTable side={"Asks"} rows={askList} />
      </Grid>
    </Grid>
  );
}

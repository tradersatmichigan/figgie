import Grid from "@mui/material/Grid";
import PositionTable from "./PositionTable";
import React from "react";
import Stack from "@mui/material/Stack";

export default function Positions({ orders, traderId, sendCancelMessage }) {
  const bids = Object.entries(orders)
    .filter(([id, order]) => order.side === "B" && order.traderId === traderId)
    .map(([id, order]) => ({
      id: id,
      asset: order.asset,
      price: order.price,
      quantity: order.quantity,
    }));
  const asks = Object.entries(orders)
    .filter(([id, order]) => order.side === "A" && order.traderId === traderId)
    .map(([id, order]) => ({
      id: id,
      asset: order.asset,
      price: order.price,
      quantity: order.quantity,
    }));
  return (
    <Stack direction="column" spacing={2} alignItems={"center"}>
      <h3>Positions</h3>
      <Grid container columns={2} spacing={2} alignItems="stretch">
        <Grid xs={1} paddingRight={1} height={250}>
          <PositionTable
            rows={bids}
            side={"Bids"}
            sendCancelMessage={sendCancelMessage}
          />
        </Grid>
        <Grid xs={1} paddingLeft={1} height={250}>
          <PositionTable
            rows={asks}
            side={"Asks"}
            sendCancelMessage={sendCancelMessage}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

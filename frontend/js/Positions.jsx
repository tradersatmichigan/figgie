import Box from "@mui/material/Box";
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
    <Stack spacing={2} alignItems={"center"}>
      <h3>Positions</h3>
      <Stack direction="row" spacing={2}>
        <Box sx={{ height: 225, width: 220 }}>
          <PositionTable
            rows={bids}
            side={"Bids"}
            sendCancelMessage={sendCancelMessage}
          />
        </Box>
        <Box sx={{ height: 225, width: 220 }}>
          <PositionTable
            rows={asks}
            side={"Asks"}
            sendCancelMessage={sendCancelMessage}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

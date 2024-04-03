import React, { useEffect } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import OrderBook from "./OrderBook";
import OrderForm from "./OrderForm";
import { ReadyState } from "react-use-websocket";
import Stack from "@mui/material/Stack";

export default function AssetInterface({
  asset,
  orders,
  setOrders,
  webSocketConnection,
  updateIdState,
}) {
  const { sendMessage, lastMessage, readyState } = webSocketConnection;
  const [lastUpdateId, setLastUpdateId] = updateIdState;

  function updateOrders(order, trade) {
    if (order.quantity === trade.quantity) {
      setOrders((prevOrders) => {
        const newOrders = { ...prevOrders };
        delete newOrders[trade.order_id];
        return newOrders;
      });
    } else {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [trade.order_id]: {
          ...prevOrders[trade.order_id],
          quantity: prevOrders[trade.order_id].quantity - trade.quantity,
        },
      }));
    }
  }

  function settleTrades(trades) {
    for (const trade of trades) {
      const order = orders[trade.order_id];
      updateOrders(order, trade);
    }
  }

  useEffect(() => {
    if (lastMessage === null) {
      return;
    }
    const message = JSON.parse(lastMessage.data);
    console.log(message);
    if (lastUpdateId === null) {
      setLastUpdateId(message.update_id);
    } else if (lastUpdateId + 1 === message.update_id) {
      setLastUpdateId(message.update_id);
    } else if ("error" in message) {
      alert(message.error);
      return;
    } else {
      alert("Dropped a message. Should refresh.");
      return;
    }

    const order = message.order;
    if (order !== null) {
      setOrders({
        ...orders,
        [order.order_id]: order,
      });
    }

    const trades = message.trades;
    if (trades !== null) {
      settleTrades(trades);
    }
  }, [lastMessage]);

  /** Return all orders on `side`, aggregated by price */
  function filterOrders(side) {
    return Object.values(orders)
      .filter((order) => order.side === side)
      .reduce((acc, order) => {
        const { price, quantity } = order;
        acc[price] = (acc[price] || 0) + quantity;
        return acc;
      }, {});
  }

  const connectionStatusIcon = {
    [ReadyState.CONNECTING]: <CircularProgress />,
    [ReadyState.OPEN]: null,
    [ReadyState.CLOSING]: null,
    [ReadyState.CLOSED]: null,
    [ReadyState.UNINSTANTIATED]: null,
  }[readyState];

  return (
    <Stack direction="column" spacing={2} alignItems={"center"}>
      <h3>
        Asset {asset} {connectionStatusIcon}
      </h3>
      <Stack direction="row" spacing={2}>
        <OrderBook bids={filterOrders("B")} asks={filterOrders("A")} />
        <OrderForm sendMessage={sendMessage} />
      </Stack>
    </Stack>
  );
}

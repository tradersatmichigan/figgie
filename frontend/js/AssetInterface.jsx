import React, { useEffect, useState } from "react";
import OrderBook from "./OrderBook";
import useWebSocket from "react-use-websocket";

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

    if (lastUpdateId === null) {
      setLastUpdateId(message.update_id);
    } else if (lastUpdateId + 1 === message.update_id) {
      setLastUpdateId(message.update_id);
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

  return <OrderBook bids={filterOrders("B")} asks={filterOrders("A")} />;
}

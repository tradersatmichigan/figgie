import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import OrderBook from "./OrderBook";

export default function AssetInterface({ asset }) {
  const socketUrl = `ws://localhost:8000/ws/market/${asset}/`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [lastUpdateId, setLastUpdateId] = useState(null);
  const [orders, setOrders] = useState({});
  const [bids, setBids] = useState({});
  const [asks, setAsks] = useState({});

  function updateBids(order, trade) {
    if (bids[order.price] === trade.quantity) {
      setBids((prevBids) => {
        const newBids = { ...prevBids };
        delete newBids[order.price];
        return newBids;
      });
    } else {
      setBids((prevBids) => ({
        ...prevBids,
        [order.price]: prevBids[order.price] - trade.quantity,
      }));
    }
  }

  function updateAsks(order, trade) {
    if (asks[order.price] === trade.quantity) {
      setAsks((prevAsks) => {
        const newAsks = { ...prevAsks };
        delete newAsks[order.price];
        return newAsks;
      });
    } else {
      setAsks((prevAsks) => ({
        ...prevAsks,
        [order.price]: prevAsks[order.price] - trade.quantity,
      }));
    }
  }

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
      if (order.side === "B") {
        updateBids(order, trade);
      } else {
        updateAsks(order, trade);
      }
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

    if (order?.side === "B") {
      setBids((prevBids) => ({
        ...prevBids,
        [order.price]: (bids[order.price] || 0) + order.quantity,
      }));
    } else if (order?.side === "A") {
      setAsks((prevAsks) => ({
        ...prevAsks,
        [order.price]: (prevAsks[order.price] || 0) + order.quantity,
      }));
    }

    const trades = message.trades;
    if (trades !== null) {
      settleTrades(trades);
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <p>
        The WebSocket for asset {asset} is currently: {connectionStatus}.
      </p>
      <OrderBook bids={bids} asks={asks} />
      <p>Bids: {JSON.stringify(bids)}</p>
      <p>Asks: {JSON.stringify(asks)}</p>
      <p>Orders: {JSON.stringify(orders)}</p>
    </div>
  );
}

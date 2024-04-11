import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import OrderBook from "./OrderBook";
import OrderForm from "./OrderForm";
import ReadyState from "react-use-websocket";

export default function AssetInterface({
  asset,
  orders,
  setOrders,
  webSocketConnection,
  updateIdState,
  traderId,
  amountHeld,
  setAmountHeld,
  amountRemaining,
  setAmountRemaining,
  cash,
  setCash,
  buyingPower,
  setBuyingPower,
  forceUpdate,
}) {
  const { sendMessage, lastMessage, readyState } = webSocketConnection;
  const [lastUpdateId, setLastUpdateId] = updateIdState;

  function updateOrders(order, trade) {
    if (order.quantity === trade.quantity) {
      setOrders((prevOrders) => {
        const newOrders = { ...prevOrders };
        delete newOrders[trade.orderId];
        return newOrders;
      });
    } else {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [trade.orderId]: {
          ...prevOrders[trade.orderId],
          quantity: prevOrders[trade.orderId].quantity - trade.quantity,
        },
      }));
    }
  }

  function settleTrades(trades) {
    for (const trade of trades) {
      const order = orders[trade.orderId];
      if (trade.buyerId === traderId) {
        setAmountHeld((prev) => prev + trade.quantity);
        setCash((prev) => prev - trade.price * trade.quantity);
        if (order.traderId !== traderId) {
          // If current user fulfills existing order
          setAmountRemaining((prev) => prev + trade.quantity);
          setBuyingPower((prev) => prev - trade.price * trade.quantity);
        }
      } else if (trade.sellerId === traderId) {
        setAmountHeld((prev) => prev - trade.quantity);
        setCash((prev) => prev + trade.price * trade.quantity);
        if (order.traderId !== traderId) {
          setAmountRemaining((prev) => prev - trade.quantity);
          setBuyingPower((prev) => prev + trade.price * trade.quantity);
        }
      }
      updateOrders(order, trade);
    }
  }

  function cancelOrder(orderId) {
    const order = orders[orderId];
    if (order === null || order === undefined) {
      return;
    }
    if (order?.traderId === traderId) {
      if (order?.side === "B") {
        setBuyingPower((prev) => prev + order.price * order.quantity);
      } else {
        setAmountRemaining((prev) => prev + order.quantity);
      }
    }
    setOrders((prevOrders) => {
      const newOrders = { ...prevOrders };
      delete newOrders[orderId];
      return newOrders;
    });
  }

  useEffect(() => {
    if (lastMessage === null) {
      return;
    }
    const message = JSON.parse(lastMessage.data);
    if (lastUpdateId === null) {
      setLastUpdateId(message.updateId);
    } else if (lastUpdateId + 1 === message.updateId) {
      setLastUpdateId(message.updateId);
    } else if ("error" in message) {
      alert(message.error);
      return;
    } else {
      forceUpdate();
      setLastUpdateId(message.updateId);
    }

    if (message.cancel) {
      cancelOrder(message.orderId);
      return;
    }

    const order = message.order;
    if (order !== null && order !== undefined) {
      if (order.traderId === traderId) {
        if (order.side === "B") {
          setBuyingPower((prev) => prev - order.price * order.quantity);
        } else {
          setAmountRemaining((prev) => prev - order.quantity);
        }
      }
      setOrders({
        ...orders,
        [order.orderId]: order,
      });
    }

    const trades = message.trades;
    if (trades !== null && trades !== undefined) {
      settleTrades(trades);
    }
  }, [lastMessage]); //eslint-disable-line react-hooks/exhaustive-deps

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
    <Box>
      <h3>
        Asset {asset} {connectionStatusIcon}
      </h3>
      <Grid container columns={3} spacing={2}>
        <Grid item xs height={250}>
          <OrderBook bids={filterOrders("B")} asks={filterOrders("A")} />
        </Grid>
        <Grid item xs="auto" height={250}>
          <OrderForm sendMessage={sendMessage} />
        </Grid>
      </Grid>
    </Box>
  );
}

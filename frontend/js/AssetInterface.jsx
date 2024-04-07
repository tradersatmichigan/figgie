import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import OrderBook from "./OrderBook";
import OrderForm from "./OrderForm";
import ReadyState from "react-use-websocket";
import Stack from "@mui/material/Stack";

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
        setAmountHeld(amountHeld + trade.quantity);
        setCash(cash - trade.price * trade.quantity);
        if (order.traderId !== traderId) {
          // If current user fulfills existing order
          setAmountRemaining(amountRemaining + trade.quantity);
          setBuyingPower(buyingPower - trade.price * trade.quantity);
        }
      } else if (trade.sellerId === traderId) {
        setAmountHeld(amountHeld - trade.quantity);
        setCash(cash + trade.price * trade.quantity);
        if (order.traderId !== traderId) {
          setAmountRemaining(amountRemaining - trade.quantity);
          setBuyingPower(buyingPower + trade.price * trade.quantity);
        }
      }
      updateOrders(order, trade);
    }
  }

  function cancelOrder(orderId) {
    const order = orders[orderId];
    if (order === null) {
      return;
    }
    if (order.traderId === traderId) {
      if (order.side === "B") {
        setBuyingPower(buyingPower + order.price * order.quantity);
      } else {
        setAmountRemaining(amountRemaining + order.quantity);
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
      console.error("Dropped a message. Should refresh.");
      return;
    }

    if (message.cancel) {
      cancelOrder(message.orderId);
      return;
    }

    const order = message.order;
    if (order !== null) {
      if (order.traderId === traderId) {
        if (order.side === "B") {
          setBuyingPower(buyingPower - order.price * order.quantity);
        } else {
          setAmountRemaining(amountRemaining - order.quantity);
        }
      }
      setOrders({
        ...orders,
        [order.orderId]: order,
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

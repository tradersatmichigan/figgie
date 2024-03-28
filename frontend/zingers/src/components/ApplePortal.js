import * as React from 'react';
import WebSocket from 'ws';
import OrderBook from './OrderBook';
import { useState } from 'react';
import OrderForm from './OrderForm';

// VARIABLES
const user_id = 1

function ApplePortal({ asset, amountHeld, setApples, setCash }) {
  var previousMessageId = 0
  const exampleMessage = {
    "message_id" : 1,
    "trades" : [
      {
        "order_id" : 1,
        "buyer_id" : 1,
        "seller_id" : 2,
        "quantity" : 4,
        "price" : 6
      },
      {
        "order_id" : 2,
        "buyer_id" : 1,
        "seller_id" : 2,
        "quantity" : 8,
        "price" : 6
      },
    ],
    "new_order" : [
      {
        "order_id" : 3,
        "side" : "B",
        "buyer_id" : 12301,
        "seller_id" : 12372,
        "quantity" : 15,
        "price" : 6
      }
    ]
  }
  const [outstandingOrders, setOutstandingOrders] = useState({
    1 : {
      "side" : "A", //"B" = bid, "A" = ask
      "trader" : 2,
      "quantity" : 4,
      "price" : 6
    },
    2 : {
      "side" : "B", //"B" = bid, "A" = ask
      "trader" : 5,
      "quantity" : 30,
      "price" : 10
    },
    3 : {
      "side" : "A", //"B" = bid, "A" = ask
      "trader" : 3,
      "quantity" : 8,
      "price" : 6
    },
  });

  function fetchInitialState() {
    // TODO
    // Remember to update previousMessageId to the current message ID
  }

  // const assetSocket = new WebSocket(
  //   'ws://'
  //   + window.location.host
  //   + '/ws/market/apples/'
  // )

  // assetSocket.onmessage = function(e) {
  //   const data = JSON.parse(e.data)
  //   if ("error" in data) {
  //     // Show error for user
  //     return;
  //   }
  //   if (data.message_id - 1 != previousMessageId) fetchInitialState()
  //   else previousMessageId++
  //   let netValues = []
  //   netValues = updateOutstandingOrders(data)
  //   // updatePortfolioValues(netValues[0], netValues[1])
  // // Update state based on portfolio (regardless of any change)
  // }

  function updateOutstandingOrders(data) {
    // Computer net loss/gain for each trade by user
    if (data.message_id - 1 != previousMessageId) {
      console.log("MISSED MESSAGE, refetching from server...");
      return;
    } else if ("error" in data) {
      console.log("Error detected: TODO output visual to user");
      return;
    }

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
    if (Object.keys(outstandingOrders[data.new_order]).length != 0) {
      outstandingOrders[data.new_order.order_id] = {
        order_id : data.new_order.order_id,
        side : data.new_order.side,
        buyer_id : data.new_order.buyer_id,
        seller_id : data.new_order.seller_id,
        quantity : data.new_order.quantity,
        price : data.new_order.price
      }
    }

    setOutstandingOrders(outstandingOrders); // force re-render with updated list

    return [netQ, netCash]
  }

  function updatePortfolio(netQ, netCash) {
  // TODO
  }

  let placeholder = 0;

  const handleUpdateButton = (e) => {
    console.log(updateOutstandingOrders(exampleMessage) == [1, 2])
    e.target.disabled = true;
  }

  return (
    <div>
      <OrderBook asset={"Apples"} amountHeld={15} orderBook={outstandingOrders}/>
      <OrderForm ws={placeholder}/>
      <button onClick={handleUpdateButton}>TEST</button>
    </div>
  );
}

export default ApplePortal;
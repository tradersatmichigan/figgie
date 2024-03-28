import * as React from 'react';
import WebSocket from 'ws';
import OrderBook from './OrderBook';
import { useState } from 'react';
import OrderForm from './OrderForm';

// VARIABLES
const user_id = 1

function ApplePortal({ asset, amountHeld, setApples, cash, setCash }) {
  var previousMessageId = 0
  const exampleMessage = {
    message_id : 1,
    trades : [
      {
        order_id : 1,
        buyer_id : 1,
        seller_id : 2,
        quantity : 4,
        price : 6
      },
      {
        order_id : 3,
        buyer_id : 1,
        seller_id : 2,
        quantity : 8,
        price : 6
      },
    ],
    new_order : {
      order_id : 5,
      side : "B",
      trader : 1,
      quantity : 15,
      price : 6
    }
  }
  const [outstandingOrders, setOutstandingOrders] = useState({
    1 : {
      side : "A", //"B" = bid, "A" = ask
      trader : 2,
      quantity : 4,
      price : 6
    },
    2 : {
      side : "B", //"B" = bid, "A" = ask
      trader : 5,
      quantity : 30,
      price : 10
    },
    3 : {
      side : "A", //"B" = bid, "A" = ask
      trader : 3,
      quantity : 8,
      price : 6
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
    
  }

  function updatePortfolio(netQ, netCash) {
  // TODO
  }

  let placeholder = 0;

  const handleUpdateButton = (e) => { // Will be onMessage
    // Computer net loss/gain for each trade by user
    if (exampleMessage.message_id - 1 != previousMessageId) {
      console.log("MISSED MESSAGE, refetching from server...");
      return;
    }
    else if ("error" in Object.keys(exampleMessage)) {
      console.log("Error detected: TODO output visual to user");
      return;
    }

    let netQ = 0
    let netCash = 0
    exampleMessage.trades.forEach((trade) => {
      outstandingOrders[trade.order_id].quantity -= trade.quantity
      
      if (trade.buyer_id == user_id) {
        netQ += trade.quantity;
        netCash -= trade.price * trade.quantity
      } else if (trade.seller_id == user_id) {
        netQ -= trade.quantity
        netCash += trade.price * trade.quantity
      }

      if (outstandingOrders[trade.order_id].quantity == 0) {
        delete outstandingOrders[trade.order_id]
      }
    });

    // Add new order to outstanding orders
    if (Object.keys(exampleMessage.new_order).length != 0) {
      outstandingOrders[exampleMessage.new_order.order_id] = {
        side : exampleMessage.new_order.side,
        trader : exampleMessage.new_order.trader,
        quantity : exampleMessage.new_order.quantity,
        price : exampleMessage.new_order.price
      }
    }

    setApples(amountHeld + netQ);
    setCash(cash + netCash);

    e.target.disabled = true;
  }

  return (
    <div>
      <OrderBook asset={asset} amountHeld={amountHeld} orderBook={outstandingOrders}/>
      <OrderForm ws={placeholder}/>
      <button onClick={handleUpdateButton}>TEST</button>
    </div>
  );
}

export default ApplePortal;
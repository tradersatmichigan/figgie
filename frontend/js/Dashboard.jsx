import React, { useEffect, useState } from "react";
import AssetInterface from "./AssetInterface";
import Portfolio from "./Portfolio";
import useWebSocket from "react-use-websocket";

export default function Dashboard() {
  const [orders0, setOrders0] = useState({});
  const [bids0, setBids0] = useState({});
  const [asks0, setAsks0] = useState({});

  const [orders1, setOrders1] = useState({});
  const [bids1, setBids1] = useState({});
  const [asks1, setAsks1] = useState({});

  const [orders2, setOrders2] = useState({});
  const [bids2, setBids2] = useState({});
  const [asks2, setAsks2] = useState({});

  const [orders3, setOrders3] = useState({});
  const [bids3, setBids3] = useState({});
  const [asks3, setAsks3] = useState({});

  const [cash, setCash] = useState(0);

  const asset = 0;
  const socketUrl = `ws://localhost:8000/ws/market/${asset}/`;
  const webSocket0 = useWebSocket(socketUrl);
  const updates0 = useState(null);

  useEffect(() => {
    fetch("/api/state/", { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        setOrders0(data.orders[0]);
        setOrders1(data.orders[0]);
        setOrders2(data.orders[0]);
        setOrders3(data.orders[0]);
        setCash(data.portfolio.cash);
      })
      .catch((error) => console.error(error));
  }, []);

  // <Portfolio
  //   asset0={0}
  //   orders0={orders0}
  //   bids0={bids0}
  //   asks0={asks0}
  //   asset1={1}
  //   orders1={orders1}
  //   bids1={bids1}
  //   asks1={asks1}
  //   asset2={2}
  //   orders2={orders2}
  //   bids2={bids2}
  //   asks2={asks2}
  //   asset3={3}
  //   orders3={orders3}
  //   bids3={bids3}
  //   asks3={asks3}
  // />
  return (
    <>
      <AssetInterface
        asset={0}
        orders={orders0}
        setOrders={setOrders0}
        webSocketConnection={webSocket0}
        updateIdState={updates0}
      />
    </>
  );
}

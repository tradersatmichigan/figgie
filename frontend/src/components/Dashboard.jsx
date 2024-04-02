import AssetInterface from "./AssetInterface";
import Portfolio from "./Portfolio";
import React, { useState } from "react";

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

  return (
    <>
    <AssetInterface
      asset={0}
      orders={orders0}
      setOrders={setOrders0}
      bids={bids0}
      setBids={setBids0}
      asks={asks0}
      setAsks={setAsks0}
    />
    <Portfolio
      asset0={0}
      orders0={orders0}
      bids0={bids0}
      asks0={asks0}
      asset1={1}
      orders1={orders1}
      bids1={bids1}
      asks1={asks1}
      asset2={2}
      orders2={orders2}
      bids2={bids2}
      asks2={asks2}
      asset3={3}
      orders3={orders3}
      bids3={bids3}
      asks3={asks3}
    />

    </>
  );
  


}

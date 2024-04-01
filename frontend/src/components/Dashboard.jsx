import AssetInterface from "./AssetInterface";
import React, { useState } from "react";

export default function Dashboard() {
  const [orders0, setOrders0] = useState({});
  const [bids0, setBids0] = useState({});
  const [asks0, setAsks0] = useState({});

  return (
    <AssetInterface
      asset={0}
      orders={orders0}
      setOrders={setOrders0}
      bids={bids0}
      setBids={setBids0}
      asks={asks0}
      setAsks={setAsks0}
    />
  );
}

import React, { useEffect, useState } from "react";
import AssetInterface from "./AssetInterface";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Portfolio from "./Portfolio";
import Positions from "./Positions";
import Stack from "@mui/material/Stack";
import useWebSocket from "react-use-websocket";
import Leaderboard from "./Leaderboard";

export default function Dashboard() {
  const [traderId, setTraderId] = useState(null);
  const [username, setUsername] = useState("");

  const [cash, setCash] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);

  const [amountHeld0, setAmountHeld0] = useState(0);
  const [amountHeld1, setAmountHeld1] = useState(0);
  const [amountHeld2, setAmountHeld2] = useState(0);
  const [amountHeld3, setAmountHeld3] = useState(0);

  const [amountRemaining0, setAmountRemaining0] = useState(0);
  const [amountRemaining1, setAmountRemaining1] = useState(0);
  const [amountRemaining2, setAmountRemaining2] = useState(0);
  const [amountRemaining3, setAmountRemaining3] = useState(0);

  const [orders0, setOrders0] = useState({});
  const [orders1, setOrders1] = useState({});
  const [orders2, setOrders2] = useState({});
  const [orders3, setOrders3] = useState({});

  const [leaderboard, setLeaderboard] = useState([]);

  let asset = 0;
  let socketUrl = `ws://localhost:8000/ws/market/${asset}/`;
  const webSocket0 = useWebSocket(socketUrl);
  const updates0 = useState(null);

  asset = 1;
  socketUrl = `ws://localhost:8000/ws/market/${asset}/`;
  const webSocket1 = useWebSocket(socketUrl);
  const updates1 = useState(null);

  asset = 2;
  socketUrl = `ws://localhost:8000/ws/market/${asset}/`;
  const webSocket2 = useWebSocket(socketUrl);
  const updates2 = useState(null);

  asset = 3;
  socketUrl = `ws://localhost:8000/ws/market/${asset}/`;
  const webSocket3 = useWebSocket(socketUrl);
  const updates3 = useState(null);

  useEffect(() => {
    fetch("/api/state/", { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        setTraderId(data.traderId);
        setUsername(data.username);

        setCash(data.portfolio.cash);
        setBuyingPower(data.portfolio.buyingPower);

        setAmountHeld0(data.portfolio.assets[0]);
        setAmountHeld1(data.portfolio.assets[1]);
        setAmountHeld2(data.portfolio.assets[2]);
        setAmountHeld3(data.portfolio.assets[3]);

        setAmountRemaining0(data.portfolio.assetsRemaining[0]);
        setAmountRemaining1(data.portfolio.assetsRemaining[1]);
        setAmountRemaining2(data.portfolio.assetsRemaining[2]);
        setAmountRemaining3(data.portfolio.assetsRemaining[3]);

        setOrders0(data.orders[0]);
        setOrders1(data.orders[1]);
        setOrders2(data.orders[2]);
        setOrders3(data.orders[3]);
      })
      .catch((error) => console.error(error));
    fetchLeaderboard();
  }, []);

  function fetchLeaderboard() {
    fetch("/api/leaderboard/", { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        let id = 1;
        setLeaderboard(
          data.map((entry) => ({
            id: id++,
            username: entry.username,
            value: entry.value,
          })),
        );
        console.log(data);
      })
      .catch((error) => console.error(error));
  }

  function sendCancelMessage(orderId, asset) {
    if (asset < 0 || asset > 3) {
      return;
    }
    const sender = [webSocket0, webSocket1, webSocket2, webSocket3][asset];
    sender.sendMessage(
      JSON.stringify({
        cancel: true,
        orderId: orderId,
      }),
    );
  }

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Stack spacing={1} width={"auto"}>
          <Grid container columnSpacing={5} maxWidth={800}>
            <Grid>
              <AssetInterface
                asset={0}
                orders={orders0}
                setOrders={setOrders0}
                webSocketConnection={webSocket0}
                updateIdState={updates0}
              />
            </Grid>
            <Grid>
              <AssetInterface
                asset={1}
                orders={orders1}
                setOrders={setOrders1}
                webSocketConnection={webSocket1}
                updateIdState={updates1}
              />
            </Grid>
            <Grid>
              <AssetInterface
                asset={2}
                orders={orders2}
                setOrders={setOrders2}
                webSocketConnection={webSocket2}
                updateIdState={updates2}
              />
            </Grid>
            <Grid>
              <AssetInterface
                asset={3}
                orders={orders3}
                setOrders={setOrders3}
                webSocketConnection={webSocket3}
                updateIdState={updates3}
              />
            </Grid>
          </Grid>
          <Portfolio
            cash={cash}
            buyingPower={buyingPower}
            assets={[amountHeld0, amountHeld1, amountHeld2, amountHeld3]}
            assetsRemaining={[
              amountRemaining0,
              amountRemaining1,
              amountRemaining2,
              amountRemaining3,
            ]}
          />
        </Stack>
        <Stack spacing={2}>
          <Positions
            orders={{
              ...orders0,
              ...orders1,
              ...orders2,
              ...orders3,
            }}
            traderId={traderId}
            sendCancelMessage={sendCancelMessage}
          />
          <Leaderboard rows={leaderboard} username={username} />
        </Stack>
      </Stack>
    </Box>
  );
}

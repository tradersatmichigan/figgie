import React, { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    headerName: "Rank",
    width: 56,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "username",
    headerName: "Username",
    flex: 1,
  },
  {
    field: "value",
    headerName: "Portfolio Value",
    flex: 1,
    type: "number",
    align: "right",
    valueFormatter: (value) =>
      value == null ? "" : `$${value.toLocaleString()}`,
  },
];

export default function Leaderboard({ username }) {
  const [leaderboard, setLeaderboard] = useState([]);

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
      })
      .catch((error) => console.error(error));
  }

  useState(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box height={435}>
      <h3>Leaderboard</h3>
      <DataGrid
        sx={{
          "& .leaderboard-user-row": {
            backgroundColor: "info.dark",
          },
        }}
        rows={leaderboard}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: "value", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        disableColumnSorting
        disableColumnMenu
        rowHeight={25}
        columnHeaderHeight={25}
        hideFooter
        disableColumnFilter
        getRowClassName={(params) =>
          params.row.username === username ? "leaderboard-user-row" : null
        }
        disableColumnResize
      />
    </Box>
  );
}

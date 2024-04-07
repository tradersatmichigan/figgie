import Paper from "@mui/material/Paper";
import React from "react";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Portfolio({
  cash,
  buyingPower,
  assets,
  assetsRemaining,
}) {
  const etfCount = Math.min(...assets);
  function value() {
    return (
      10 * assets[0] +
      20 * assets[1] +
      30 * assets[2] +
      40 * assets[3] +
      100 * etfCount +
      cash
    );
  }
  return (
    <Stack direction="column" spacing={2} alignItems={"center"}>
      <h3>Portfolio: ${value().toLocaleString()}</h3>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Asset 0
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Asset 1
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Asset 2
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Asset 3
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                ETF Bonus
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Cash
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={"cash"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Amount Held
              </TableCell>
              {assets.map((amount, idx) => (
                <TableCell align="right" key={`assets${idx}`}>
                  {amount.toLocaleString()}
                </TableCell>
              ))}
              <TableCell align="right">{etfCount.toLocaleString()}</TableCell>
              <TableCell align="right">${cash.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow
              key={"values"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Value
              </TableCell>
              {assetsRemaining.map((amount, idx) => (
                <TableCell align="right" key={`assetsRemaining${idx}`}>
                  ${(10 * (idx + 1) * amount).toLocaleString()}
                </TableCell>
              ))}
              <TableCell align="right">
                ${(100 * etfCount).toLocaleString()}
              </TableCell>
              <TableCell align="right">${cash.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow
              key={"buyingPower"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Buying/Selling Power
              </TableCell>
              {assetsRemaining.map((amount, idx) => (
                <TableCell align="right" key={`assetsRemaining${idx}`}>
                  {amount.toLocaleString()}
                </TableCell>
              ))}
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                ${buyingPower.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

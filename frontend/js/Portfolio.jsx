import Box from "@mui/material/Box";
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
  return (
    <Box maxWidth={750} maxHeight={100}>
      <Stack direction="row" spacing={1}>
        <Stack spacing={1} width={300} height={100} alignItems={"center"}>
          <h3>Portfolio</h3>
          <TableContainer component={Paper}>
            <Table width={300} size="small" aria-label="simple table">
              <TableBody>
                <TableRow
                  key={"cash"}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Cash
                  </TableCell>
                  <TableCell align="right">${cash}</TableCell>
                </TableRow>
                <TableRow
                  key={"buyingPower"}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Buying Power
                  </TableCell>
                  <TableCell align="right">${buyingPower}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">Asset 0</TableCell>
                <TableCell align="right">Asset 1</TableCell>
                <TableCell align="right">Asset 2</TableCell>
                <TableCell align="right">Asset 3</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                key={"cash"}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Amount Held
                </TableCell>
                {assets.map((amount, idx) => (
                  <TableCell align="right" key={`assets${idx}`}>
                    {amount}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow
                key={"buyingPower"}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Amount Remaining
                </TableCell>
                {assetsRemaining.map((amount, idx) => (
                  <TableCell align="right" key={`assetsRemaining${idx}`}>
                    {amount}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}

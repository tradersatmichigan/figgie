import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";

export default function Portfolio({
  asset0,
  orders0,
  bids0,
  asks0,
  asset1,
  orders1,
  bids1,
  asks1,
  asset2,
  orders2,
  bids2,
  asks2,
  asset3,
  orders3,
  bids3,
  asks3,
  cash,
}) {
  const traderid = 0;
  const assets = [
    { name: "Pas", quantity: 211, value: 8440 },
    { name: "Rye", quantity: 6, value: 180 },
    { name: "Sau", quantity: 114, value: 2280 },
    // ...add more assets as needed
  ];

  // Define filler data for exposed positions
  const exposedPositions = {
    bids: [
      { type: "R", amount: 14, price: 30 },
      { type: "S", amount: 29, price: 9 },
      // ...add more bids as needed
    ],
    asks: [
      { type: "R", amount: 55, price: 32 },
      { type: "Sk", amount: 37, price: 23 },
      { type: "Sk", amount: 37, price: 23 },
      // ...add more asks as needed
    ],
  };

  //TODO: aggregate values

  //aggregating bids for all assets
  for (let i = 0; i < bids0.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (bids0[i].traderid == traderid) {
      newbid.amount = bids0[i].quantity;
      newbid.price = bids0[i].price;
      newbid.type = asset0;
      exposedPositions.bids.push(newbid);
    }
  }
  for (let i = 0; i < bids1.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (bids1[i].traderid == traderid) {
      newbid.amount = bids1[i].quantity;
      newbid.price = bids1[i].price;
      newbid.type = asset1;
      exposedPositions.bids.push(newbid);
    }
  }
  for (let i = 0; i < bids2.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (bids2[i].traderid == traderid) {
      newbid.amount = bids2[i].quantity;
      newbid.price = bids2[i].price;
      newbid.type = asset2;
      exposedPositions.bids.push(newbid);
    }
  }
  for (let i = 0; i < bids3.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (bids2[i].traderid == traderid) {
      newbid.amount = bids3[i].quantity;
      newbid.price = bids3[i].price;
      newbid.type = asset3;
      exposedPositions.bids.push(newbid);
    }
  }
  //aggregating asks for all assets

  for (let i = 0; i < asks0.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (asks0[i].traderid == traderid) {
      newbid.amount = asks0[i].quantity;
      newbid.price = asks0[i].price;
      newbid.type = asset0;
      exposedPositions.asks.push(newbid);
    }
  }
  for (let i = 0; i < asks1.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (asks1[i].traderid == traderid) {
      newbid.amount = asks1[i].quantity;
      newbid.price = asks1[i].price;
      newbid.type = asset1;
      exposedPositions.asks.push(newbid);
    }
  }
  for (let i = 0; i < asks2.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (asks2[i].traderid == traderid) {
      newbid.amount = asks2[i].quantity;
      newbid.price = asks2[i].price;
      newbid.type = asset2;
      exposedPositions.asks.push(newbid);
    }
  }
  for (let i = 0; i < asks3.length; i++) {
    let newbid = { type: "null", amount: 0, price: 0 };
    if (asks3[i].traderid == traderid) {
      newbid.amount = asks3[i].quantity;
      newbid.price = asks3[i].price;
      newbid.type = asset3;
      exposedPositions.asks.push(newbid);
    }
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="portfolio table">
          <TableHead>
            <TableRow>
              <TableCell>Portfolio: (${cash})</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {asset.name}
                </TableCell>
                <TableCell align="right">{asset.quantity}</TableCell>
                <TableCell align="right">${asset.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="exposed positions table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Bids</TableCell>
              <TableCell align="center">Asks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exposedPositions.bids.map((bid, index) => (
              <TableRow key={`bid-${index}`}>
                <TableCell>
                  <CloseIcon sx={{ color: red[500] }} />
                  {bid.type} {bid.amount} @ ${bid.price}
                </TableCell>
                {exposedPositions.asks[index] ? (
                  <TableCell>
                    <CloseIcon sx={{ color: red[500] }} />
                    {exposedPositions.asks[index].type}{" "}
                    {exposedPositions.asks[index].amount} @ $
                    {exposedPositions.asks[index].price}
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
              </TableRow>
            ))}
            {exposedPositions.asks.length > exposedPositions.bids.length &&
              exposedPositions.asks
                .slice(exposedPositions.bids.length)
                .map((ask, index) => (
                  <TableRow key={`ask-${index + exposedPositions.bids.length}`}>
                    <TableCell></TableCell>
                    <TableCell>
                      <CloseIcon sx={{ color: red[500] }} />
                      {ask.type} {ask.amount} @ ${ask.price}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

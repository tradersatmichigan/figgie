import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function OrderForm({ sendMessage }) {
  const [side, setSide] = useState("B");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const isValid = (value) => {
    return (
      !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10)) &&
      parseInt(value, 10) > 0
    );
  };

  const submitOrder = () => {
    if ((side === "B" || side === "A") && isValid(price) && isValid(quantity)) {
      sendMessage(
        JSON.stringify({
          side: side,
          price: price,
          quantity: quantity,
        }),
      );
    } else {
      alert("Invalid order! Not placed.");
    }
  };

  return (
    <Stack spacing={1.8} width={100} height={250}>
      <FormControl>
        <ToggleButtonGroup
          value={side}
          exclusive
          onChange={(event, newSide) => setSide(newSide)}
          aria-label="text alignment"
        >
          <ToggleButton value="B" aria-label="bid">
            Bid
          </ToggleButton>
          <ToggleButton value="A" aria-label="ask">
            Ask
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="standard-adornment-price">Price</InputLabel>
        <Input
          id="standard-adornment-price"
          startAdornment={
            <InputAdornment position="start" type="">
              $
            </InputAdornment>
          }
          type="number"
          value={price}
          onChange={(event) => {
            setPrice(event.target.value);
          }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="standard-adornment-quantity">Quantity</InputLabel>
        <Input
          id="standard-adornment-quantity"
          type="number"
          value={quantity}
          onChange={(event) => {
            setQuantity(event.target.value);
          }}
        />
      </FormControl>
      <Button variant="outlined" onClick={submitOrder}>
        Order
      </Button>
    </Stack>
  );
}

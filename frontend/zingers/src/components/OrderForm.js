import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import "./formStyling.css";
import { useState } from "react";

function OrderForm({ ws }) {
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [side, setSide] = useState("B");

    const handleSubmit = (e) => { // Will be subbed for the ws.sendMessage()
        console.log(price, quantity, side[0])
    }


    return (
        <form className="orderForm" onSubmit={handleSubmit}>
            <select value={side} onChange={(e) => setSide(e.target.value)} style={{display: "table-row"}} id="B/A" name="BA" size="2" required>
                <option style={{display: "table-cell"}} value="B">Bid</option>
                <option style={{display: "table-cell"}} value="A">Ask</option>
            </select>
            <label htmlFor="price">Price:</label>
            <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" id="quantity" name="quantity" required/>
            <label htmlFor="quantity">Quantity:</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" id="price" name="price" required/>
            <button type="submit" style={{width: 100, height: 25}} >PLACE</button>
        </form>
    );
}

export default OrderForm;
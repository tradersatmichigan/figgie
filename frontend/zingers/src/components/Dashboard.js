import React from "react";
import ApplePortal from "./ApplePortal"
import Portfolio from "./Portfolio";
import { useState } from "react";

function DashBoard() {
    const [cash, setCash] = useState(100);
    const [apples, setApples] = useState(25);

    return (
        <div>
            <ApplePortal asset={"Apples"} amountHeld={apples} setApples={setApples} setCash={setCash}/>
            <Portfolio cash={cash} apples={apples}/>
        </div>
    );

}

export default DashBoard;
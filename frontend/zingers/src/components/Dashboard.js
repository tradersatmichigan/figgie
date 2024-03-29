import React from "react";
import ApplePortal from "./ApplePortal"
import Portfolio from "./Portfolio";
import { useState } from "react";

function DashBoard() {
    const [cash, setCash] = useState(100);
    const [apples, setApples] = useState(25);
    //const [bananas, setBananas] = useState(25);
    //const [cherries, setCherries] = useState(25);
    //const [dragonfruit, setDragonfruit] = useState(25);
    
    
    return (
        <div>
            <ApplePortal asset={"Apples"} amountHeld={apples} setApples={setApples} setCash={setCash}/>
            
            <Portfolio cash={cash} apples={apples} bananas={5} cherries = {6} dragonfruit = {7}/>
        </div>
    );

}

/*
<BananasPortal asset={"Bananas"} amountHeld={bananas} setBanans={setBananas} setCash={setCash}/>
            <CherriesPortal asset={"Cherries"} amountHeld={cherries} setCherries={setCherries} setCash={setCash}/>
            <DragonfruitPortal asset={"Dragonfruit"} amountHeld={dragonfruit} setDragonfruit={setDragonfruit} setCash={setCash}/>
*/

export default DashBoard;
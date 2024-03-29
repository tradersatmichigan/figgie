import React from "react";
//var

var aV = 1;
var bV = 2;
var cV = 2;
var dV = 2;
var etf = 0;

function setETF({apples, bananas, cherries, dragonfruit}) {

    etf = Math.min(Math.min(apples,bananas),Math.min(cherries,dragonfruit));
}

function calcScore({cash, apples, bananas, cherries, dragonfruit, etf}) {

    return (apples * aV) + (bananas * bV) + (cherries * cV) + 
    (dragonfruit * dV) + (etf*100) + cash;
}


function Portfolio({cash, apples, bananas, cherries, dragonfruit}) {
    return (
        <div>
            Apples: {apples};
            Bananas: {bananas};
            Cherries: {cherries};
            Dragonfruit: {dragonfruit};
            Cash: {cash};
            ETF: {setETF({apples, bananas, cherries, dragonfruit})};
            Score: {calcScore({cash, apples, bananas, cherries, dragonfruit, etf})};
        </div>
    );
}

export default Portfolio
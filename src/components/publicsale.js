import React, { useState, useEffect } from "react";
import {
  buyTokens,
  getMaxTokens,
  getRemainingEthGoal,
  getLatestSale,
} from "./FunctionPublicsale";  // Replace with your actual backend file name

const TokenInterface = () => {
  const [numberOfTokens, setNumberOfTokens] = useState("");
  const [maxTokens, setMaxTokens] = useState(null);
  const [remainingEth, setRemainingEth] = useState(null);
  const [latestSale, setLatestSale] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const max = await getMaxTokens();
        const remaining = await getRemainingEthGoal();
        setMaxTokens(max);
        setRemainingEth(remaining);
      } catch (err) {
        console.error("An error occurred:", err);
      }
    };
  
    fetchData();

    const latestSaleEvent = async () => {
      try {
        const sale = await getLatestSale();
        setLatestSale(sale);
      } catch (err) {
        console.error("Failed to get the latest sale:", err);
      }
    };
  
    latestSaleEvent();
  }, []);

  const handleBuyTokens = async () => {
    try {
      await buyTokens(numberOfTokens);
      alert(`Successfully purchased ${numberOfTokens} tokens.`);
    } catch (err) {
      console.error("An error occurred while buying tokens:", err);
    }
  };

  return (
    <div className="container">
      <h1>Token Interface</h1>
      
      <div className="info-section">
        <p>Max Tokens Available: {maxTokens}</p>
        <p>Remaining ETH needed to reach 150 ETH goal: {remainingEth}</p>
        <p>Latest Sale: {latestSale ? `Buyer: ${latestSale.buyer}, Amount: ${latestSale.amount}` : "No sales yet."}</p>
      </div>
      
      <div className="action-section">
        <input
          type="number"
          placeholder="Number of tokens to buy"
          value={numberOfTokens}
          onChange={(e) => setNumberOfTokens(e.target.value)}
        />
        <button onClick={handleBuyTokens}>Buy Tokens</button>
      </div>
    </div>
  );
};

export default TokenInterface;

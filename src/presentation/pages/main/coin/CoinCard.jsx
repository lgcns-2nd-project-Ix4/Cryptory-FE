import React from "react";
import "../../../styles/main-style.css"
import {useNavigate} from "react-router-dom";

export default function CoinCard({coinId, icon, name, symbol, price, change, changePrice}) {
    const navigate = useNavigate();

    return (
        <div className="coin-card" onClick={() => {navigate(`/coin/${coinId}`, {state: {name:name, symbol:symbol, icon:icon, price:price, change:change, changePrice:changePrice}})}}>
            <img src={icon} alt={name} className="coin-card-icon" />
            <div className="coin-card-info">
                <p className="coin-card-name">{name}</p>
                <p className="coin-card-symbol">{symbol}</p>
            </div>
            <div className="coin-price">
                <p className={`price ${change >= 0 ? "positive" : "negative"}`}>
                    {price.toLocaleString()}원
                </p>
                <p className={`change ${change >= 0 ? "positive" : "negative"}`}>
                    {change.toFixed(2)}%
                </p>
            </div>
        </div>
    );
}
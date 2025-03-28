import React, {useEffect, useState} from "react";
import CoinCard from "./CoinCard.jsx";
import axios from "axios";

export default function CoinView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const [coinData, setCoinData] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins`, {headers: {"Content-Type": "application/json"}})
            .then(res => {
                console.log(res)
                let temp = []
                res.data.results.map((coin) => {
                    temp.push({coinId: coin.coinId, icon: coin.coinSymbol.logoUrl, name: coin.koreanName, symbol: coin.code, price: coin.tradePrice, change: coin.signedChangeRate, changePrice: coin.signedChangePrice});
                })
                setCoinData(temp);
            })
            .catch(err => {
                setCoinData([
                    { coinId:1, icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", name: "비트코인", symbol: "BTC", price: 144204615, change: 9.77, changePrice:10000},
                    { coinId:1, icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", name: "이더리움", symbol: "ETH", price: 6057077, change: -21.0, changePrice:0},
                    { coinId:1, icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", name: "테더", symbol: "USDT", price: 1508, change: 0.1, changePrice:0},
                    { coinId:1, icon: "https://cryptologos.cc/logos/ripple-xrp-logo.png", name: "리플", symbol: "XRP", price: 3413, change: -7.76, changePrice:0},
                    { coinId:1, icon: "https://cryptologos.cc/logos/dogecoin-doge-logo.png", name: "도지코인", symbol: "DOGE", price: 378, change: 2.1, changePrice:0},
                    { coinId:1, icon: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png", name: "바이낸스", symbol: "BNB", price: 35781, change: 1.5, changePrice:0},
                    { coinId:1, icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", name: "USDC", symbol: "USDC", price: 3778, change: 0.2, changePrice:0},
                ])
            });
        ;
    }, []);

    return (<div className="coin-list">
        {coinData.map((coin, index) => (
            <CoinCard key={index} {...coin} />
        ))}
    </div>)
}
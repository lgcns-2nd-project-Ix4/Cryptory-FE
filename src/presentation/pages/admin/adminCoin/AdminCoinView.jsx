import React, { useState, useEffect } from "react";
import axios from "axios";

import "../../../styles/admin-style.css"
import "../../../styles/admin-coin-style.css"
import AdminCoinCard from "./AdminCoinCard"

export default function AdminCoinView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const [coins, setCoins] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [filteredCoins, setFilteredCoins] = useState([]); // 프론트 쪽에서 필터링

    useEffect(() => {
        const fetchCoins = async () => {
        try {
            const response = await axios.get(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/coins`, {
                headers: {
                    Authorization: `${sessionStorage.getItem("token")}`,
                }
            });
            console.log(response.data);
            setCoins(response.data.content);
            setFilteredCoins(response.data.content);
        } catch (error) {
            console.error("코인 목록 조회 실패", error);
            setCoins([
                {
                    "cryptoId": 1,
                    "name": "비트코인",
                    "symbol": "BTC",
                    "logoUrl": "...",
                    "isDisplayed": true
                  },
                  {
                    "cryptoId": 2,
                    "name": "이더리움",
                    "symbol": "ETH",
                     "logoUrl": "...",
                    "isDisplayed": true
                  },
                  {
                    "cryptoId": 3,
                    "name": "트론",
                    "symbol": "TRX",
                     "logoUrl": "https://cryptologos.cc/logos/tron-trx-logo.png",
                    "isDisplayed": false
                  },
                  {
                    "cryptoId": 4,
                    "name": "솔라나",
                    "symbol": "SOL",
                     "logoUrl": "https://cryptologos.cc/logos/solana-sol-logo.png",
                    "isDisplayed": true
                  }
            ]);
            setFilteredCoins([
                {
                    "cryptoId": 1,
                    "name": "비트코인",
                    "symbol": "BTC",
                    "logoUrl": "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
                    "isDisplayed": true
                  },
                  {
                    "cryptoId": 2,
                    "name": "이더리움",
                    "symbol": "ETH",
                     "logoUrl": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                    "isDisplayed": true
                  },
                  {
                    "cryptoId": 3,
                    "name": "트론",
                    "symbol": "TRX",
                     "logoUrl": "https://cryptologos.cc/logos/tron-trx-logo.png",
                    "isDisplayed": false
                  },
                  {
                    "cryptoId": 4,
                    "name": "솔라나",
                    "symbol": "SOL",
                     "logoUrl": "https://cryptologos.cc/logos/solana-sol-logo.png",
                    "isDisplayed": true
                  }
            ]);
        }
        };
        fetchCoins();
    }, [sessionStorage.getItem("token")]);

    const handleSearch = (event) => {
        setKeyword(event.target.value);
        const filtered = coins.filter((coin) =>
            coin.koreanName.includes(event.target.value)
        );
        setFilteredCoins(filtered);
    };

    return (<div className="admin-section">
        <h2 className="admin-title">코인 종목 관리</h2>

        <div className="admin-coin-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="검색"
                    value={keyword}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
        

            <div className="admin-coin-list">
                {filteredCoins.map((coin) => (
                    <AdminCoinCard key={coin.cryptoId} {...coin} />
                ))}
            </div>
        </div>

    
    </div>)
}
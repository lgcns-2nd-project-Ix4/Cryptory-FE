import { use, useState, useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom";

export default function AdminCoinCard({cryptoId, koreanName, symbol, logoUrl, displayed}) {

    //const { coinId } = useParams();
    const {tempSymbol, setTempSymbol} = useState("");
    const navigate = useNavigate();

    return (
        <div className={`admin-coin-item ${displayed ? "displayed" : ""}`}
            onClick={() => {navigate(`/admin/coin/${cryptoId}`, {state: {name:koreanName, symbol:symbol.substring(4), logoUrl:logoUrl, isDisplayedFront:displayed}})}}
        >
            
            <img src={logoUrl} alt={koreanName} className="admin-coin-logo" />
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span className="admin-coin-name">{koreanName}</span>
                <small className="admin-coin-symbol">{symbol.substring(4)}</small>
            </div>
        </div>
    )
}
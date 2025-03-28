import React, {useEffect, useState} from "react";
import "../../styles/chart-style.css"
import NewsView from "../main/news/NewsView.jsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import PostListView from "./post/PostListView.jsx";
import ModalView from "./prompt/ModalView.jsx";
import CandleChartCell from "./CandleChartCell.jsx";

export default function ChartView() {

    const location = useLocation()

    const { coinId } = useParams()
    const { icon, name, symbol, price, change, changePrice, prior } = location.state || {}

    const [type, setType] = useState("news");
    const [issueId, setIssueId] = useState(0);
    const [issueDate, setIssueDate] = useState("2025년 1월 6일");
    const [modalOpen, setModalOpen] = useState(false);
    const [issueChange, setIssueChange] = useState(0);
    const [issuePrice, setIssuePrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (prior !== undefined) {
            setType("board");
        }
    }, [])

    return (<div className="content">
        <div className="chart-nav">
            <button className="chart-btn-on" onClick={() => {
                navigate("/")
            }}>Coin
            </button>
            <button className="chart-btn" onClick={() => {
                navigate("/", {state:{path:"news"}})
            }}>News
            </button>
        </div>
        <header>
            <div style={{display: 'flex'}}>
                <img src={icon} alt="User" className="chart-coin-icon"/>
                <div className="chart-coin-card-info">
                    <p className="chart-coin-card-name">{name}</p>
                    <p className="chart-coin-card-symbol">{symbol}</p>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", width: "650px"}}>
                <div style={{width: '110px', justifyContent: "flex-end"}}>
                    <p style={{marginTop: -5, fontSize: '16px', color:"#252525"}}>
                        {price.toLocaleString()}원
                    </p>
                    <div style={{display: "flex", gap: '5px'}}>
                        <p style={{marginTop: -15, fontSize: 10}}
                           className={`change ${change >= 0 ? "positive" : "negative"}`}>
                            {change > 0 && <>+</>}
                            {changePrice.toLocaleString()}원
                        </p>
                        <p style={{marginTop: -15, fontSize: 10}}
                           className={`change ${change >= 0 ? "positive" : "negative"}`}>
                            ({change > 0 && <>+</>}
                            {change.toFixed(2)}%)
                        </p>
                    </div>
                </div>
            </div>
        </header>

        <CandleChartCell coinId={coinId} modalOpenFunc={(e) => {
            console.log(e)
            setIssueId(e.issueId);
            setIssueDate(e.date);
            setIssuePrice(e.closePrice)
            setIssueChange((e.openPrice - e.closePrice) / e.openPrice * 100);
            setModalOpen(true);
        }}/>

        {(type === "news") && <>
            <div className="chart-nav">
            <button className="chart-btn-on">News</button>
                <button className="chart-btn" onClick={() => {
                    setType("board")
                }}>게시판
                </button>
            </div>
            <NewsView type={coinId}/>
        </>}

        {(type === "board") && <>
            <div className="chart-nav">
                <button className="chart-btn" onClick={() => {
                    setType("news")
                }}>News
                </button>
                <button className="chart-btn-on">게시판</button>
            </div>
            <PostListView coinId={coinId} name={name} symbol={symbol} icon={icon} price={price} change={change} changePrice={changePrice}/>
        </>}

        {modalOpen && <ModalView onClose={() => {setModalOpen(false)}} coinId={coinId} issueId={issueId} icon={icon} name={name} symbol={symbol} price={issuePrice} change={issueChange} issueDate={issueDate}/>}
    </div>)
}
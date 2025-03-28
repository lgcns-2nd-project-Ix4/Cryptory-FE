import React from "react";
import "../../../styles/chart-style.css"
import {useNavigate} from "react-router-dom";

export default function PostCard({ postId, title, author, date, coinId, icon, name, symbol, price, change }) {

    const navigate = useNavigate();

    return (
        <div className="post-card" onClick={() => {navigate(`/post/${postId}`, {state: {coinId:coinId, name:name, symbol:symbol, icon:icon, price:price, change:change, author:author, date:date}})}}>
            <p className="post-card-title">{title}</p>
            <div className="post-footer">
                <span className="post-author">{author}</span>
                <span className="post-date">{date}</span>
            </div>
        </div>
    );
}
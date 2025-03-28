import React from "react";
import "../../../styles/admin-style.css"

export default function OverviewCard({ title, value, change, color }) {
    return (
        <div className={`overview-card ${color}`}>
            <h3>{title}</h3>
            <p className="value">{value}</p>
            <p className={`change ${change.includes("-") ? "negative" : "positive"}`}>{change}</p>
        </div>
    );
}

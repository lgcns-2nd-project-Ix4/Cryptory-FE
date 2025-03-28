import React from "react";
import "../../../styles/prompt-style.css"

export default function ResponseCell({ content }) {
    return (<div className="prompt-container">
            <p className="prompt-content">{content}</p>
        </div>);
}
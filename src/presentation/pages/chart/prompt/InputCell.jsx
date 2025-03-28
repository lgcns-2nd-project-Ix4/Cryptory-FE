import React from "react";
import "../../../styles/prompt-style.css"

export default function InputCell({ content }) {
    return (<div className="prompt-input-container">
        <div className="prompt-input">
            <p className="prompt-content-input">{content}</p>
        </div>
    </div>);
}
import React from "react";
import "../../../styles/main-style.css";

export default function NewsCard({ title, description, date, url }) {

    function pageSwitch() {
        window.open(url)
    }

    return (
        <div className="news-card" onClick={() => {pageSwitch()}}>
            <h2 className="news-title"> <div dangerouslySetInnerHTML={{ __html: title }} /></h2>
            <p className="news-description"> <div dangerouslySetInnerHTML={{ __html: description }} /></p>
            <p className="news-date">{date}</p>
        </div>
    );
}



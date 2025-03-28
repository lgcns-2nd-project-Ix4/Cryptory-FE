import React from "react";
import "../../../styles/post-style.css"

export default function CommentCell({ content, author, date, editButton }) {
    const loginUser = "my"

    return (<>
        {(loginUser === author) && <div className="mycomment">
            <p className="comment-content">{content}</p>
            <div className="comment-footer">
                <span className="comment-author">{author}</span>
                <span className="comment-date">{date}</span>
            </div>
        </div>}

        {(loginUser !== author) && <div className="comment">
            <p className="comment-content">{content}</p>
            <div className="comment-footer">
                <span className="comment-author">{author}</span>
                <span className="comment-date">{date}</span>
            </div>
        </div>}
    </>);
}



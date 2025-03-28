import React, {useEffect, useState} from "react";
import "../../../styles/post-style.css"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import CommentCell from "./CommentCell.jsx";

export default function PostView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const isLogin = sessionStorage.getItem("isLogin");

    const location = useLocation()
    const { coinId, name, symbol, icon, price, change, author, date } = location.state || {}
    const { postId } = useParams()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [viewCnt, setViewCnt] = useState(0)
    const [likeCnt, setLikeCnt] = useState(0)
    const [files, setFiles] = useState([])

    const [commentList, setCommentList] = useState([])

    const [comment, setComment] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            alert(`새 댓글: ${comment}`);
            setComment(""); // 입력 후 초기화
        }
    };

    useEffect(() => {
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts/${postId}`, {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                setTitle(res.data.results[0].title);
                setContent(res.data.results[0].body);
                setViewCnt(res.data.results[0].viewCnt);
                setLikeCnt(res.data.results[0].likeCnt);
                setFiles(res.data.results[0].files);
            })
            .catch(err => {
                setTitle("비트코인 게시판 제목 1")
                setContent("도널드 트럼프 전 미국 대통령의 당선이 공식 인증된 1월 6일, 비트코인 가격은 10만 달러 선을 재돌파하며 큰 폭의 상승을 보였습니다. 트럼프 당선인은 선거 기간 동안 미국을 '암호화폐의" +
                    "수도'로 만들겠다는 공약을 내세웠으며, 이러한 친암호화폐 정책 기대감이 투자자들의 심리를 자극했습니다. 그러나 취임 이후 구체적인 정책 부재와 경제 불확실성으로 인해 비트코인 가격은 하락세로" +
                    "전환되어, 2월 18일 기준 9만5,507달러로 최고점 대비 14% 하락하였습니다.")
            });

        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts/${postId}/comments`, {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                //수정 필요
            })
            .catch(err => {
                setCommentList([
                    { content: "비트코인 게시판 내용 1", author: "User1", date: "2025.02.18"},
                    { content: "비트코인 게시판 내용 2", author: "User2", date: "2025.02.19"},
                    { content: "내가 쓴 비트코인 게시판 내용 1", author: "my", date: "2025.02.19"},
                ])
            });
    }, [])

    return (<div className="content">

        <div className="post-nav">
            <button className="post-btn-on" onClick={() => {
                navigate("/")
            }}>Coin
            </button>
            <button className="post-btn" onClick={() => {
                navigate("/", {state:{path:"news"}})
            }}>News
            </button>
        </div>



        <div className="post-header">
            <div className="user-info-section">
                <img src={icon} alt="User" className="user-icon"/>
                <div>
                    <p className="user-name">{name}</p>
                    <p className="user-symbol">{symbol}</p>
                </div>
            </div>
            <div style={{textAlign: "right"}}>
                <div className="post-author-name">{author}</div>
                <div className="post-date">{date}</div>
                {(sessionStorage.getItem("name") === author) && <div className="post-actions">
                    <button className="edit-btn" onClick={() => {navigate("/post/edit", {state: {name:name, symbol:symbol, icon:icon, price:price, change:change, author:author, date:date, _title:title, _content:content, postId:postId}})}}>수정</button>
                    <button className="delete-btn">삭제</button>
                </div>}
            </div>
        </div>

        <h2 className="post-title">{title}</h2>
        <p className="post-content">{content}</p>
        <div className="post-files">
            {files.map((file, index) => (
                <div key={index} className="post-file">
                    <img 
                        src={`http://${rest_api_host}:${rest_api_port}/attach/files${file.storedDir}`} 
                        alt={file.originalFileName} 
                        style={{ maxWidth: '100%', height: 'auto' }} 
                    />
                </div>
            ))}
        </div>

        <div className="comment-list">
            <h3 className="comment-title">댓글</h3>
            {commentList.length === 0 ? (
                <p>등록된 댓글이 없습니다</p>
            ) : (
                commentList.map((comment, index) => <CommentCell key={index} {...comment} />)
            )}
        </div>

        {(isLogin === null) && <div className="comment-form">
            <p className="un-login-prompt"><a className="un-login-prompt-toLogin" onClick={() => {navigate("/login")}}>로그인</a> 후 이용할 수 있습니다</p>
        </div>}

        {(isLogin !== null) && <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
               className="comment-input"
               placeholder="새로운 댓글을 입력하세요"
               value={comment}
               onChange={(e) => setComment(e.target.value)}/>
            <button type="submit" className="send-btn"/>
        </form>}
    </div>);
}



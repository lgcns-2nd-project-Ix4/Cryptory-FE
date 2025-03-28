import React, { useState } from "react";
import "../../../styles/post-style.css"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

export default function PostCreateView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const location = useLocation()
    const { coinId, name, symbol, icon, price, change, changePrice } = location.state || {}

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        setFiles([...event.target.files]); // ✅ 선택된 파일을 저장
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("post", new Blob([JSON.stringify({ "title": title, "body": content })], { type: "application/json" }));
        Object.values(files).forEach((file) => {formData.append("files", file)});
        console.log(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts`)
        axios({
            method: "POST",
            url: `http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data",
                       "Authorization": `Bearer ${sessionStorage.getItem("token")}`}
        })
        .then(res => {
            console.log(res);
            alert("등록되었습니다.")
            navigate(`/coin/${coinId}`, {
                state:  {name:name, symbol:symbol, icon:icon, price:price, change:change, changePrice:changePrice}
            })
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const post = () => {

    }

    return (
        <div className="write-container">

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

            <div className="user-info-section">
                <img src={icon} alt="User" className="user-icon"/>
                <div>
                    <p className="user-name">{name}</p>
                    <p className="user-symbol">{symbol}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="write-form">
                <div style={{display: "flex"}}>
                    <label className="form-label">TITLE</label>
                    <input
                        type="text"
                        className="title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <label className="form-label">CONTENT</label>
                <textarea
                    className="content-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>

                {/* ✅ 파일 추가 버튼 */}
                <label htmlFor="fileUpload" className="file-upload-label">
                    <label className="form-label">파일 추가</label>
                    <img src="/upload_button.png" alt="파일 추가" className="upload-icon"/>
                </label>
                <input
                    id="fileUpload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{display: "none"}} // ✅ 기본 파일 입력 버튼 숨기기
                />

                {/* ✅ 파일 목록 표시 */}
                {files.length > 0 && (
                    <div className="file-list">
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="button-group">
                    <button type="button" className="cancel-btn" onClick={() => {
                        navigate(`/coin/${coinId}`, {
                            state:  {name:name, symbol:symbol, icon:icon, price:price, change:change, changePrice:changePrice}
                        })
                    }}>취소
                    </button>
                    <button type="submit" className="submit-btn">등록</button>
                </div>
            </form>
        </div>
    );
}



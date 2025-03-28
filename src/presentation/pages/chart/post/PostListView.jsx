import axios from "axios";
import {useEffect, useState} from "react";
import PostCard from "./PostCard.jsx";
import {useNavigate} from "react-router-dom";

export default function PostListView({ coinId, name, symbol, icon, price, change, changePrice }) {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const isLogin = sessionStorage.getItem("isLogin");

    const [postData, setPostData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts`)
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts`, {headers: {"Content-Type": "application/json"}})
            .then(res => {
                const posts = res.data.results[0]?.posts || [];
                console.log(posts);

                let tempData = [];
                posts.forEach(post => {
                    tempData.push({
                        postId: post.id,
                        title: post.title,
                        author: post.nickname,
                        date: post.createdAt
                    });
                });
                setPostData(tempData);
            })
            .catch(err => {

            });
    }, [])

    return (<>
        {(isLogin !== null) && <button className="write-btn" onClick={() => {navigate("/post", {state: {coinId:coinId, name:name, symbol:symbol, icon:icon, price:price, change:change, changePrice:changePrice, prior:"post"}})}}>
            <img src="/write_post.png" alt="write post"/>
            글쓰기
        </button>}
        <div className="board">

            {postData.map((post, index) => (
                <PostCard key={index} {...post} coinId={coinId} name={name} symbol={symbol} icon={icon} price={price} change={change} />
            ))}
        </div>
    </>);
}
import React, {useEffect, useState} from "react";
import "../../styles/mypage-style.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function MypageView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const [nickname, setNickname] = useState("")
    const [profile, setProfile] = useState("")
    const [editNickname, setEditNickname] = useState(false)
    const [editProfile, setEditProfile] = useState(false)
    const [newNickname, setNewNickname] = useState("");
    const [newProfile, setNewProfile] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/users/me`, {headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}})
            .then(res => {
                setNickname(res.data.results[0].nickname);
                setProfile(res.data.results[0].imageUrl)
            })
            .catch(err => {
                setNickname("UserName")
                setProfile("https://cryptologos.cc/logos/bitcoin-btc-logo.png")
            });
    }, []);

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = `http://${rest_api_host}:${rest_api_port}/attach/files/` + file;
            console.log(imageUrl);
            setProfile(imageUrl);
            setEditProfile(true)
        }
    };

    const profileChange = () => {
        axios
            .patch(
                `http://${rest_api_host}:${rest_api_port}/api/v1/users/me/image`,
                {
                    params: {"file": profile},
                    headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
                })
            .then(res => {
                console.log(res.data);
                alert("프로필 이미지를 변경했습니다.")
                setEditProfile(false)
            })
            .catch(err => {

            });
    }

    const nicknameChange = () => {
        axios
            .patch(
                `http://${rest_api_host}:${rest_api_port}/api/v1/users/me/nickname`,
                {
                    params: {"nickname": newNickname},
                    headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
                })
            .then(res => {
                alert("닉네임을 변경했습니다.")
                setEditNickname(false)
            })
            .catch(err => {

            });
    }

    const withdraw = () => {
        axios
            .delete(
            `http://${rest_api_host}:${rest_api_port}/api/v1/users/me`,
            {
                headers: {"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
            })
            .then(res => {
                alert("탈퇴했습니다.");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("isLogin")
                sessionStorage.removeItem("name")
                navigate("/")
            })
            .catch(err => {

            });
    }

    return (<div className="profile-container">
        <div className="profile-image-section">
            <img src={profile} alt="Profile" className="profile-image" />
            {(editProfile) && <button className="profile-image-btn">
                변경하기
            </button>}
            {(!editProfile) && <label className="profile-image-btn">
                프로필 사진 변경
                <input type="file" accept="image/*" onChange={handleProfileImageChange} hidden />
            </label>}
        </div>

        <div className="nickname-section">
            <p className="nickname-label">닉네임</p>
            {(!editNickname) && <p className="nickname-text">{nickname}</p>}
            {(editNickname) && <input
                type="text"
                className="nickname-input"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
            />}
        </div>

        {(editNickname) && <button className="nickname-btn" onClick={() => {nicknameChange()}}>
            변경하기
        </button>}

        {(!editNickname) && <button className="nickname-btn" onClick={() => {setEditNickname(true)}}>
            닉네임 변경
        </button>}

        <div className="action-buttons">
            <p className="kakao-login">KakaoLogin</p>
            <button className="delete-account-btn">회원 탈퇴</button>
        </div>

    </div>);
}
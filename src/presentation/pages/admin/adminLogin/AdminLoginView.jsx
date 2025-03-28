import {useEffect, useState} from "react";
import {Cookies, useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import "../../../styles/admin-login-style.css"

export default function AdminLoginView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const [adminId, setAdminId] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const [cookies] = useCookies();
    const navigate = useNavigate();

    const handleAdminLogin = (e) => {
        const params = new URLSearchParams();
        params.append('username', adminId);
        params.append('password', adminPassword);

        axios.post(`http://${rest_api_host}:${rest_api_port}/admin/login`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
         })
        .then(response => {
            console.log(response.headers.authorization);
            sessionStorage.setItem("token", response.headers.authorization);
            sessionStorage.setItem("isLoginAdmin", true);
            navigate('/admin');

        })
        .catch(error => {
            console.error('관리자 로그인 오류:', error);
            navigate('/admin/login');
        });
    }


    return (
    <div className="admin-login-section">
        <div className="admin-login-bg">
            <h2 className="admin-login-title">Admin Login</h2>
            <div className="admin-login-content">
                <div className="admin-login-input-lines">
                    <div className="admin-login-input-line">
                        <label>ID</label>
                        <input type="text" value={adminId} onChange={e => setAdminId(e.target.value)} />
                    </div>
                    <div className="admin-login-input-line">
                        <label>Password</label>
                        <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
                    </div>
                </div>
            </div>
            
            <button className="admin-login-button" onClick={handleAdminLogin}>로그인</button>
        </div>
    </div>)
}
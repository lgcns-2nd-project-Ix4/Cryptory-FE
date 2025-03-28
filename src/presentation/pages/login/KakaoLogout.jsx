import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function KakaoLogout() {

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("isLogin");
        sessionStorage.removeItem("name");
        navigate('/');
    })
    return (<>
        로그아웃중...
    </>)
}
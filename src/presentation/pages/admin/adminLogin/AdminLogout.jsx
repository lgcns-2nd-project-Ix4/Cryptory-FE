import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function AdminLogout() {

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("isLoginAdmin");
        navigate('/admin/login');
    }, []);

    return (<>

    </>)
}
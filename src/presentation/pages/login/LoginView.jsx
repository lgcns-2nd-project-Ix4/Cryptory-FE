import axios from "axios";
import "../../styles/login-style.css"

export default function LoginView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const kakao_button_style = {
        width: "200px",
        height: "40px",
        backgroundImage: 'URL("/kakao_login.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: 'none',
        borderRadius: '5px',
    }

    const kakaoLogin = () => {
        window.location.href = `http://${rest_api_host}:${rest_api_port}/oauth2/authorization/kakao`
        // axios.get()
        //     .then(res => {
        //
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    }

    return (<div className="login-section">
        <h2 className="login-title">Login</h2>
        <button style={kakao_button_style} onClick={kakaoLogin}></button>
    </div>)
}
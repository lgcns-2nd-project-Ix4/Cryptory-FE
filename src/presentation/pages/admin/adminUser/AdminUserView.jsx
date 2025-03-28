import {useState} from "react";
import "../../../styles/admin-style.css"
import AdminGeneralUserView from "./AdminGeneralUserView";
import AdminAdminUserView from "./AdminAdminUserView";

export default function AdminUserView() {

    const [type, setType] = useState("general");

    return (<div className="admin-section">
        <h2 className="admin-title">사용자 관리</h2>
        {(type === 'general') && <>
            <div className="sub-main-nav">
                <button className="sub-main-btn-on">사용자</button>
                <button className="sub-main-btn" onClick={() => {setType("admin")}}>관리자</button>
            </div>
            <AdminGeneralUserView/>
        </>}
        {(type === 'admin') && <>
            <div className="sub-main-nav">
                <button className="sub-main-btn" onClick={() => {setType("general")}}>사용자</button>
                <button className="sub-main-btn-on">관리자</button>
            </div>
            <AdminAdminUserView/>
        </>}
    </div>
    )
}
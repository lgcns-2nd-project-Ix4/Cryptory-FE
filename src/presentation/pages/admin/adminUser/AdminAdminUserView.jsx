import { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/admin-table-style.css"

export default function AdminAdminUserView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ nickname: "", id: "", password: "" });

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = (page) => {
        axios.get(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/users/admins`, {
            headers: { "Authorization": `${sessionStorage.getItem("token")}` }
        })
            .then(res => {
                setUsers(res.data.content);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setUsers([
                    {
                        "userId": 99,
                        "nickname": "관리자1",
                        "role": "ADMIN",
                        "isDenied": false
                    },
                    {
                        "userId": 92,
                        "nickname": "관리자2",
                        "role": "ADMIN",
                        "isDenied": false
                    },
                ]);
                setTotalPages(1);
            });
    };

    const handleToggleBlockUser = (userId, isCurrentlyDenied) => {
        const newStatus = !isCurrentlyDenied;

        axios.patch(
            `http://${rest_api_host}:${rest_api_port}/api/v1/admin/users/admins/${userId}`,
            { isDenied: newStatus },
            {
                headers: {
                    "Authorization": `${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
        )
        .then(response => {
            setUsers(users.map(user =>
                user.userId === userId ? { ...user, isDenied: response.data.isDenied } : user
            ));
            alert(newStatus ? "사용자가 차단되었습니다." : "사용자 차단이 해제되었습니다.");
        })
        .catch(error => {
            console.error("Error updating user status:", error);
            setUsers(users.map(user =>
                user.userId === userId ? { ...user, isDenied: newStatus } : user
            ));
            alert(newStatus ? "사용자가 차단되었습니다." : "사용자 차단이 해제되었습니다.");
        });
    };

    const handleAddAdmin = async () => {
        try {
            await axios.post(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/users/admins`, newAdmin, {
                headers: {
                    "Authorization": `${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setShowModal(false);
            fetchUsers(); // 새 관리자 추가 후 목록 갱신
        } catch (error) {
            console.error("관리자 추가 실패:", error);
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h3 style={{ fontWeight: "normal" }}>ADMIN</h3>
                <button className="admin-add-btn" onClick={() => setShowModal(true)}>관리자 추가</button>
            </div>
            <table className="admin-user-table">
                <thead>
                    <tr>
                        <th className="user-id">User ID</th>
                        <th className="nickname">닉네임</th>
                        <th className="login-type">Login Type</th>
                        <th className="role">역할</th>
                        <th className="manage">관리</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.nickname}</td>
                            <td>KAKAO</td>
                            <td>{user.role}</td>
                            <td>
                                <button 
                                    className={`admin-user-action-btn ${user.isDenied ? "blocked" : ""}`}
                                    onClick={() => handleToggleBlockUser(user.userId, user.isDenied)}
                                >
                                    {user.isDenied ? "차단 해제" : "차단"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
                <button className="prev"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    〈 이전
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button className="next"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음 〉
                </button>
            </div>

            {/* 관리자 추가 모달 */}
            {showModal && (
                <div className="admin-add-modal-overlay">
                    <div className="admin-add-modal-content">
                        <h3 style={{fontSize:"30px", fontWeight:"lighter"}}>관리자 추가</h3>
                        <div className="admin-add-modal-input-lines">
                            <div className="admin-add-modal-input-line">
                                <label>Nickname</label>
                                <input type="text" value={newAdmin.nickname} onChange={e => setNewAdmin({ ...newAdmin, nickname: e.target.value })} />
                            </div>
                            <div className="admin-add-modal-input-line">
                                <label>ID</label>
                                <input type="text" value={newAdmin.id} onChange={e => setNewAdmin({ ...newAdmin, id: e.target.value })} />
                            </div>
                            <div className="admin-add-modal-input-line">
                                <label>Password</label>
                                <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                            </div>
                        </div>
                        <div className="admin-add-modal-buttons">
                            <button className="admin-add-cancel-btn" onClick={() => setShowModal(false)}>취소</button>
                            <button className="admin-add-confirm-btn" onClick={handleAddAdmin}>추가</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import "../../../styles/admin-coindetail-style.css"
import "../../../styles/admin-table-style.css"

export default function AdminCoinManagementView() {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;
    const gpt_api_port = import.meta.env.VITE_GPT_API_PORT;
    const gpt_api_host = import.meta.env.VITE_GPT_API_HOST;

    const params = useParams();
    const coinId = params.coinId;

    const navigate = useNavigate();

    const location = useLocation()
    const { name, symbol, logoUrl, isDisplayedFront } = location.state || {}
    
    const [isDisplayed, setIsDisplayed] = useState(true);

    const [issueData, setIssueData] = useState([]);
    const [checkedIssues, setCheckedIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState({issueId: 0, date: "", title: "", summaryContent:"", createdBy:"", createdAt:"", updatedAt:"", newsTitle:"", source:"", type:"", isDeleted:false});
    const [showIssueUpdateModal, setShowIssueUpdateModal] = useState(false);
    const [newIssue, setNewIssue] = useState({date: "", title: "", summaryContent:"", newsTitle:"", source:""});
    const [showIssueCreateModal, setShowIssueCreateModal] = useState(false);

    const [postData, setPostData] = useState([]);
    const [checkedPosts, setCheckedPosts] = useState([]);

    const [GPTloading, setGPTLoading] = useState(false);


    useEffect(() => {
        setIsDisplayed(isDisplayedFront);
        // 코인 기본 정보 조회
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/coins/${coinId}`, {headers: {"Authorization": `${sessionStorage.getItem("token")}`}})
            .then(res => {
                console.log("코인 기본 정보:", res.data);
                //setIsDisplayed(res.data.isDisplayed);
            })
            .catch(err => {
                console.error("코인 기본 정보 조회 실패:", err);
                setIsDisplayed(isDisplayedFront);
            });
    }, [])

    useEffect(() => {
    // 코인 이슈 목록 조회
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/coins/${coinId}/issues`, {headers: {"Authorization": `${sessionStorage.getItem("token")}`}})
            .then(res => {
                console.log("코인 이슈 목록 조회:", res.data);
                const issues = res.data;
                console.log(issues);

                let tempData = [];
                issues.forEach(issue => {
                    tempData.push({
                        issueId: issue.issueId,
                        date: issue.date,
                        title: issue.title,
                        createdBy: issue.createdBy,
                        createdAt: issue.createdAt,
                        updatedAt: issue.updatedAt
                    });
                });
                setIssueData(tempData);
            })
            .catch(err => {
                console.error("코인 이슈 목록 조회 에러:", err);
                const issues = [
                    {
                        "issueId": 1,
                        "date": "2024-01-28",
                        "title": "비트코인 ETF 승인",
                        "createdBy": 1,
                        "createdAt": "2024-01-28T10:00:00",
                        "updatedAt": null,
                        "isDeleted" : false
                      },
                      {
                        "issueId": 2,
                        "date": "2024-01-27",
                        "title": "이더리움 가격 급등",
                        "createdBy": 1,
                        "createdAt": "2024-01-27T15:30:00",
                        "updatedAt": "2024-01-27T16:00:00",
                        "isDeleted" : false
                      }
                ]
                let tempData = [];
                issues.forEach(issue => {
                    tempData.push({
                        issueId: issue.issueId,
                        date: issue.date,
                        title: issue.title,
                        createdBy: issue.createdBy,
                        createdAt: issue.createdAt,
                        updatedAt: issue.updatedAt,
                        isDeleted: issue.isDeleted
                    });
                });
                setIssueData(tempData);
            });
    }, [showIssueCreateModal])

    useEffect(() => {
        // 코인 게시글 목록 조회
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}/posts`, {headers: {"Authorization": `${sessionStorage.getItem("token")}`, "Content-Type": "application/json"}})
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
                console.error("코인 게시글 목록 조회 에러:", err);
                const posts = [
                    {
                        "id": 1,
                        "title": "제목",
                        "nickname": "형서",
                        "createdAt": "2025-02-23"
                    },
                    {
                        "id": 2,
                        "title": "제목2",
                        "nickname": "형서2",
                        "createdAt": "2025-02-23"
                    }
                ]
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
            });
    }, [])

    /* 코인 노출 여부 변경 함수 */
    const handleToggleDisplayCoin = (coinId, isCurrentlyDisplayed) => {
        const newStatus = !isCurrentlyDisplayed;

        axios.patch(
            `http://${rest_api_host}:${rest_api_port}/api/v1/admin/coins/${coinId}/display?isDisplayed=${isDisplayed}`,
            {
                headers: {
                    "Authorization": `${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
        )
        .then(response => {
            setIsDisplayed(newStatus);
            alert(newStatus ? "코인이 메인 페이지에 노출됩니다." : "코인이 숨김 처리 되었습니다.");
        })
        .catch(error => {
            console.error("Error updating coin status:", error);
            setIsDisplayed(newStatus);
            alert(newStatus ? "코인이 메인 페이지에 노출됩니다." : "코인이 숨김 처리 되었습니다.");
        });
    };

    /* 이슈 선택 및 삭제 관련 함수 */
    const handleCheckboxChangeIssues = (issueId) => {
        setCheckedIssues((prevChecked) =>
          prevChecked.includes(issueId)
            ? prevChecked.filter((id) => id !== issueId)
            : [...prevChecked, issueId]
        );
    };
    const handleSelectAllIssues = (event) => {
        if (event.target.checked) {
            setCheckedIssues(issueData.map((issue) => issue.issueId));
        } else {
            setCheckedIssues([]);
        }
    };
    const handleDeleteCheckedIssues = async () => {
        if (checkedIssues.length === 0) {
          alert("삭제할 이슈를 선택해주세요.");
          return;
        }
      
        const idsPath = checkedIssues.join(","); // Path Parameter로 변환

        axios.patch(
            `http://${rest_api_host}:${rest_api_port}/api/v1/admin/issues?ids=${idsPath}`,
            { isDeleted: true },
            {
                headers: {
                    "Authorization": `${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
        )
        .then(response => {
            alert("선택한 이슈가 삭제되었습니다.");
            setCheckedIssues([]); // 체크박스 초기화
            // 상태 업데이트 로직 추가 (예: 목록 다시 불러오기)
        })
        .catch(error => {
            console.error("Error updating issues status:", error);
        });

      };
    
    /* 이슈 상세 조회 및 수정 관련 함수 */
    const handleIssueClick = async (issueId) => {

        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/issues/${issueId}`, {headers: {"Authorization": `${sessionStorage.getItem("token")}`}})
            .then(res => {
                let tempData = {
                    issueId: res.data.issueId,
                    date: res.data.date,
                    title: res.data.title,
                    summaryContent: res.data.content,
                    createdBy: res.data.createdBy,
                    createdAt: res.data.createdAt,
                    updatedAt: res.data.updatedAt,
                    newsTitle: res.data.newsTitle,
                    source: res.data.source,
                    type: res.data.type,
                    isDeleted: res.data.isDeleted
                }
                setSelectedIssue(tempData);
                setShowIssueUpdateModal(true);
            })
            .catch(err => {
                let tempData = {
                    issueId: 1,
                    date: "2024-01-28",
                    title: "비트코인 ETF 승인",
                    summaryContent: "...",
                    createdBy: "NickName",
                    createdAt: "2024-01-28T10:00:00",
                    updatedAt: null,
                    newsTitle: "...",
                    source : "...",
                    type: "MANUAL",
                    isDeleted : false
                }
                setSelectedIssue(tempData);
                setShowIssueUpdateModal(true);
            });
    };
    const handleIssueUpdate = async () => {
        
        axios.put(
            `http://${rest_api_host}:${rest_api_port}/api/v1/admin/issues/${selectedIssue.issueId}`,
            {
              title: selectedIssue.title,
              content: selectedIssue.summaryContent,
              newsTitle: selectedIssue.newsTitle,
              source: selectedIssue.source,
            },
            {
              headers: {
                "Authorization": `${sessionStorage.getItem("token")}`,
                "Content-Type": "application/json"
              },
            }
          )
          .then(res => {
            alert("이슈가 수정되었습니다.");
            // setIsModalOpen(false); // 모달 닫기
            // 목록 새로고침
          })
          .catch(err => {
            console.error("이슈 수정에 실패했습니다.", err);
          });
      
    };
    
    /* 이슈 생성 관련 함수 */
    const handleIssueCreate = async () => {
        try {
            await axios.post(`http://${rest_api_host}:${rest_api_port}/api/v1/admin/coins/${coinId}/issues`,
            {
                date: newIssue.date,
                title: newIssue.title,
                content: newIssue.summaryContent,
                newsTitle: newIssue.newsTitle,
                source: newIssue.source,
            },
            {
                headers: {
                    "Authorization": `${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            setShowIssueCreateModal(false);
            alert("이슈를 추가했습니다.")
            // 목록 갱신
        } catch (error) {
            console.error("이슈 추가 실패:", error);
        }
    };

    /* 게시글 선택 및 삭제 관련 함수 */
    const handleCheckboxChangePosts = (postId) => {
        setCheckedPosts((prevChecked) =>
          prevChecked.includes(postId)
            ? prevChecked.filter((id) => id !== postId)
            : [...prevChecked, postId]
        );
    };
    const handleSelectAllPosts = (event) => {
        if (event.target.checked) {
            setCheckedPosts(postData.map((post) => post.postId));
        } else {
            setCheckedPosts([]);
        }
    };
    const handleDeleteCheckedPosts = async () => {
        if (checkedPosts.length === 0) {
          alert("삭제할 게시글을 선택해주세요.");
          return;
        }
      
        const idsPath = checkedPosts.join(","); // Path Parameter로 변환

        axios.patch(
            `http://${rest_api_host}:${rest_api_port}/api/v1/admin/posts/${idsPath}`,
            { isDeleted: true },
            {
                headers: {
                    "Authorization": `${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
        )
        .then(response => {
            alert("선택한 게시글이 삭제되었습니다.");
            setCheckedPosts([]); // 체크박스 초기화
            // 상태 업데이트 로직 추가 (예: 목록 다시 불러오기)
        })
        .catch(error => {
            console.error("Error updating posts status:", error);
        });

      };

    const getGPTIssue = () => {
        console.log(symbol);
        console.log(newIssue.date)
        setGPTLoading(true);
        axios({
            method: "POST",
            url: `http://${gpt_api_host}:${gpt_api_port}/api/v1/issue`,
            data: {
                "name": symbol,
                "date": newIssue.date,
            },
            headers: { "Content-Type": "application/json"}
        })
            .then(res => {
                setGPTLoading(false);
                console.log(res)
                setNewIssue({...newIssue, title: res.data.title, summaryContent: res.data.content, newsTitle: res.data.news1_title, source: res.data.news1_link})
            })
            .catch((err) => {
                setGPTLoading(false);
            })
    }

    return (
        <div className="admin-coindetail-content">
        
            <div className="admin-coindetail-nav">
                <button className="admin-coindetail-btn-on" onClick={() => {
                    navigate("/admin")
                }}>Coin
                </button>
                <button className="admin-coindetail-btn" onClick={() => {
                    navigate("/admin", {state:{path:"dashboard"}})
                }}>Dash Board
                </button>
                <button className="admin-coindetail-btn" onClick={() => {
                    navigate("/admin", {state:{path:"user"}})
                }}>User
                </button>
            </div>

            <header>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <img src={logoUrl} className="admin-coindetail-logo"/>
                    <div className="admin-coindetail-info">
                        <p className="admin-coindetail-name">{name}</p>
                        <p className="admin-coindetail-symbol">{symbol}</p>
                    </div>
                    <button className="admin-coin-is-displayed-btn" onClick={() => handleToggleDisplayCoin(coinId, isDisplayed)}>{isDisplayed ? "ON" : "OFF"}</button>
                </div>
            </header>

            {/* 이슈 리스트 */}
            <div className="coin-header">
                <h3>ISSUE</h3>
                <div className="admin-add-btns">
                    <button className="admin-add-btn" onClick={() => setShowIssueCreateModal(true)}>생성</button>
                    <button className="admin-add-btn" onClick={() => handleDeleteCheckedIssues()}>삭제</button>
                </div>
            </div>
            <table className="admin-coin-table">
                <thead>
                    <tr>
                        <th className="admin-check"><input type="checkbox" onChange={handleSelectAllIssues} /></th>
                        <th className="admin-date">DATE</th>
                        <th className="admin-coin-title">TITLE</th>
                        <th className="admin-createDt">CREATE DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {issueData.map(issue => (
                        <tr key={issue.issueId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={checkedIssues.includes(issue.issueId)}
                                    onChange={() => handleCheckboxChangeIssues(issue.issueId)}
                                />
                            </td>
                            <td>{issue.date}</td>
                            <td><div onClick={() => handleIssueClick(issue.issueId)}>{issue.title}</div></td>
                            <td>{issue.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 게시글 리스트 */}
            <div className="coin-header">
                <h3>게시판</h3>
                <button className="admin-add-btn" onClick={() => handleDeleteCheckedPosts()}>삭제</button>
            </div>
            <table className="admin-coin-table">
                <thead>
                    <tr>
                        <th className="admin-check"><input type="checkbox" onChange={handleSelectAllPosts} /></th>
                        <th className="admin-coin-title">제목</th>
                        <th className="admin-date">작성자</th>
                        <th className="admin-createDt">CREATE DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {postData.map(post => (
                        <tr key={post.postId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={checkedPosts.includes(post.postId)}
                                    onChange={() => handleCheckboxChangePosts(post.postId)}
                                />
                            </td>
                            <td>{post.title}</td>
                            <td>{post.author}</td>
                            <td>{post.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 이슈 상세조회/수정 모달 */}
            {showIssueUpdateModal && (
                <div className="admin-add-modal-overlay">
                    <div className="admin-issue-add-modal-content">
                        <h3>ISSUE 수정</h3>
                        <div className="admin-issue-add-modal-input-lines">
                            <div className="admin-add-modal-input-line">
                                <label>DATE</label>
                                <input type="date" value={selectedIssue.date} onChange={e => setSelectedIssue({ ...selectedIssue, date: e.target.value })} />
                            </div>
                            <div className="admin-add-modal-input-line">
                                <label>Title</label>
                                <input type="text" value={selectedIssue.title} onChange={e => setSelectedIssue({ ...selectedIssue, title: e.target.value })} />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems:'flex-start', marginBottom:"40px"}}>
                                <label>Content</label>
                                <textarea className="admin-content-input" value={selectedIssue.summaryContent} onChange={e => setSelectedIssue({ ...selectedIssue, summaryContent: e.target.value })} />
                            </div>
                            <div className="admin-add-modal-input-line">
                                <label>News</label>
                                <input type="hidden" />
                            </div>
                            <div className="admin-add-modal-input-line">
                                <label>Title</label>
                                <input type="text" value={selectedIssue.newsTitle} onChange={e => setSelectedIssue({ ...selectedIssue, newsTitle: e.target.value })} />
                            </div>
                            <div className="admin-add-modal-input-line">
                                <label>Link</label>
                                <input type="text" value={selectedIssue.source} onChange={e => setSelectedIssue({ ...selectedIssue, source: e.target.value })} />
                            </div>
                        </div>
                        <div className="admin-add-modal-buttons">
                            <button className="admin-add-cancel-btn" onClick={() => setShowIssueUpdateModal(false)}>취소</button>
                            <button className="admin-add-confirm-btn" onClick={() => handleIssueUpdate()}>수정</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 이슈 생성 모달 */}
            {showIssueCreateModal && (
                <div className="admin-add-modal-overlay">
                    <div className="admin-issue-add-modal-content">
                        <h3 style={{fontSize:"30px", fontWeight:"lighter"}}>ISSUE 추가</h3>
                        <button className="admin-write-btn" onClick={() => {getGPTIssue()}}>
                            AI 자동완성
                        </button>
                        <div className="admin-issue-add-modal-input-lines">
                            <div className="admin-add-modal-input-line">
                                <label>DATE</label>
                                <input type="date" value={newIssue.date} onChange={e => setNewIssue({ ...newIssue, date: e.target.value })} />
                            </div>
                            <div className="admin-issue-add-modal-input-line">
                                <label>Title</label>
                                <input type="text" value={newIssue.title} onChange={e => setNewIssue({ ...newIssue, title: e.target.value })} />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems:'flex-start', marginBottom:"40px"}}>
                                <label>Content</label>
                                <textarea className="admin-content-input" value={newIssue.summaryContent} onChange={e => setNewIssue({ ...newIssue, summaryContent: e.target.value })} />
                            </div>
                            <div className="admin-issue-add-modal-input-line">
                                <label>News</label>
                                <input type="hidden" />
                            </div>
                            <div className="admin-issue-add-modal-input-line">
                                <label>Title</label>
                                <input type="text" value={newIssue.newsTitle} onChange={e => setNewIssue({ ...newIssue, newsTitle: e.target.value })} />
                            </div>
                            <div className="admin-issue-add-modal-input-line">
                                <label>Link</label>
                                <input type="text" value={newIssue.source} onChange={e => setNewIssue({ ...newIssue, source: e.target.value })} />
                            </div>
                        </div>
                        <div className="admin-add-modal-buttons">
                            <button className="admin-add-cancel-btn" onClick={() => setShowIssueCreateModal(false)}>취소</button>
                            <button className="admin-add-confirm-btn" onClick={() => handleIssueCreate()}>추가</button>
                        </div>
                    </div>
                </div>
            )}

            {(GPTloading) && <div className="admin-add-modal-overlay">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>GPT 응답을 기다리는 중...</p>
                </div>
            </div>}
        </div>
    )
}
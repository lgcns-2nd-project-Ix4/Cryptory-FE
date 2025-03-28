

/*
요청 엔드포인트: GET /api/v1/admin/dashboard
요청 파라미터: startDate(String: yyyy-MM-dd)(필수 x), endDate(String: yyyy-MM-dd)(필수 x), peroid(String: daily, weekly, monthly)(필수 x)
요청 파미터 없으면 전체기간 조회
응답 예시 (모든 데이터 한번에 넘어옴): 방문자 수, 페이지 뷰 수, 신규 유저 수, 코인별 api 호출 수
"visits": {
    "daily": 100,
    "weekly": 500,
    "monthly": 2000,
    "total": 10000
  },
  "pageViews": {
    "daily": 300,
    "weekly": 1500,
    "monthly": 6000,
    "total": 30000
  },
  "newUsers": {
    "daily": 10,
    "weekly": 50,
    "monthly": 200,
    "total": 1000
  },
  "apiCallCounts": {
    "BTC": {
      "daily": 20,
      "weekly": 100,
      "monthly": 400,
      "total": 2000
    },
    "ETH": {
      "daily": 15,
      "weekly": 80,
      "monthly": 300,
      "total": 1500
    },
    "DOGE":{
      "daily": 25,
      "weekly": 30,
      "monthly": 200,
      "total": 3000
    }

  }
}
*/
import "../../../styles/admin-style.css";
import OverviewCard from "./OverviewCard.jsx";
import LineChart from "./LineChart.jsx";
import DonutChart from "./DonutChart.jsx";
import BarChart from "./BarChart.jsx";
export default function AdminDashboardView() {
  return (
    <div className="admin-section">
      <h2 className="admin-title">Dash Board</h2>
      <div className="dashboard-container">
        {/* Overview 카드 */}
        <div className="overview-grid">
          <OverviewCard
            title="Views"
            value="7,265"
            change="+11.01%"
            color="blue-light"
          />
          <OverviewCard
            title="Visits"
            value="3,671"
            change="-0.03%"
            color="blue-medium"
          />
          <OverviewCard
            title="New Users"
            value="156"
            change="+15.03%"
            color="purple-light"
          />
        </div>

        {/* 차트 섹션 */}
        <div className="charts-container">
          <div className="chart-box">
            <h3>Total Users</h3>
            <LineChart />
          </div>
          <div className="chart-box">
            <h3>GPT 사용량</h3>
            <DonutChart />
          </div>
        </div>

        {/* 트래픽 바 차트 */}
        <div className="chart-box traffic-box">
          <h3>Traffic by Coin</h3>
          <BarChart />
        </div>
      </div>
    </div>
  );
}

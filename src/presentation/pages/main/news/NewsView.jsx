import {useEffect, useState} from "react";
import axios from "axios";
import NewsCard from "./NewsCard.jsx";
import "../../../styles/main-style.css"

export default function NewsView({ type }) {

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        if (type === "main") {
            axios
                .get(`http://${rest_api_host}:${rest_api_port}/api/v1/news`, {headers: {"Content-Type": "application/json"}})
                .then(res => {
                    let tempNews = []
                    res.data.results.map((item) => {
                        tempNews.push({
                            title: item.title,
                            description: item.description,
                            date: item.pubDate,
                            url: item.link,
                        })
                    })
                    setNewsData(tempNews);
                })
                .catch((err) => {

                })

        }
        else {
            axios
                .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${type}/news`, {headers: {"Content-Type": "application/json"}})
                .then(res => {

                    let tempNews = []
                    res.data.results.map((item) => {
                        tempNews.push({
                            title: item.title,
                            description: item.description,
                            date: item.pubDate,
                            url: item.link,
                        })
                    })
                    setNewsData(tempNews);

                })
                .catch(err => {
                    setNewsData([
                        {
                            title: "美 연준 매파 기조 우려에…비트코인 1억4400만원대로 하락",
                            description: "미국 연방준비제도(연준)의 공개시장위원회(FOMC) 회의록 공개를 앞두고 비트코인 가격이 9만5000달러대로 낮아졌다. 제롬 파월 연준 의장이 금리 인하를 서두르지 않겠다는 입장 등을 밝히며 매파 기조를 우려한 영향이...",
                            date: "2025.02.19",
                            url: "https://www.naver.com",
                        },
                        {
                            title: "\"약세장 진입\"…비트코인, 9만6000달러 횡보[코인브리핑]",
                            description: "비트코인, 9만6000달러 횡보…\"약세장 접어들었다\" 비트코인(BTC)이 조정장에 진입한 뒤 박스권을 벗어나지 못하고 있다. 미국 연방준비제도(연준)의 기준금리 인하 속도 조절론에 무게가 쏠린 상황에서 뚜렷한 호재 없이...",
                            date: "2025.02.18",
                            url: "https://www.naver.com",
                        },
                    ]);
                });

        }
    }, [])

    return (
        <div className="news-list">
            {newsData.map((news, index) => (
                <NewsCard key={index} {...news} />
            ))}
        </div>
    );
}
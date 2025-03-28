import React, {useEffect, useRef, useState} from "react";
import Chart from 'react-apexcharts';
import "../../styles/chart-style.css"
import {qunit} from "globals";
import axios from "axios";

function aggregateDataToMonthly(data) {
    const aggregatedData = [];
    let monthData = [];

    data.forEach((datum, index) => {
        monthData.push(datum);

        // 매 30일마다 또는 마지막 데이터일 때 집계
        if ((index + 1) % 30 === 0 || index === data.length - 1) {
            const open = monthData[0].open;
            const close = monthData[monthData.length - 1].close;
            const high = Math.max(...monthData.map(d => d.high));
            const low = Math.min(...monthData.map(d => d.low));
            const date = monthData[0].date; // 주의 시작 날짜

            aggregatedData.push({ date, open, close, high, low });
            monthData = [];
        }
    });

    return aggregatedData;
}

function aggregateDataToWeekly(data) {
    const aggregatedData = [];
    let weekData = [];

    data.forEach((datum, index) => {
        weekData.push(datum);

        // 매 7일마다 또는 마지막 데이터일 때 집계
        if ((index + 1) % 7 === 0 || index === data.length - 1) {
            const open = weekData[0].open;
            const close = weekData[weekData.length - 1].close;
            const high = Math.max(...weekData.map(d => d.high));
            const low = Math.min(...weekData.map(d => d.low));
            const date = weekData[0].date; // 주의 시작 날짜

            aggregatedData.push({ date, open, close, high, low });
            weekData = [];
        }
    });

    return aggregatedData;
}

const tempData = [
    {"date":"2024-08-24","open":126465000,"close":125211000,"high":129216000,"low":125053500},
    {"date":"2024-08-25","open":125211000,"close":124961250,"high":127566000,"low":124028250},
    {"date":"2024-08-26","open":124961250,"close":127353000,"high":127794000,"low":123077250},
    {"date":"2024-08-27","open":127353000,"close":128281500,"high":128658750,"low":125307000},
    {"date":"2024-08-28","open":128281500,"close":129717750,"high":130551000,"low":126273750},
    {"date":"2024-08-29","open":129717750,"close":129813750,"high":132108750,"low":128860500},
    {"date":"2024-08-30","open":129813750,"close":128321250,"high":131995500,"low":127338000},
    {"date":"2024-08-31","open":128321250,"close":128390250,"high":129429000,"low":125730750},
    {"date":"2024-09-01","open":128390250,"close":127216500,"high":129626250,"low":126990750},
    {"date":"2024-09-02","open":127216500,"close":125764500,"high":129348000,"low":124344000},
    {"date":"2024-09-03","open":125764500,"close":125166000,"high":126750000,"low":123059250},
    {"date":"2024-09-04","open":125166000,"close":124333500,"high":126773250,"low":123159000},
    {"date":"2024-09-05","open":124333500,"close":123362250,"high":127302000,"low":123108750},
    {"date":"2024-09-06","open":123362250,"close":125496750,"high":126344250,"low":121032750},
    {"date":"2024-09-07","open":125496750,"close":124168500,"high":128409000,"low":122604000},
    {"date":"2024-09-08","open":124168500,"close":125607000,"high":126255750,"low":122707500},
    {"date":"2024-09-09","open":125607000,"close":125391000,"high":126849000,"low":124193250},
    {"date":"2024-09-10","open":125391000,"close":124470000,"high":126972750,"low":124322250},
    {"date":"2024-09-11","open":124470000,"close":124322250,"high":126727500,"low":123105000},
    {"date":"2024-09-12","open":124322250,"close":124969500,"high":126673500,"low":122301750},
    {"date":"2024-09-13","open":124969500,"close":125233500,"high":126021750,"low":123639000},
    {"date":"2024-09-14","open":125233500,"close":124404000,"high":126676500,"low":124103250},
    {"date":"2024-09-15","open":124404000,"close":123671250,"high":125973000,"low":121800000},
    {"date":"2024-09-16","open":123671250,"close":121831500,"high":125454000,"low":121670250},
    {"date":"2024-09-17","open":121831500,"close":122040000,"high":123852750,"low":120079500},
    {"date":"2024-09-18","open":122040000,"close":123187500,"high":123297750,"low":120086250},
    {"date":"2024-09-19","open":123187500,"close":121113000,"high":124845000,"low":121047000},
    {"date":"2024-09-20","open":121113000,"close":120735000,"high":123278250,"low":119213250},
    {"date":"2024-09-21","open":120735000,"close":120465750,"high":123162000,"low":117979500},
    {"date":"2024-09-22","open":120465750,"close":120231000,"high":122409750,"low":117655500},
    {"date":"2024-09-23","open":120231000,"close":121564500,"high":122550000,"low":118214250},
    {"date":"2024-09-24","open":121564500,"close":121254000,"high":124414500,"low":119479500},
    {"date":"2024-09-25","open":121254000,"close":119707500,"high":122007000,"low":119141250},
    {"date":"2024-09-26","open":119707500,"close":119690250,"high":120904500,"low":116940750},
    {"date":"2024-09-27","open":119690250,"close":118220250,"high":121409250,"low":117062250},
    {"date":"2024-09-28","open":118220250,"close":118605000,"high":120219000,"low":115665750},
    {"date":"2024-09-29","open":118605000,"close":119259750,"high":119517750,"low":117748500},
    {"date":"2024-09-30","open":119259750,"close":119098500,"high":121083750,"low":117826500},
    {"date":"2024-10-01","open":119098500,"close":120400500,"high":121077000,"low":118245750},
    {"date":"2024-10-02","open":120400500,"close":119798250,"high":122532750,"low":118616250},
    {"date":"2024-10-03","open":119798250,"close":118783500,"high":121926750,"low":117348750},
    {"date":"2024-10-04","open":118783500,"close":118919250,"high":119864250,"low":117376500},
    {"date":"2024-10-05","open":118919250,"close":121192500,"high":121483500,"low":117234750},
    {"date":"2024-10-06","open":121192500,"close":119697750,"high":123680250,"low":119191500},
    {"date":"2024-10-07","open":119697750,"close":118443000,"high":122334000,"low":117516000},
    {"date":"2024-10-08","open":118443000,"close":118371750,"high":119818500,"low":117054000},
    {"date":"2024-10-09","open":118371750,"close":118150500,"high":120808500,"low":117288750},
    {"date":"2024-10-10","open":118150500,"close":119874000,"high":120665250,"low":116133750},
    {"date":"2024-10-11","open":119874000,"close":120058500,"high":121109250,"low":117510750},
    {"date":"2024-10-12","open":120058500,"close":120064500,"high":121206750,"low":118191000},
    {"date":"2024-10-13","open":120064500,"close":117344250,"high":121575000,"low":117120000},
    {"date":"2024-10-14","open":117344250,"close":116535000,"high":119346000,"low":116010000},
    {"date":"2024-10-15","open":116535000,"close":117203250,"high":119037000,"low":115696500},
    {"date":"2024-10-16","open":117203250,"close":117150750,"high":119517000,"low":115007250},
    {"date":"2024-10-17","open":117150750,"close":117162000,"high":119335500,"low":116160000},
    {"date":"2024-10-18","open":117162000,"close":118713000,"high":119781750,"low":115658250},
    {"date":"2024-10-19","open":118713000,"close":119852250,"high":120395250,"low":116343000},
    {"date":"2024-10-20","open":119852250,"close":119798250,"high":121803000,"low":117806250},
    {"date":"2024-10-21","open":119798250,"close":121788750,"high":122709750,"low":118255500},
    {"date":"2024-10-22","open":121788750,"close":120908250,"high":123589500,"low":120722250},
    {"date":"2024-10-23","open":120908250,"close":121204500,"high":122632500,"low":119694750},
    {"date":"2024-10-24","open":121204500,"close":123027750,"high":124017750,"low":119593500},
    {"date":"2024-10-25","open":123027750,"close":124394250,"high":124884750,"low":120494250},
    {"date":"2024-10-26","open":124394250,"close":124029750,"high":126174000,"low":122909250},
    {"date":"2024-10-27","open":124029750,"close":124704750,"high":125562000,"low":123116250},
    {"date":"2024-10-28","open":124704750,"close":123560250,"high":126709500,"low":122605500},
    {"date":"2024-10-29","open":123560250,"close":125600250,"high":126552750,"low":122232750},
    {"date":"2024-10-30","open":125600250,"close":127597500,"high":127622250,"low":124842000},
    {"date":"2024-10-31","open":127597500,"close":128322000,"high":130039500,"low":125482500},
    {"date":"2024-11-01","open":128322000,"close":129541500,"high":129880500,"low":126156000},
    {"date":"2024-11-02","open":129541500,"close":129270000,"high":130457250,"low":127749000},
    {"date":"2024-11-03","open":129270000,"close":127782750,"high":132236250,"low":126841500},
    {"date":"2024-11-04","open":127782750,"close":127676250,"high":129105000,"low":126179250},
    {"date":"2024-11-05","open":127676250,"close":128496000,"high":130405500,"low":125243250},
    {"date":"2024-11-06","open":128496000,"close":126790500,"high":129794250,"low":126705750},
    {"date":"2024-11-07","open":126790500,"close":125979750,"high":129122250,"low":125231250},
    {"date":"2024-11-08","open":125979750,"close":127305000,"high":128919750,"low":124650750},
    {"date":"2024-11-09","open":127305000,"close":126670500,"high":129823500,"low":124662000},
    {"date":"2024-11-10","open":126670500,"close":128141250,"high":128708250,"low":124836000},
    {"date":"2024-11-11","open":128141250,"close":130392750,"high":130597500,"low":126579000},
    {"date":"2024-11-12","open":130392750,"close":132340500,"high":132968250,"low":128706750},
    {"date":"2024-11-13","open":132340500,"close":131582250,"high":133162500,"low":130386000},
    {"date":"2024-11-14","open":131582250,"close":129964500,"high":133449750,"low":129662250},
    {"date":"2024-11-15","open":129964500,"close":130152000,"high":130742250,"low":128423250},
    {"date":"2024-11-16","open":130152000,"close":131423250,"high":132402750,"low":128568000},
    {"date":"2024-11-17","open":131423250,"close":130297500,"high":133587750,"low":129222000},
    {"date":"2024-11-18","open":130297500,"close":130471500,"high":131115750,"low":127527000},
    {"date":"2024-11-19","open":130471500,"close":131618250,"high":132168750,"low":127845750},
    {"date":"2024-11-20","open":131618250,"close":130527000,"high":133026750,"low":130017750},
    {"date":"2024-11-21","open":130527000,"close":131165250,"high":133209000,"low":129558750},
    {"date":"2024-11-22","open":131165250,"close":132375000,"high":133335750,"low":129363750},
    {"date":"2024-11-23","open":132375000,"close":132827250,"high":135212250,"low":131312250},
    {"date":"2024-11-24","open":132827250,"close":131194500,"high":134645250,"low":129963000},
    {"date":"2024-11-25","open":131194500,"close":133020750,"high":133781250,"low":130143000},
    {"date":"2024-11-26","open":133020750,"close":132829500,"high":134197500,"low":130330500},
    {"date":"2024-11-27","open":132829500,"close":133812750,"high":135648750,"low":131457750},
    {"date":"2024-11-28","open":133812750,"close":135783750,"high":136663500,"low":132114000},
    {"date":"2024-11-29","open":135783750,"close":137193000,"high":138127500,"low":133512750},
    {"date":"2024-11-30","open":137193000,"close":138114000,"high":138182250,"low":134812500},
    {"date":"2024-12-01","open":138114000,"close":137423250,"high":140109000,"low":135256500},
    {"date":"2024-12-02","open":137423250,"close":137188500,"high":139332750,"low":136246500},
    {"date":"2024-12-03","open":137188500,"close":137860500,"high":138072750,"low":135079500},
    {"date":"2024-12-04","open":137860500,"close":136077000,"high":139297500,"low":135101250},
    {"date":"2024-12-05","open":136077000,"close":134394000,"high":138375000,"low":133203750},
    {"date":"2024-12-06","open":134394000,"close":133314000,"high":135662250,"low":133094250},
    {"date":"2024-12-07","open":133314000,"close":132771750,"high":134155500,"low":132411750},
    {"date":"2024-12-08","open":132771750,"close":133484250,"high":134893500,"low":130072500},
    {"date":"2024-12-09","open":133484250,"close":132924750,"high":135357750,"low":131841000},
    {"date":"2024-12-10","open":132924750,"close":132079500,"high":135698250,"low":130900500},
    {"date":"2024-12-11","open":132079500,"close":133434750,"high":133452750,"low":130545750},
    {"date":"2024-12-12","open":133434750,"close":134875500,"high":135963750,"low":131541000},
    {"date":"2024-12-13","open":134875500,"close":132819000,"high":137824500,"low":132799500},
    {"date":"2024-12-14","open":132819000,"close":132181500,"high":134718750,"low":130836750},
    {"date":"2024-12-15","open":132181500,"close":132414750,"high":134446500,"low":131340750},
    {"date":"2024-12-16","open":132414750,"close":131890500,"high":133533750,"low":130687500},
    {"date":"2024-12-17","open":131890500,"close":130461000,"high":133803000,"low":130238250},
    {"date":"2024-12-18","open":130461000,"close":131370750,"high":132339000,"low":129156750},
    {"date":"2024-12-19","open":131370750,"close":130430250,"high":133163250,"low":129343500},
    {"date":"2024-12-20","open":130430250,"close":130321500,"high":133098750,"low":129256500},
    {"date":"2024-12-21","open":130321500,"close":130671000,"high":132795000,"low":128523750},
    {"date":"2024-12-22","open":130671000,"close":128871750,"high":133114500,"low":128307000},
    {"date":"2024-12-23","open":128871750,"close":126805500,"high":130840500,"low":126535500},
    {"date":"2024-12-24","open":126805500,"close":126758250,"high":127761000,"low":124711500},
    {"date":"2024-12-25","open":126758250,"close":127179750,"high":128596500,"low":125655000},
    {"date":"2024-12-26","open":127179750,"close":126171750,"high":130054500,"low":124848000},
    {"date":"2024-12-27","open":126171750,"close":125808000,"high":127566000,"low":125330250},
    {"date":"2024-12-28","open":125808000,"close":126705000,"high":128449500,"low":123894000},
    {"date":"2024-12-29","open":126705000,"close":125584500,"high":128403000,"low":124194000},
    {"date":"2024-12-30","open":125584500,"close":126365250,"high":126665250,"low":122691750},
    {"date":"2024-12-31","open":126365250,"close":127182750,"high":128817000,"low":125432250},
    {"date":"2025-01-01","open":127182750,"close":124393500,"high":128959500,"low":124217250},
    {"date":"2025-01-02","open":124393500,"close":124904250,"high":125277000,"low":121662750},
    {"date":"2025-01-03","open":124904250,"close":126956250,"high":127881750,"low":123149250},
    {"date":"2025-01-04","open":126956250,"close":127512750,"high":129366000,"low":125457000},
    {"date":"2025-01-05","open":127512750,"close":127357500,"high":129165000,"low":125761500},
    {"date":"2025-01-06","open":127357500,"close":127830750,"high":129503250,"low":125771250},
    {"date":"2025-01-07","open":127830750,"close":125946750,"high":129006000,"low":125559750},
    {"date":"2025-01-08","open":125946750,"close":125545500,"high":127008000,"low":124541250},
    {"date":"2025-01-09","open":125545500,"close":127648500,"high":127767000,"low":124437750},
    {"date":"2025-01-10","open":127648500,"close":128378250,"high":130127250,"low":126577500},
    {"date":"2025-01-11","open":128378250,"close":128292750,"high":130742250,"low":126819750},
    {"date":"2025-01-12","open":128292750,"close":127635750,"high":130259250,"low":126588750},
    {"date":"2025-01-13","open":127635750,"close":129813750,"high":130188000,"low":125181750},
    {"date":"2025-01-14","open":129813750,"close":130466250,"high":130911750,"low":127494750},
    {"date":"2025-01-15","open":130466250,"close":131205750,"high":132027750,"low":127917000},
    {"date":"2025-01-16","open":131205750,"close":132279750,"high":132331500,"low":129966750},
    {"date":"2025-01-17","open":132279750,"close":132010500,"high":134218500,"low":130396500},
    {"date":"2025-01-18","open":132010500,"close":132468000,"high":133359750,"low":131159250},
    {"date":"2025-01-19","open":132468000,"close":131770500,"high":133944750,"low":131157000},
    {"date":"2025-01-20","open":131770500,"close":132726000,"high":133263750,"low":129992250},
    {"date":"2025-01-21","open":132726000,"close":132501000,"high":135617250,"low":130374750},
    {"date":"2025-01-22","open":132501000,"close":133711500,"high":135101250,"low":130245750},
    {"date":"2025-01-23","open":133711500,"close":133298250,"high":135469500,"low":131880000},
    {"date":"2025-01-24","open":133298250,"close":134120250,"high":135807000,"low":131479500},
    {"date":"2025-01-25","open":134120250,"close":132948000,"high":136389000,"low":132870000},
    {"date":"2025-01-26","open":132948000,"close":132059250,"high":135884250,"low":131658000},
    {"date":"2025-01-27","open":132059250,"close":133242000,"high":134704500,"low":129711000},
    {"date":"2025-01-28","open":133242000,"close":132627000,"high":135249750,"low":131220750},
    {"date":"2025-01-29","open":132627000,"close":133293000,"high":134794500,"low":130680000},
    {"date":"2025-01-30","open":133293000,"close":135333000,"high":135884250,"low":131223750},
    {"date":"2025-01-31","open":135333000,"close":136122000,"high":137849250,"low":133722750},
    {"date":"2025-02-01","open":136122000,"close":137217750,"high":137766750,"low":133701000},
    {"date":"2025-02-02","open":137217750,"close":136244250,"high":138899250,"low":134572500},
    {"date":"2025-02-03","open":136244250,"close":137663250,"high":137978250,"low":133797000},
    {"date":"2025-02-04","open":137663250,"close":137070000,"high":139914750,"low":135534750},
    {"date":"2025-02-05","open":137070000,"close":139145250,"high":139527750,"low":134513250},
    {"date":"2025-02-06","open":139145250,"close":138531000,"high":141867000,"low":136838250},
    {"date":"2025-02-07","open":138531000,"close":136473000,"high":140597250,"low":135859500},
    {"date":"2025-02-08","open":136473000,"close":135033000,"high":138477750,"low":133597500},
    {"date":"2025-02-09","open":135033000,"close":135026250,"high":138028500,"low":133900500},
    {"date":"2025-02-10","open":135026250,"close":135229500,"high":136948500,"low":133250250},
    {"date":"2025-02-11","open":135229500,"close":136704000,"high":136807500,"low":133566000},
    {"date":"2025-02-12","open":136704000,"close":138480750,"high":138843000,"low":135891000},
    {"date":"2025-02-13","open":138480750,"close":139461000,"high":141473250,"low":136137750},
    {"date":"2025-02-14","open":139461000,"close":138105750,"high":142435500,"low":137376000},
    {"date":"2025-02-15","open":138105750,"close":138044250,"high":139037250,"low":137262000},
    {"date":"2025-02-16","open":138044250,"close":138859500,"high":138932250,"low":135475500},
    {"date":"2025-02-17","open":138859500,"close":137343000,"high":141065250,"low":136938750},
    {"date":"2025-02-18","open":137343000,"close":137745750,"high":139899750,"low":134790750},
    {"date":"2025-02-19","open":137745750,"close":137663250,"high":140518500,"low":135438000}
]

const tempMarker = [
];

export default function CandleChartCell({ coinId, modalOpenFunc }) {

    const isLogin = sessionStorage.getItem("isLogin")
    const [isModalOpen, setModalOpen] = useState(false)

    const rest_api_host = import.meta.env.VITE_REST_API_HOST;
    const rest_api_port = import.meta.env.VITE_REST_API_PORT;

    const generateData = (data) => {
        let result = [];

        data.map((item) => {
            result.push({
                x: new Date(item.date),
                y: [item.open, item.high, item.low, item.close]
            })
        })

        return result;
    };

    const generateMarker = (markers) => {
        const result = []

        markers.map((marker) => {
            result.push({
                x: new Date(marker.date).getTime(),
                y: marker.high,
                image: {
                    path: '/mark.png',
                    width: 25,
                    height: 25,

                },
                marker: {
                    size: 16,
                    //fillColor: 'Black',
                    strokeColor: '#FFFFFF',
                    shape: 'circle',
                },
                issueId: marker.issueId,
                date: marker.date,
                openPrice: marker.open,
                closePrice: marker.close,
                click: function (e) {
                    if (isLogin || e.issueId !== "new") {
                        modalOpenFunc(e);
                    } else {
                        setModalOpen(true);
                        setTimeout(() => {
                            setModalOpen(false);
                        }, 2000)
                    }

                }
            })
        })

        return result;
    }

    const [markers, setMarkers] = useState(generateMarker(tempMarker))
    const [maxLength, setMaxLength] = useState(tempMarker.length);
    const [originalData, setOriginalData] = useState(generateData(tempData))

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            toolbar: {
                show: false, // ✅ 우측 상단 확대/축소 도구 숨기기
            },
            zoom: {
                enabled: true, // ✅ 확대/축소 가능
                type: "x", // ✅ X축 방향으로 확대/축소
                zoomedArea: false,
                allowMouseWheelZoom: true,
                autoScaleYaxis: true,
            },
            events: {
                // ✅ 클릭한 데이터 포인트 가져오기
                markerClick: function (event, chartContext, opts) {
                    const dataPointIndex = opts.dataPointIndex;
                    const clickedX = originalData[dataPointIndex].x

                    const tempDate = new Date(clickedX)
                    const year = tempDate.getFullYear();
                    const month = String(tempDate.getMonth() + 1).padStart(2, '0');
                    const day = String(tempDate.getDate()).padStart(2, '0');
                    const formattedDate = `${year}-${month}-${day}`;

                    let temp = true
                    markers.forEach((marker) => {
                        if (marker.x - 86400000 * 5 <= tempDate.getTime() && marker.x + 86400000 * 5 >= tempDate.getTime()) { temp = false; }
                    })
                    if (temp && markers.length <= maxLength) {
                        setMarkers([...markers, generateMarker([{"date":formattedDate,"open":originalData[dataPointIndex].y[0],
                                                                                "close":originalData[dataPointIndex].y[3],
                                                                                "high":originalData[dataPointIndex].y[1],
                                                                                "low":originalData[dataPointIndex].y[2],
                                                                                "issueId": "new"}])[0]])
                    }
                    else if (temp) {
                        setMarkers([...markers.slice(0, -1), generateMarker([{"date":formattedDate,"open":originalData[dataPointIndex].y[0],
                            "close":originalData[dataPointIndex].y[3],
                            "high":originalData[dataPointIndex].y[1],
                            "low":originalData[dataPointIndex].y[2],
                            "issueId": "new"}])[0]])
                    }

                }
            }
        },
        series: [
            {
                data: originalData,
            },
        ],
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            opposite: true,
            labels: {
                formatter: function (value) {
                    return value.toLocaleString(); // ✅ 3자리마다 쉼표 추가
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#FF5353',
                    downward: '#0080FF'
                }
            }
        },
        annotations: {
            points: markers
        },
    };

    useEffect(() => {
        axios
            .get(`http://${rest_api_host}:${rest_api_port}/api/v1/coins/${coinId}`, {headers: {"Content-Type": "application/json"}})
            .then(res => {
                console.log(res.data)
                let tempChart = []
                res.data.results[0].chartList.slice().reverse().map((item) => {
                    tempChart.push({"date":item.date.slice(0, 10),"open":item.openingPrice,"close":item.tradePrice,"high":item.highPrice,"low":item.lowPrice});
                })
                setOriginalData(generateData(tempChart))


                let tempIssue = []

                res.data.results[0].issueList.map((item) => {
                    tempIssue.push({"date":item.date.slice(0, 10), "open":item.openingPrice,"close":item.tradePrice,"high":item.highPrice,"low":item.lowPrice, "issueId": item.issueId})
                })
                setMarkers(generateMarker(tempIssue))
                setMaxLength(tempIssue.length)

            })
            .catch(err => {

            });
    }, [])

    return (<>
        <div id="chart">
            <Chart options={options} series={options.series} type="candlestick" height={350} />
        </div>
        {(isModalOpen) && <div className="modal-overlay">
            <div className="mini-modal-content">
                로그인 후 이용 가능합니다.
            </div>
        </div>}
    </>);
}
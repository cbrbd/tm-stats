//external
import React, { useEffect, useState, useRef } from "react"
import { useParams} from "react-router-dom";
import { useTranslation } from "react-i18next";

//components
import { LoadingIcon } from "../../Component/UpdateButton/LoadingIcon";
import { COTDLineChart } from "./COTDLineChart";
import { UpdateButton } from "../../Component/UpdateButton/UpdateButton";
import { ErrorMessage } from "../../StyledComponents/General/Error";
import { ContentBody } from "../../StyledComponents/Page/ContentBody";
import {PlayerName} from "../../StyledComponents/General/PlayerName";
import {CellData, Cells, CellTitle, InfoBox } from "./StyledCOTD";

//variables
import { remoteServer } from "../../config";

export function COTDStats(props){
    const [data, setData] = useState(null);
    const [displayname, setDisplayname] = useState('');
    const [accountid, setAccountid] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoad] = useState(true);
    const [showUpdate, setShowUpdate] = useState(false);

    const prevPlayer = useRef();
    const playerNameParam = useParams().player;

    const {t} = useTranslation("cotd");

    function forceUpdate(){
        setLoad(true);
        setData(null);
        setChartData(null);
        const url  = (`${remoteServer}/COTDStats?accountID=${accountid}`).toLowerCase();
        // if(localStorage.getItem(url) !== null){
        //     localStorage.removeItem(url); // remove the current url from localStorage if it is more than 24 hours old (24*60*60*1000 ms)
        // }
            let isSubscribed = true;
            fetch(url + '&forceupdate=true')  
            .then(function(result){
                if(isSubscribed){
                    return(result.json());
                }
            })
            .then((result) => {
                if(isSubscribed){
                    setData(result);
                    buildChartData(result.cotds);            
                    setLoad(false);        
                    // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result}));
                }
            })
            .catch(function(error){
                console.log(error);
            });    
            return () => isSubscribed = false;
        }

    function buildChartData(rawData){
        let lineChartData = [];
        for(let i = 0; i < rawData.length; ++i){
            //dont take type 2 into account
            if(rawData[i].name.includes("#1")){
                let date = new Date(rawData[i].timestamp);  
                let formattedDate = date.getDate() + '/' + (date.getMonth() +1) + '/' + (date.getFullYear());
                lineChartData.push({
                    'name': rawData[i].id, 
                    'div': rawData[i].div, 
                    'divrank': rawData[i].divrank === 0 ? 64 : rawData[i].divrank, 
                    'percent': (Math.floor(100*rawData[i].rank/rawData[i].totalplayers)),
                    'totalplayers': rawData[i].totalplayers,
                    'timestamp': formattedDate
                })
            }
            //case where data is too old and doesnt contain the cotd type (main, rerun)
            if(!rawData[i].name.includes('#')){
                let date = new Date(rawData[i].timestamp);
                let formattedDate = date.getDate() + '/' + (date.getMonth() +1) + '/' + (date.getFullYear());
                lineChartData.push({
                    'name': rawData[i].id, 
                    'div': rawData[i].div, 
                    'divrank': rawData[i].divrank === 0 ? 64 : rawData[i].divrank, 
                    'percent': (Math.floor(100*rawData[i].rank/rawData[i].totalplayers)),
                    'totalplayers': rawData[i].totalplayers,
                    'timestamp': formattedDate
                })
            }
        }
        setChartData(lineChartData.reverse());
        return
    }

    async function findPlayerID(player){
        const url  = (`${remoteServer}/findTrokmoniPlayer?player=${player}`).toLowerCase();
        let result = await fetch(url);
        result = await result.json();
        setDisplayname(result.displayname);
        setAccountid(result.accountid);
        return result.accountid;
        // if(localStorage.getItem(url) !== null){
        //     let cached = JSON.parse(localStorage.getItem(url));
        //     setDisplayname(cached.data.displayname);
        //     setAccountid(cached.data.accountid);
        //     return cached.data.accountid;

        // } else {
            // fetch(url)
            // .then(function(result){
            //     return result.json();
            // })
            // .then(function(result){
            //     setDisplayname(result.displayname);
            //     setAccountid(result.accountid);
            //     // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result}));

            //     return result.accountid;
            // })
        
        // }
    }


    useEffect(() => {
        let isSubscribed = true;
        async function processData(){
            const id = await findPlayerID(playerNameParam);
            if(prevPlayer.current !== playerNameParam){
                setLoad(true);
                setData(null);
                setChartData(null);
    
                const url  = (`${remoteServer}/COTDStats?accountID=${id}`).toLowerCase();
                try {
                    let result = await fetch(url);
                    result = await result.json();
                    if(isSubscribed){
                        if(!result){
                            setData(null);
                            setLoad(false);
                            return;
                        }
                        setData(result);
                        buildChartData(result.cotds);            
                        setLoad(false);        
                        // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result}));
                     }
                    
                } catch (error) {
                    setData({message: 'An error occured, server might be offline'}); //set message in case catch is called
                    setLoad(false);
                    console.log(error);
                    
                }   
    
                
                prevPlayer.current = playerNameParam;
            }
        }
        processData();
    
        return () => isSubscribed = false;
    }, [playerNameParam]);
    

    return(
        <ContentBody>
            <div>
                {loading && !data && (
                    <LoadingIcon/>
                )}
                {!data && !loading && (
                    <ErrorMessage>{t("No data")}</ErrorMessage>
                )}
                {data && data.message && (
                    <ErrorMessage>{data.message}</ErrorMessage>
                )}
            </div>
            {data && !data.message && (
                <React.Fragment>
                    <PlayerName
                        onMouseEnter={()=>setShowUpdate(true)} 
                        onMouseLeave={()=>setShowUpdate(false)}
                    >
                        {displayname} 
                        <UpdateButton show={showUpdate} onClick={forceUpdate}/>
                    </PlayerName>
                    <InfoBox>
                        {data !== null && (
                            <Cells>
                                <div>
                                    <CellTitle>{t("Total Cup")}</CellTitle> 
                                    <CellData>{data.total}</CellData>
                                </div>
                                <div>
                                    <CellTitle> {t("Average div")} </CellTitle>
                                    <CellData>{(Math.round(data.stats.avgdiv * 100) / 100).toFixed(2)}</CellData>
                                </div>
                                <div>
                                    <CellTitle> {t("Best pos")} </CellTitle>
                                    <CellData>{data.stats.bestoverall.bestrank}</CellData>
                                </div>
                            </Cells>
                    )}
                    </InfoBox>
                    <div>
                        {chartData !== null && chartData.length!==0 && (
                            <COTDLineChart data={chartData}/>
                        )}
                     </div>
                </React.Fragment>
            )}
            
            
        </ContentBody>
        
    )
}
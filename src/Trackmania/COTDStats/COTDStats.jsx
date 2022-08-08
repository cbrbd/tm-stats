//external
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

//components
import { LoadingIcon } from "../../Component/UpdateButton/LoadingIcon";
import { COTDLineChart } from "./COTDLineChart";
import { ErrorMessage } from "../../StyledComponents/General/Error";
import { ContentBody } from "../../StyledComponents/Page/ContentBody";
import {PlayerName} from "../../StyledComponents/General/PlayerName";
import {CellData, Cells, CellTitle, InfoBox } from "./StyledCOTD";

//variables
import { useContext } from "react";
import { PlayerContext } from "../Trackmania";

export function COTDStats(){
    
    const [chartData, setChartData] = useState(null);
    const data = useContext(PlayerContext).cotdData;
    const generalData = useContext(PlayerContext).generalData;
    const loading = useContext(PlayerContext).loading.cotd;


    const {t} = useTranslation("cotd");

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

    useEffect(()=>{
        if(data && data.cotds){
            buildChartData(data.cotds)
        }
    }, [data])

    
    return(
        <ContentBody>
            <div>
                {loading && (
                    <LoadingIcon/>
                )}
                {!data &&!loading && (
                    <ErrorMessage>{t("No data")}</ErrorMessage>
                )}
                {data && data.message && (
                    <ErrorMessage>{data.message}</ErrorMessage>
                )}
            </div>
            {data && !data.message && (
                <React.Fragment>
                    <PlayerName
                    >
                        {generalData && generalData.displayname}
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
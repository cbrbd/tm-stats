//external
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//components
import { GeneralPlayerInfo } from "./GeneralPlayerInfo";
import { PlayerRank } from "./PlayerRank";
import { TrophyDistribution } from "./TrophyDistribution";
import { UpdateButton } from "../../Component/UpdateButton/UpdateButton";
import { LoadingIcon } from "../../Component/UpdateButton/LoadingIcon";
import { ErrorMessage } from "../../StyledComponents/General/Error";
import { ContentBody } from "../../StyledComponents/Page/ContentBody";
import {PlayerName} from '../../StyledComponents/General/PlayerName'
import {Section, SectionTitle} from '../../StyledComponents/General/Section'

//variables
import { remoteServer } from "../../config";

export function GeneralStats(){

    const [load, setLoad] = useState(false);
    const [data, setData] = useState(null);
    const [regions, setRegions] = useState(null);
    

    let [showUpdate, setShowUpdate] = useState(false);
    let playerNameParam = useParams().player;
    const prevPlayer = useRef();
    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const {t, i18n} = useTranslation('generalInfo');


    function findPlayerRegions(zone){
        let zoneName = zone.name;
        let zoneList = [zone]
        while(zoneName !== 'World'){
            zone = zone.parent;
            zoneName = zone.name;
            zoneList.push(zone)
        }
        setRegions (zoneList);
    }

    function forceUpdate(){
        //keep the original url for interaction with the local storage
        const url  = (`${remoteServer}/findTrokmoniPlayer?player=${data.displayname}`).toLowerCase();
        //reset previous search: data = null, loading = true
        setLoad(true); 
        setData(null);
        setRegions(null);

        //if the item exists, remove it as it will be updated
        // if(localStorage.getItem(url) !== null){ 
        //     localStorage.removeItem(url); 
        // }
        
        //whatever happens, fetch the original url with argument forceupdate = true
        let isSubscribed = true;
        fetch(url + '&forceupdate=true')
        .then(function(result){
            if(isSubscribed){
                return result.json();
            }
        })
        .then(function(result){
            if(isSubscribed){
                setData(result);
                findPlayerRegions(result.trophies.zone);
                setLoad(false);
                // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result})); //set the result to the locaslstorage
            }
            
        })
        .catch(function(error){
            setData({message: 'An error occured, server might be offline'}); //set message in case catch is called
            setLoad(false);
            console.log(error);
        })
        return() => isSubscribed = false;
    }


    useEffect(()=>{
        if(prevPlayer.current !== playerNameParam){
            setLoad(true);
            setData(null);
            setRegions(null);
            const url  = (`${remoteServer}/findTrokmoniPlayer?player=${playerNameParam}`).toLowerCase();

            // if(localStorage.getItem(url) !== null){ 
            //     let cached = JSON.parse(localStorage.getItem(url));
            //     let timestamp = new Date(cached.timestamp).getTime();
            //     let now = new Date().getTime();
            //     if(timestamp + 12*60*60*1000 < now){
            //         localStorage.removeItem(url); //ditch the stored value if it is more than 12 hours old
            //     } else {                          //Otherwise, if the player is found and data is less than 12 hours old, set data in the state
            //         setData(cached.data);
            //         findPlayerRegions(cached.data.trophies.zone);
            //         setLoad(false);
            //         return;
            //     }
            // }
            let isSubscribed = true;
            fetch(url)
            .then(function(result){
                if(isSubscribed){
                    return result.json();
                }
            })
            .then(function(result){
                if(isSubscribed){
                    if(result.length){ //If the length of result is defined, we're in the case of a list of player
                        navigate('/');
                        setLoad(false);
                        return; //exit the function
                    }
                    //otherwise, set the data state with fetched data. It can be player details or a message
                    setData(result);
                    if(result.trophies){ //only try to process the regions if result isnt just an error message
                        findPlayerRegions(result.trophies.zone);
                    }
                    setLoad(false);
                    if(!result.displayname){
                        navigate('/');
                    }
                    // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result})); //set the result to the locaslstorage
                }
            })
            .catch(function(error){
                setData({message: 'An error occured, server might be offline'}); //set message in case catch is called
                navigate('/');
                console.log(error);
            })
            prevPlayer.current = playerNameParam;
            return () => isSubscribed = false;
        }
    }, [playerNameParam, navigate])


    return(
        <ContentBody>
                    {load && (
                        <LoadingIcon/>
                    )}
                    {data && data.message &&(
                        <ErrorMessage>{data.message}</ErrorMessage>
                    )}
                    {data && !load && regions && (
                        <div>
                            <PlayerName 
                                onMouseEnter={()=>setShowUpdate(true)} 
                                onMouseLeave={()=>setShowUpdate(false)}
                            >
                                {data.displayname} 
                                <UpdateButton show={showUpdate} onClick={forceUpdate}/>
                            </PlayerName>
                            
                            <Section>
                                <SectionTitle>{t("General")}</SectionTitle>
                                <GeneralPlayerInfo data={data} regions={regions}/>
                            </Section>

                            <Section>
                                <SectionTitle>{t('Rank')}</SectionTitle>
                                <PlayerRank data={data} regions={regions}/>
                            </Section>

                            <Section>
                                <SectionTitle>{t("Trophy Distribution")}</SectionTitle>
                                <TrophyDistribution data={data}/>
                            </Section>
                            
                        </div>
                    )}
        </ContentBody>
    )
}
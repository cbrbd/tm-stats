//external
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//components
import { MainMM } from "./MainMM";
import { Royal } from "./Royal";
import { LoadingIcon } from "../../Component/UpdateButton/LoadingIcon";
import { ErrorMessage } from "../../StyledComponents/General/Error";
import { ContentBody } from "../../StyledComponents/Page/ContentBody";
import { PlayerName } from "../../StyledComponents/General/PlayerName";
import { Section, SectionTitle } from "../../StyledComponents/General/Section";
import { UpdateButton } from "../../Component/UpdateButton/UpdateButton";

//variables
import { remoteServer } from "../../config";

export function Matchmaking(){
    const [showUpdate, setShowUpdate] = useState(false);

    const [data, setData] = useState(null);
    const [load, setLoad]  = useState(true);
    const playerNameParam = useParams().player;
    const prevPlayer = useRef();
    const navigate = useNavigate();
    const {t} = useTranslation("matchmaking")

    function forceUpdate(){
        //keep the original url for interaction with the local storage
        const url  = (`${remoteServer}/findTrokmoniPlayer?player=${data.displayname}`).toLowerCase();
        //reset previous search: data = null, loading = true
        setLoad(true); 
        setData(null);
        
        //if the item exists, remove it as it will be updated
        // if(localStorage.getItem(url) !== null){ 
        //     localStorage.removeItem(url); 
        // }
        
        //whatever happens, fetch the original url with argument forceupdate = true
        fetch(url + '&forceupdate=true')
        .then(function(result){
            return result.json();
        })
        .then(function(result){
            setData(result);
            setLoad(false);
            // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result})); //set the result to the locaslstorage
        })
        .catch(function(error){
            setData({message: 'An error occured, server might be offline'}); //set message in case catch is called*
            setLoad(false);
            console.log(error);
        })
    
    }

    useEffect(()=>{
        let isSubscribed = true;
        if(prevPlayer.current !== playerNameParam){
            
            setLoad(true);
            setData(null);
            const url  = (`${remoteServer}/findTrokmoniPlayer?player=${playerNameParam}`).toLowerCase();

            // if(localStorage.getItem(url) !== null){ 
            //     let cached = JSON.parse(localStorage.getItem(url));
            //     let timestamp = new Date(cached.timestamp).getTime();
            //     let now = new Date().getTime();
            //     if(timestamp + 12*60*60*1000 < now){
            //         localStorage.removeItem(url); //ditch the stored value if it is more than 12 hours old
            //     } else {                          //Otherwise, if the player is found and data is less than 12 hours old, set data in the state
            //         setData(cached.data);
            //         setLoad(false);
            //         return;
            //     }
    
            //     //If nothing is found in the localstorage for the requested player, send a fetch request to the backend server
            // }
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
        }
        return() => isSubscribed = false;
    }, [playerNameParam, navigate])

    if(!load && !data.matchmaking[0] && !data.matchmaking[1]){
        return(
            <ContentBody>
                <ErrorMessage>{t("No data")}</ErrorMessage>
            </ContentBody>   
        )
    }

    if(data && data.message){
        return(
            <ContentBody>
                <ErrorMessage>{data.message}</ErrorMessage>
            </ContentBody>
        )
    }

    return(
        <ContentBody>
            <PlayerName
                onMouseEnter={()=>setShowUpdate(true)} 
                onMouseLeave={()=>setShowUpdate(false)}
            >
                {data && data.displayname} 
                <UpdateButton show={showUpdate} onClick={forceUpdate}/>
            </PlayerName>
            {load && !data &&(
                <LoadingIcon/>
            )}
            {data && data.matchmaking[0] && (
                <Section>
                    <SectionTitle>{t("3v3 section title")}</SectionTitle>
                    <MainMM data={data.matchmaking[0]}/>
                </Section>
            )}
            
            {data && data.matchmaking[1] && (
                <Section>
                    <SectionTitle>{t("Royal section title")}</SectionTitle>
                    <Royal data={data.matchmaking[1]}/>
                </Section>
            )}
            
        </ContentBody>
    )
}
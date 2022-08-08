//external
import { useEffect, useState } from "react"
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

//components
import { MenuList } from "./MenuList";
import { PlayerList } from "./GeneralStats/PlayerList";
import { StyledTextInput } from "../StyledComponents/Input/StyledTextInput";
import { StyledButton } from "../StyledComponents/Input/StyledButton";
import { ContentHeader } from "../StyledComponents/Page/ContentHeader";
import { ContentBody } from "../StyledComponents/Page/ContentBody";
import { Content } from "../StyledComponents/Page/Content";
import { ErrorMessage } from "../StyledComponents/General/Error";

//variables
import { remoteServer } from "../config";

//functions
import useWindowDimensions from "../WindowDimensions";
import { createContext } from "react";


const StyledForm = styled.form`
    display: flex;
    justify-content: center;
    background-color: transparent;
    padding-top: 3rem;
    padding-bottom: 3rem;
    height: ${(props) => props.player ? "3rem" : "5rem"};
    margin-top: ${(props)=> props.player ?  "0" : "25vh"};
    font-size: ${(props)=> props.player ? "1rem" : "1.5rem"};
    transition-property: height, margin-top;
    transition-duration: 0.6s;
`
export const PlayerContext = createContext();

export function Trackmania(props){

    let [textInput, setTextInput] = useState("");
    let [player, setPlayer] = useState("");
    let [data, setData] = useState(null);
    const [COTD, setCOTD]= useState(null);
    let [isGeneralLoading, setIsGeneralLoading] = useState(false);
    const [isCotdLoading, setIsCotdLoading] = useState(false);
    let [playerList, setPlayerList] = useState(null);
    let [menu, setMenu] = useState('General');
    let ParamPlayer = useParams().player;

    let location = useLocation().pathname;
    const navigate = useNavigate();

    function selectMenu(newMenu){
        setMenu(newMenu);
    }

    // eslint-disable-next-line no-unused-vars
    const {t, i18n} = useTranslation('trackmania');


    function navigateToPlayer(player){
        let loc = 'General';
        if(location.includes('/player')){
            let splitted = location.split('/'); //parse url and take last argument to navigate there later
            loc = splitted[splitted.length -1]
        }
        navigate(`/player/${player}/${loc}`)
    }

    
    useEffect(()=>{
    
        let isSubscribed = true; //used for cleanup

        if(!ParamPlayer || ParamPlayer === "undefined"){
            return;
        }

        async function fetchPlayerData(){
            let url  = (`${remoteServer}/findTrokmoniPlayer?player=${ParamPlayer}`).toLowerCase();

            //reset the state before fetching data from the server
            setIsGeneralLoading(true);
            setIsCotdLoading(true); 
            setData(null);
            setCOTD(null);
            setPlayerList(null);

            try{
                let result = null;
                if(isSubscribed){
                    //fetch general stats
                    result = await fetch(url);
                    result = await result.json();
                }

                //if result.lenght is defined, result is a player list
                if(isSubscribed && result && result.length){ 
                    setPlayerList(result);
                    setIsCotdLoading(false);
                    setIsGeneralLoading(false);
                    navigate('/'); //if result is a playerlist, reset navigation to root
                    return;


                } else if(isSubscribed){
                    setData(result);
                    setIsGeneralLoading(false);
                }
                
                if(isSubscribed){
                    url  = (`${remoteServer}/COTDStats?accountID=${result.accountid}`).toLowerCase();
                    result = await fetch(url);
                    result = await result.json()
                    setCOTD(result);
                    setIsCotdLoading(false);
                }
            
            } catch(error){
                setData({message: 'An error occured, server might be offline'}); //set message in case catch is called
                setIsCotdLoading(false);
                setIsGeneralLoading(false);
            }
        
        }
    
        fetchPlayerData(isSubscribed);

        //cleanup function
        return () =>isSubscribed = false;

    }, [ParamPlayer, location, navigate])



    //function called on button click.
    function handleSubmit(e){
        e.preventDefault();
        props.changeTitle('small');
        setPlayer(textInput);
        navigateToPlayer(textInput);
    }



    const {width} = useWindowDimensions();
    let buttonText = <span><FontAwesomeIcon icon={faMagnifyingGlass}/> {t('Submit')}</span>
    if(width < 1024){
        buttonText = <FontAwesomeIcon icon={faMagnifyingGlass}/>
    } 

    const menus = ['General', 'COTD', 'Matchmaking'];

    return(
        <PlayerContext.Provider style={{display:"block", border: "1px solid lime"}} value={{generalData: data, cotdData: COTD, loading: {general: isGeneralLoading, cotd: isCotdLoading}}}>
            <div>

            
            <StyledForm player = {player||ParamPlayer}
                className={player || ParamPlayer ? "input-group-small" : "input-group-big"}
            >
                <StyledTextInput
                    type="text" 
                    placeholder={t('Search player')} 
                    value={textInput} 
                    onChange={(e)=>{setTextInput(e.target.value)}}
                />
                <StyledButton
                    type="submit" onClick={handleSubmit} 
                    disabled={textInput.length < 4 ? true : false}
                >
                    {buttonText}    
                </StyledButton>
            </StyledForm>
        
            
            <Content>
                <ContentHeader>
                    {ParamPlayer && (data) && (
                        <MenuList playername={(data && data.displayname) || ParamPlayer} menus={menus} handleClick={selectMenu} selected={menu}/>
                    )}
                </ContentHeader>
                
                
                {(playerList || (data && data.message)) && (
                    <ContentBody>

                    {playerList && (
                        <div>
                            <div>{t('No exact match')} <strong>{player}</strong> {t('one of the following')}</div>
                            {/* <div>No exact match for player <strong>{player}</strong>, is it one of the following ?</div> */}
                            <PlayerList data={playerList} onClick={navigateToPlayer}/>
                        </div>
                    )}
            
                    {data && data.message &&(
                        <ErrorMessage>{data.message}</ErrorMessage>
                    )}
                    
                </ContentBody>
                
                )}
                
                
                <Outlet/>
            </Content>
                
            </div>
        </PlayerContext.Provider> 
    )
}
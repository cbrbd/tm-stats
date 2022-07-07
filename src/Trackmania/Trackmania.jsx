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
import { LoadingIcon } from "../Component/UpdateButton/LoadingIcon";
import { ContentHeader } from "../StyledComponents/Page/ContentHeader";
import { ContentBody } from "../StyledComponents/Page/ContentBody";
import { Content } from "../StyledComponents/Page/Content";
import { ErrorMessage } from "../StyledComponents/General/Error";

//variables
import { remoteServer } from "../config";

//functions
import useWindowDimensions from "../WindowDimensions";


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


export function Trackmania(props){

    let [textInput, setTextInput] = useState("");
    let [player, setPlayer] = useState("");
    let [data, setData] = useState(null);
    let [loading, setLoading] = useState(false);
    let [playerList, setPlayerList] = useState(null);
    let [menu, setMenu] = useState('General');
    let ParamPlayer = useParams().player;

    let location = useLocation().pathname;
    let [prevLoc, setPrevLoc] = useState('/')

    const navigate = useNavigate();

    function selectMenu(newMenu){
        setMenu(newMenu);
    }

    // eslint-disable-next-line no-unused-vars
    const {t, i18n} = useTranslation('trackmania');

    useEffect(()=> {
        if(location !== prevLoc){
            if(location !== '/' || player || ParamPlayer){
                props.changeTitle('small');
            } else {
                props.changeTitle('big')
            }
            setPrevLoc(location);
        } 
    }, [ParamPlayer, player, location, prevLoc, props])

    //function called on click of a player in player list
    function playerSelect(player){
        findTrokmoniPlayer(player);
        setPlayer(player);
        setTextInput(player);
    }


    //state change on input
    function updateTextInput(e){
        setTextInput(e.target.value);
    }

    //function called to update the general info and ignore the 12 hours cache life
    


    //function that finds a player by its name by fetching or checking localstorage
    //only takes player name as argumnt
    //is called by handleSubmit and playerSelect
    function findTrokmoniPlayer(player){
        const url  = (`${remoteServer}/findTrokmoniPlayer?player=${player}`).toLowerCase();
        
        //location used to keep trace of where user is (general, cotd, matchmaking) default is general
        let loc = 'General';
        if(location.includes('/player')){
            let splitted = location.split('/'); //parse url and take last argument to navigate there later
            loc = splitted[splitted.length -1]
        }

        //when called, go back to '/', and set state accordingly
        navigate('/');
        setLoading(true); 
        setData(null);
        setPlayerList(null);

        //First, check the local storage for the requested url
        // if(localStorage.getItem(url) !== null){ //
        //     let cached = JSON.parse(localStorage.getItem(url));
        //     let timestamp = new Date(cached.timestamp).getTime();
        //     let now = new Date().getTime();
        //     if(timestamp + 12*60*60*1000 < now){
        //         localStorage.removeItem(url); //ditch the stored value if it is more than 12 hours old
        //     } else {                          //Otherwise, if the player is found and data is less than 12 hours old, set data in the state
        //         setData(cached.data);
        //         navigate(`player/${cached.data.displayname}/${loc}`);
        //         setLoading(false);
        //         return;
        //     }

        //     //If nothing is found in the localstorage for the requested player, send a fetch request to the backend server
        // }
        fetch(url)
        .then(function(result){
            return result.json();
        })
        .then(function(result){
            if(result.length){ //If the length of result is defined, we're in the case of a list of player
                navigate('/');
                setPlayerList(result);
                setLoading(false);
                return; //exit the function
            }
            //otherwise, set the data state with fetched data. It can be player details or a message
            setData(result);
            setLoading(false);
            navigate(`player/${result.displayname}/${loc}`);
            if(!result.displayname){
                navigate('/');
            }
            // localStorage.setItem(url, JSON.stringify({timestamp: new Date(), data: result})); //set the result to the locaslstorage
        })
        .catch(function(error){
            setData({message: 'An error occured, server might be offline'}); //set message in case catch is called
            setLoading(false);
            navigate('/');
            console.log(error);
        })
    

    
    }

    //function called on button click.
    //set the player to current textInput, and call the findTrokmoniPlayer function
    function handleSubmit(e){
        e.preventDefault();
        props.changeTitle('small');
        setLoading(true);
        setPlayer(textInput);
        findTrokmoniPlayer(textInput);
    }


    const {width} = useWindowDimensions();
    let buttonText = <span><FontAwesomeIcon icon={faMagnifyingGlass}/> {t('Submit')}</span>
    if(width < 1024){
        buttonText = <FontAwesomeIcon icon={faMagnifyingGlass}/>
    } 

    const menus = ['General', 'COTD', 'Matchmaking'];

    return(
        <div>
            <StyledForm player = {player||ParamPlayer}
                className={player || ParamPlayer ? "input-group-small" : "input-group-big"}
            >
                <StyledTextInput
                    type="text" 
                    placeholder={t('Search player')} 
                    value={textInput} 
                    onChange={updateTextInput}
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
                    {ParamPlayer && !(data && data.message) && (
                        <MenuList playername={(data && data.displayname) || ParamPlayer} menus={menus} handleClick={selectMenu} selected={menu}/>
                    )}
                </ContentHeader>
                     
                
                {(loading || playerList || (data && data.message)) && (
                    <ContentBody>

                    {playerList && (
                        <div>
                            <div>{t('No exact match')} <strong>{player}</strong> {t('one of the following')}</div>
                            {/* <div>No exact match for player <strong>{player}</strong>, is it one of the following ?</div> */}
                            <PlayerList data={playerList} onClick={playerSelect}/>
                        </div>
                    )}

                    {loading && (
                        <LoadingIcon/>
                    )}
            
                    {data && data.message &&(
                        <ErrorMessage>{data.message}</ErrorMessage>
                    )}
                    
                </ContentBody>
                
                )}
                
                
                <Outlet/>
            </Content>
                
        </div> 
    )
}
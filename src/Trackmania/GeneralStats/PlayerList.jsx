//external
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//function
import { formatRank } from "../../functions/formatRank";

const Flag = styled.img`
    width: 1rem;
    outline: 1px solid #000000;
`

const PlayerTable = styled.table`
    text-align: center;
    width: 100%;
    padding: 1rem;

    >tr{
        height: 2rem;
    }

    >tbody tr:nth-child(2n+1) {
        background-color: ${(props)=>props.theme.table.odd};
    }

    >tbody tr:hover{
        background-color: #007bff;
        color: white;
        cursor: pointer;
        text-decoration: underline;
    }

    @media screen and (max-width: 1024px){
        padding: 0.1rem;
    }
`


function findPlayerCountryCode(zone){
    let zoneName = zone.name;
    let zoneList = [zone]
    while(zoneName !== 'World'){
        zone = zone.parent;
        zoneName = zone.name;
        zoneList.push(zone)
    }
    if(zoneList[zoneList.length -3] !== undefined){
        return (zoneList[zoneList.length -3].flag).toLowerCase();
    } else {
        return (zoneList[zoneList.length-1].flag).toLowerCase();
    }   
}

function Player(props){
    const data = props.data;
    const {t} = useTranslation("suffix");
    function handleClick(){
        props.onClick(data.player.name);
    }

    function handleKey(e){
        if(e.key === "Enter"){
            props.onClick(data.player.name);
        }
    }

    return(
        <tr tabIndex="0" onClick={handleClick} onKeyDown={handleKey}>
            <td>
            {data.player.zone !== undefined && (
                <Flag
                    src={`${process.env.PUBLIC_URL}/img/flag/4x3/${findPlayerCountryCode(data.player.zone)}.svg`}
                    title={findPlayerCountryCode(data.player.zone)}
                    alt={findPlayerCountryCode(data.player.zone)}
                />
            )}
            
            </td>
            <td>
                {data.player.name}
            </td>
            <td>
                {data.matchmaking[0] !== undefined && (
                    <span>{data.matchmaking[0].rank}{t(formatRank(data.matchmaking[0].rank))}</span>
                )}
            </td>
            <td>
                {data.matchmaking[1] !== undefined && (
                    <span>{data.matchmaking[1].rank}{t(formatRank(data.matchmaking[1].rank))}</span>
                )}
                
            </td>
        </tr>
        
    )
}


export function PlayerList(props){
    const players = props.data;

    // eslint-disable-next-line no-unused-vars
    const {t, i18n} = useTranslation('playerlist');


    function handleClick(player){
        props.onClick(player)
    }

    return(
        <React.Fragment>
            <PlayerTable>
                <thead>
                    <tr>
                        <th></th>
                        <th>{t('Player')}</th>
                        <th>{t('Matchmaking')}</th>
                        <th>{t('Royal')}</th>
                    </tr>
                </thead>
                <tbody>
                    
                {players.map(function(player, index){
                    return(
                        <Player key={player.player.name} data={player} onClick={handleClick}/>
                    )
                })}    
                </tbody>
            </PlayerTable>

        </React.Fragment>
    )
}
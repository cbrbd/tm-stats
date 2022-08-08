//external
import { useTranslation } from "react-i18next";

//components
import { MainMM } from "./MainMM";
import { Royal } from "./Royal";
import { LoadingIcon } from "../../Component/UpdateButton/LoadingIcon";
import { ErrorMessage } from "../../StyledComponents/General/Error";
import { ContentBody } from "../../StyledComponents/Page/ContentBody";
import { PlayerName } from "../../StyledComponents/General/PlayerName";
import { Section, SectionTitle } from "../../StyledComponents/General/Section";

//variables
import { useContext } from "react";
import { PlayerContext } from "../Trackmania";

export function Matchmaking(){
    const {t} = useTranslation("matchmaking")

    const data = useContext(PlayerContext).generalData;
    const loading = useContext(PlayerContext).loading.general;

    if(data && !data.matchmaking[0] && !data.matchmaking[1]){
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
            <PlayerName>
                {data && data.displayname} 
            </PlayerName>
            {loading &&(
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
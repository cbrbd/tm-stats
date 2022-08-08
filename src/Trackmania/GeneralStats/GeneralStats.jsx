//external
import { useEffect, useState  } from "react";
import { useTranslation } from "react-i18next";

//components
import { GeneralPlayerInfo } from "./GeneralPlayerInfo";
import { PlayerRank } from "./PlayerRank";
import { TrophyDistribution } from "./TrophyDistribution";
import { ErrorMessage } from "../../StyledComponents/General/Error";
import { ContentBody } from "../../StyledComponents/Page/ContentBody";
import {PlayerName} from '../../StyledComponents/General/PlayerName'
import {Section, SectionTitle} from '../../StyledComponents/General/Section'

//variables
import { useContext } from "react";
import { PlayerContext } from "../Trackmania";
import { LoadingIcon } from "../../Component/UpdateButton/LoadingIcon";

export function GeneralStats(){

    const [regions, setRegions] = useState(null);


    const context = useContext(PlayerContext);

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

    useEffect(()=>{
        if(context && context.generalData && context.generalData.trophies){
            findPlayerRegions(context.generalData.trophies.zone)
        }
    }, [context])


    return(
        <ContentBody>
            {context.loading.general && (
                <LoadingIcon/>
            )}
            {context.generalData && context.generalData.message &&(
                <ErrorMessage>{context.generalData.message}</ErrorMessage>
            )}
            {context.generalData && regions && (
                <div>
                    <PlayerName 
                    >
                        {context.generalData.displayname} 
                    </PlayerName>
                    
                    <Section>
                        <SectionTitle>{t("General")}</SectionTitle>
                        <GeneralPlayerInfo data={context.generalData} regions={regions}/>
                    </Section>

                    <Section>
                        <SectionTitle>{t('Rank')}</SectionTitle>
                        <PlayerRank data={context.generalData} regions={regions}/>
                    </Section>

                    <Section>
                        <SectionTitle>{t("Trophy Distribution")}</SectionTitle>
                        <TrophyDistribution data={context.generalData}/>
                    </Section>
                    
                </div>
            )}
        </ContentBody>
    )
}
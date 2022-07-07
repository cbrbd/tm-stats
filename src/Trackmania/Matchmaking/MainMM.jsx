//external
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

//Components
import { MatchmakingStats, RankImage, Details, RankText, Rank } from "./StyledMatchmaking";

//functions
import { formatNumber } from "../../functions/formatNumber";
import { formatRank } from "../../functions/formatRank";
import { computePercentage } from "../../functions/computePercentage";



export function MainMM(props){
    const data = props.data;

    const {t} = useTranslation(["matchmaking", "suffix"])

    const ranks = [
        'Unranked', 
        'Bronze I', 
        'Bronze II', 
        'Bronze III', 
        'Silver I', 
        'Silver II', 
        'Silver III', 
        'Gold I', 
        'Gold II', 
        'Gold III', 
        'Master I', 
        'Master II', 
        'Master III', 
        'TrackMaster'
    ];

    const rank = useMemo(function(){
        let number = data.info.rank;
        let suffix = t("suffix:" + formatRank(data.info.rank));
        return number + suffix
    }, [data.info.rank,t])



    return(
        <MatchmakingStats>
            <Rank>
                <RankImage
                    alt={ranks[data.info.division.position]}
                    title={ranks[data.info.division.position]}
                    src={process.env.PUBLIC_URL + '/img/mmrank/' + data.info.division.position + '.png'}
                />
                <RankText>{ranks[data.info.division.position]}</RankText>
            </Rank>

            <Details>
                <div>{t("Rank", {rank: rank, top: computePercentage(data.info.rank, data.total) })}</div>
                <div>{t("Total players", {totalplayers: formatNumber(data.total)})}</div>
                <div>{t("MMR", {points: formatNumber(data.info.progression)})}</div>
                {data.info.division_next && (
                    <div>{t("Next rank MM", {rank: ranks[data.info.division.position +1], points: data.info.division_next.minpoints - data.info.progression})} </div>
                )}
                
            </Details>
            
        </MatchmakingStats>
    )
}
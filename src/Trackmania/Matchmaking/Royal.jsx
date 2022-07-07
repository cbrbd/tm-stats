//external
import { useTranslation } from "react-i18next";

//Components
import { MatchmakingStats, RankImage, Details, RankText, Rank } from "./StyledMatchmaking";

//functions
import { formatNumber } from "../../functions/formatNumber";
import { formatRank } from "../../functions/formatRank";
import { computePercentage } from "../../functions/computePercentage";


export function Royal(props){
    const data = props.data;

    const {t} = useTranslation(["matchmaking", "suffix"]);

    const ranks = [
        'Unranked', 
        'Bronze', 
        'Silver', 
        'Gold', 
        'Master', 
        'Royal Master'
    ];


    return(
        <MatchmakingStats>
            <Rank>
                <RankImage
                    alt={ranks[data.info.division.position -1]}
                    title={ranks[data.info.division.position -1]}
                    src={process.env.PUBLIC_URL + '/img/royalrank/' + data.info.division.position + '.png'}
                />
                <RankText>{ranks[data.info.division.position -1]}</RankText>
            </Rank>

            <Details>
                <div>{t("Rank", {rank: data.info.rank + t("suffix:" + formatRank(data.info.rank)), top: computePercentage(data.info.rank, data.total) })}</div>
                <div>{t("Total players", {totalplayers: formatNumber(data.total)})}</div>
                <div>{t("Wins", {wins: formatNumber(data.info.progression)})}</div>
                {data.info.division_next && (
                    <div>{t("Next rank Royal", {rank: ranks[data.info.division.position], points: data.info.division_next.minwins - data.info.progression})} </div>
                )}
                
            </Details>
            
        </MatchmakingStats>
    )
}
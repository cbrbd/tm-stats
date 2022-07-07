//external
import { useTranslation } from "react-i18next";
import styled from "styled-components";

//functions
import { formatRank } from "../../functions/formatRank";



const Flag = styled.img`
    width: 2rem;
    height: 1rem;
`

const Echelon = styled.img`
    max-width: 4rem;
    max-height: 4rem;
    @media screen and (max-width: 1024px) {
        display: none
    }
`

const Rank = styled.div`
    display: flex;
    justify-content: space-around;
`

export function PlayerRank(props){
    const data = props.data;
    const regions = props.regions;
    const {t} = useTranslation('suffix');

    return(
        <Rank>
            <table>
                <tbody>
                    {regions.map(function(region, index){
                        let imgsrc = index === regions.length - 3 ? process.env.PUBLIC_URL + "/img/flag/4x3/" + region.flag.toLowerCase() + ".svg" : "https://trackmania.io/img/flags/" + region.flag + ".jpg"
                        return(
                            <tr key={"rank-" + region.name}>
                                <td>
                                    <Flag
                                        title={region.name}
                                        alt={"flag-" + region.flag} 
                                        src={imgsrc}
                                    />
                                </td>
                                <td>{region.name}</td>
                                <td style={{paddingLeft: '1rem'}}>
                                     {data.trophies.zonepositions[index]}{t(formatRank(data.trophies.zonepositions[index]))}
                                </td>
                            </tr>

                        );
                    })}
                </tbody>
            </table>
            
            <Echelon         
                title={"echelon-" + data.trophies.echelon}
                alt={"echelon-" + data.trophies.echelon}
                src={process.env.PUBLIC_URL + '/img/echelon/' + data.trophies.echelon + '.png'}
            />
        </Rank>
    )
}
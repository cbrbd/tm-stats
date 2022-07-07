//external
import styled from "styled-components";

//components
import { TrophyPieChart } from "./TrophyPieChart";

//functions
import { formatNumber } from "../../functions/formatNumber";


const StyledTrophy = styled.img`
    width: 3rem;
    @media screen and (max-width: 1024px){
        width: 2rem;
    }
`

const StyledTrophyTable = styled.table`
    width: 100%;
    padding-bottom: 2rem;
    >td{
        padding-right: 1rem;
    }
`

const StyledTrophyDistrib = styled.div`
    display: flex;
    justify-content: space-around;
    @media screen and (max-width: 1024px){
        flex-direction: column;
    }
`

export function TrophyDistribution(props){
    
    const data = props.data;


    function computePercentage(partial, type, total){
        let percentage = partial*(10**type)/total*100;
        return parseFloat(percentage).toPrecision(2);
    }

    return(
        
        <StyledTrophyDistrib>
            <StyledTrophyTable>
                <tbody>
                    {data.trophies.counts.map(function(count, index){
                        return(
                            <tr key={`trophy-${index+1}`}>
                                <td>
                                    <StyledTrophy
                                        title={"T" + (index+1)}
                                        alt={"Trophy" + index+1}
                                        src={process.env.PUBLIC_URL + '/img/trophies/' + index + '.png'}
                                    />
                                </td>
                                <td>Tier {index+1}:</td>
                                <td>{count}</td>
                                <td>{computePercentage(count, index, data.trophies.points)}%</td>
                                <td>{formatNumber(count*(10**index))}</td>
                            </tr>
                            
                        )
                    })}
                    <tr>
                        <td></td>
                        <td>Total</td>
                        <td></td>
                        <td>100%</td>
                        <td>{formatNumber(data.trophies.points)}</td>
                    </tr>
                </tbody>
            </StyledTrophyTable>
            <TrophyPieChart data={data.trophies.counts}/>
        </StyledTrophyDistrib>
    )
}
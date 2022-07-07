import styled from "styled-components"

export const Rank = styled.div`
    width: 50%;
    @media screen and (max-width: 1024px){
        width: 100%;
        padding-bottom: 1rem;
    }
`

export const RankText = styled.div`
    text-align: center;
    font-size: 2rem;
`

export const RankImage = styled.img`
    align-self: center;
    width: 50%;
    display: flex;
    margin: auto;
`

export const MatchmakingStats = styled.div`
    display: flex;
    padding-top: 1rem;
    padding-left: 4rem;
    padding-right: 4rem;
    justify-content: space-around;

    @media screen and (max-width: 1024px){
        padding-top: 1rem;
        flex-direction: column;
        padding: 1%;
    }
`

export const Details = styled.div`
    width: 50%;
    display: flex;
    padding-left: 3rem;
    padding-right: 3rem;
    flex-direction: column;
    justify-content: space-around;
    font-size: larger;
    background-color: rgb(21, 52, 38);
    color: rgb(131, 213, 159);
    border: 1px solid rgb(131, 213, 159);

    @media screen and (max-width: 1024px){
        text-align: center;
        width: 100%;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left:0rem;
        padding-right: 0rem;

        >div{
            padding-bottom: 1rem;
        }
    }
`
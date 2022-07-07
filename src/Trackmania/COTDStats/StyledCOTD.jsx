//external
import styled from "styled-components";

export const InfoBox = styled.div`
    display: flex;
    justify-content: space-around;
`

export const Cells = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;
    margin-top: 1em;
    width: 50%;
    background-color: ${(props)=>props.theme.infobox.background};
    color: ${(props)=>props.theme.infobox.font};
    padding: 1rem;
    border: 1px solid ${(props)=>props.theme.infobox.font};
`

export const CellTitle = styled.div`
    font-size: larger;
`

export const CellData = styled.div`
    font-size: medium;
`
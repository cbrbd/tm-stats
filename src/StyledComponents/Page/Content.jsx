//external
import styled from "styled-components";

export const Content = styled.div`
    background-color: ${(props) => props.theme.main};
    color: ${(props)=> props.theme.font_primary};
    border-radius: 7px;
    margin: 0 1rem 1rem 1rem;

    @media screen and (max-width: 1024px){
        margin: 0;
    }
`
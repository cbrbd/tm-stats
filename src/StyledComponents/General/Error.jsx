//external
import styled from "styled-components";

export const ErrorMessage = styled.div`
    background-color: ${(props)=>props.theme.error.background};
    color: ${(props)=> props.theme.error.font};
    padding: 1rem;
`
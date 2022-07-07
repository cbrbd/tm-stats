//external
import styled from "styled-components";

export const Section = styled.div`
    padding-bottom: 3rem;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    &:last-of-type{
        border: none;
    }
`

export const SectionTitle = styled.h2`
    margin: 2rem 0rem 2rem 1rem;
    text-decoration: underline;
    color: ${(props) => props.theme.font_primary};
`
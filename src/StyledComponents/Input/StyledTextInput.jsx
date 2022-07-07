//external
import styled from 'styled-components';

export const StyledTextInput = styled.input`
    display: inline-block;
    width: 60%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border: none;
    font-size: inherit;

    &:focus{
        outline: #5d9dd5 solid 1px;
        box-shadow: 0 0 8px #5e9ed6;
    }

    @media screen and (max-width: 1024px){
        width: 100%;
    }
`
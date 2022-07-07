// //external
import styled from "styled-components";
import {faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledIcon = styled(FontAwesomeIcon)`
    margin-left: 0.5rem;
    color: ${(props) => props.checked ? "yellow" : "lightgrey"};
    @media screen and (max-width: 1024px){
        display: none;
    }
`

const StyledDiv = styled.div`
    display:flex;
    align-self: flex-end;
    padding: 1rem;
`

const StyledLabel = styled.label`
    position: relative;
    display: inline-block;
    width: 3.2rem;
    height: 2rem;
`

const Checkbox = styled.input`
    position: absolute;
    opacity: 0;
    pointer-events: none;
    &:checked +.switch::before {
        transform: translateX(1.5rem);
    }
    &:focus+.switch  {
        outline: #5d9dd5 solid 1px;
        box-shadow: 0 0 8px #5e9ed6;
    }
    &:checked +.switch{
        background-color: ${(props)=>props.theme.button.active_bg};
    }
`

const Switch = styled.span`
    position: absolute;
    cursor: pointer;
    background-color: ${(props)=>props.theme.button.disabled_bg};
    border-radius: 25px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: background-color 0.2s ease;
    
    &&:before{
        position: absolute;
        content: "";
        left: 0.1rem;
        top: 0.25rem;
        width: 1.5rem;
        height: 1.5rem;
        background-color: #fff;
        border-radius: 50%;
        transition: transform 0.3s ease;
    }
`


export function ThemeSwitch(props){
    
    function handleChange(){
        props.handleClick();
    }

    return(
        <StyledDiv>
            <StyledLabel className="toggle-switch">
                <Checkbox type="checkbox" checked={props.checked} onChange={handleChange} />
                <Switch className="switch" />
            </StyledLabel>
            <StyledIcon checked={props.checked} icon={faMoon} size="2x"/>
        </StyledDiv>
    )

}
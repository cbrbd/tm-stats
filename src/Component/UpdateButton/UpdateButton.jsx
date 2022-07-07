//external
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import styled from 'styled-components';


const StyledUpdateIcon = styled.div`
    color: ${(props) => props.show ? props.theme.font_main : props.theme.main};
    cursor: pointer;
    margin-left: 1em;
    font-size: 1rem;
    display: flex;
    align-items: center;
`

export function UpdateButton(props){

    let [spin, setSpin] = useState(false);

    return(
        <StyledUpdateIcon show={props.show}>
            <FontAwesomeIcon
                icon = {faRotate} 
                size = "1x" 
                spin={spin}
                onMouseEnter={() => setSpin(true)} 
                onMouseLeave= {() => setSpin(false)}
                onClick={props.onClick}
            />
        </StyledUpdateIcon>
        
    )
}
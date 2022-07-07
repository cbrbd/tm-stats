//external
import { createGlobalStyle } from "styled-components";

//font
import lobster from '../font/Lobster-Regular.ttf'

export const GlobalStyle = createGlobalStyle`
    body, html, #root{
        height: 100%;
        margin: 0;
        background-color: ${(props)=>props.theme.background};
    }

    tr:focus{
        border: none;
        outline: 2px solid #333;
        outline-offset: 2px;
    }

    /* @font-face {
        font-family: "Lobster";
        src: local("Lobster"),
        url(${lobster}) format("truetype");
  } */
`
    

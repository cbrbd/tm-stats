//external
import { useEffect, useState} from "react";
import styled from "styled-components";

const Bouncing = styled.div`
    background-color: #4B555D;
    margin:auto;
    width: 95%;
    height: 80vh;
    font-size: 7vh;
    position: relative;
    box-shadow: inset 0 0 3px #000;
    border-radius: 5px;
    border: 10px solid #7B838B;
    overflow: hidden;
    text-shadow: 2px 0 0 #000;

    > div{
        color: ${(props) => props.color};
        background-color: ${(props) => props.bgColor};
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        width: 25%;
        height: 20%;
        position: absolute;
        animation: 
            moveX 3s linear 0s infinite alternate, 
            moveY 7s linear 0s infinite alternate
        }

    @keyframes moveX {
        from { left: 0} to { left: 75%}
    }

    @keyframes moveY {
        from { top: 0} to { top: 80%}
    }
`


export function Error404(){

    const [color, setColor] = useState('#00FFFF');
    const [bgColor, setbgColor] = useState('#FF0000');
  
    //array of possible colors for color and bgColor
    const colorArray = [
        '#00FFFF', 
        '#FF0000', 
        '#00FF00', 
        '#0000FF', 
        '#7FFF00', 
        '#FF8C00', 
        '#FF1493', 
        '#FF00FF',
        '#800080',
        '#FFFF00'
    ];


    //function that returns a random number between 2 limits
    function between(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
      }


    function changefontcolor(){
        let index = between(0, colorArray.length -1);
        let index2 = between(0, colorArray.length -1);
        setColor(colorArray[index]);
        setbgColor(colorArray[index2]);
    }

    useEffect(() => {
        const IntervalX = setInterval(changefontcolor, 3000);
        const intervalY  = setInterval(changefontcolor, 7000)
        return function cleanup(){
            clearInterval(IntervalX);
            clearInterval(intervalY);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return(
    
        <Bouncing color={color} bgColor={bgColor}>
            <div>
                404
            </div>
        </Bouncing>
    )
}
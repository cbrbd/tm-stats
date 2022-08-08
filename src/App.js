//libraries
import { useLayoutEffect, useState } from 'react';
import styled,{ ThemeProvider} from 'styled-components';
import {Route, Routes, HashRouter } from 'react-router-dom';

//Components
import { Trackmania } from './Trackmania/Trackmania';
import { GeneralStats } from './Trackmania/GeneralStats/GeneralStats';
import { COTDStats } from './Trackmania/COTDStats/COTDStats';
import { Matchmaking } from './Trackmania/Matchmaking/Matchmaking';
import { Error404 } from './Component/UpdateButton/404';
import { GlobalStyle } from './StyledComponents/GlobalStyle';
import { ThemeSwitch } from './StyledComponents/Input/ThemeSwitch';

//variable
import { lightTheme, darkTheme } from './theme';
import { useTranslation } from 'react-i18next';

//put font into css instead of styled component as it makes it lag in development build
import './font.css';

const page_background = process.env.PUBLIC_URL + '/img/background/page_background.png'



const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`


const Page  = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(${page_background});
`

const Title = styled.div`
  min-height: 10%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-family: Lobster;
  color: ${(props)=>props.theme.font_secondary};
  font-size: ${(props)=>props.titleSize ==='big' ? '5rem' : '2.5rem'};
  transition-property: font-size;
  transition-duration: 0.4s;
  @media screen and (max-width: 1024px){
    font-size: ${(props)=>props.titleSize ==='big' ? '3rem' : '2.5rem'};
  }
`

function App() {
  const [titleSize, setTitleSize] = useState('big');
  const [currentTheme, setTheme] = useState(lightTheme);

  function changeTitleSize(newClass){
    setTitleSize(newClass);
  }

  // eslint-disable-next-line no-unused-vars
  const {t, i18n} = useTranslation('title');


  useLayoutEffect(()=>{
    let theme = localStorage.getItem('theme');
    if(theme === null){
      return;
    } else {
      if(theme === 'dark'){
        setTheme(darkTheme);
      } else if (theme === 'light'){
        setTheme(lightTheme);
      }
    }
  }, [])

  function toggle(){
    let theme = null;
    if(currentTheme === darkTheme){
      theme = lightTheme;
      localStorage.setItem('theme', 'light');
    } else {
      theme = darkTheme;
      localStorage.setItem('theme', 'dark');
    }
    setTheme(theme)
  }

  return (

      <ThemeProvider theme={currentTheme}>
      <GlobalStyle/>
      
      <Page>
      <Header>
        <ThemeSwitch handleClick={toggle} checked={currentTheme===darkTheme}/>
        <Title titleSize={titleSize}>
          {t('title')}
        </Title>
        
        
      </Header>
      
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="*" element={<Error404/>}/>
          <Route path="/" element={<Trackmania changeTitle={changeTitleSize}/>}>
            
            <Route path="player">
              
              <Route path=":player" element={<GeneralStats/>}/>
              <Route path=":player/General" element={<GeneralStats/>}/>
              <Route path=":player/COTD" element={<COTDStats/>}/>
              <Route path=":player/Matchmaking" element={<Matchmaking/>}/>
            </Route>
            
          </Route>
          
        </Routes>
        
    </HashRouter>
    </Page>
    </ThemeProvider>

    
    
  );
}

export default App;

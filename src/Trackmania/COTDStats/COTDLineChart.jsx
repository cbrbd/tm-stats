//external
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import styled from "styled-components";
//components
import {Section, SectionTitle} from '../../StyledComponents/General/Section';

const StyledDiv = styled.div`
    margin-top: 1em;
    margin-bottom: 1em;
    color: ${(props)=>props.theme.font_dark};
`

const Graph = styled.div`
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
`

export function COTDLineChart(props){
    const {t} = useTranslation('cotd');
    return(
        <StyledDiv>
            <Section>
                <SectionTitle>{t("div and div rank linechart title")}</SectionTitle>
                <Graph>
                <ResponsiveContainer width="99%" height={400}>
                    <LineChart
                    width={500}
                    height={300}
                    data={props.data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                    >
                        <XAxis tickSize={10} minTickGap={1}/>
                    
                        <YAxis 
                            domain={[0, 64]} 
                            // label={{ value: width > 1024 ? 'rank' : 'r', position: 'outsideLeft', dx:-20}}
                        />
                        <YAxis 
                            yAxisId='1' 
                            orientation='right' 
                            // label={{ value: width > 1024 ? 'Div' : 'd', position: 'insideRight', dx:20}}
                        />
                        <Tooltip labelFormatter={(totalplayers) => 'Date: '+ props.data[totalplayers].timestamp}/>
                        <Legend />
                        
                        <Line type="monotone" dataKey="divrank" stroke="#82ca9d" strokeWidth={2}/>
                        <Line 
                            type="monotone" 
                            dataKey="div" 
                            stroke="#8884d8" 
                            yAxisId='1' 
                            strokeWidth={4}
                        />
                    </LineChart>    
                </ResponsiveContainer>  
                </Graph>
                
            </Section>
            
            <Section>
                <SectionTitle>{t("top percentage linechart title")}</SectionTitle>
                <Graph>
                <ResponsiveContainer width="99%" height={400}>
                    <LineChart
                        width={500}
                        height={300}
                        data={props.data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}
                        >
                        <XAxis tickSize={10}/>
                    
                        <YAxis 
                            domain={[0, 64]} 
                            // label={{ value: '%', position: 'outsideLeft' }}
                        />
                        <YAxis 
                            yAxisId='1' 
                            orientation='right' 
                            axisLine={false} //hidden YAxis to keep the charts to the same size, same for next one
                        />
                        <Tooltip labelFormatter={(totalplayers) => 'Date: '+ props.data[totalplayers].timestamp}/>
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="percent" 
                            stroke="#8884d8"  
                            strokeWidth={4}
                        />
                    </LineChart>    
                </ResponsiveContainer>
                </Graph>
                

            </Section>
            
            <Section>
                <SectionTitle>{t("total player linechart title")}</SectionTitle>
                <Graph>
                <ResponsiveContainer width="99%" height={400}>
                    <LineChart
                        width={500}
                        height={300}
                        data={props.data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}
                        >
                        <XAxis tickSize={10}/>
                    
                        <YAxis 
                            domain={[0, 64]} 
                            // label={{ value: width > 1024 ? 'players' : '', position: 'outsideLeft', dx:-20}}
                        />
                        <YAxis 
                            yAxisId='1' 
                            orientation='right' 
                            axisLine={false}
                        />
                        <Tooltip labelFormatter={(totalplayers) => 'Date: '+ props.data[totalplayers].timestamp}/>
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="totalplayers" 
                            stroke="#8884d8"  
                            strokeWidth={4}
                        />
                    </LineChart>    
                </ResponsiveContainer>

                </Graph>
                

            </Section>
            
        </StyledDiv>
        
    )
}


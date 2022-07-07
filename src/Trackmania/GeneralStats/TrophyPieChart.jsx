//external
import {useState, useEffect, useRef, memo} from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList, Line} from 'recharts';

//functions
import useWindowDimensions from '../../WindowDimensions';

export const TrophyPieChart = memo(function TrophyPieChartComp(props){
    const data = props.data;
    const [array, setArray] = useState(null);
    const prevArrayRef = useRef();
    const {width } = useWindowDimensions();

    useEffect(() => {
        if(prevArrayRef.current !== props.data){
            let newData = [];
            for(let i=0; i<data.length; ++i){
              let name = "Tier " + (i+1);
              let value = data[i]*(10**i)
              newData.push({"name": name, "value": value});
            }
            newData.sort(function(a, b){return b.value - a.value});
            setArray(newData);
            prevArrayRef.current = props.data;
        }
        
    }, [props.data, data]);
    
    const COLORS = ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43','#ffa600', '#F7CA18'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, startAngle, endAngle, midAngle, innerRadius, outerRadius, percent, index}) => {
      if(endAngle - startAngle < 1){
        return
      }
      if((percent * 100).toFixed(0) < 2){
          return
      }

      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
      return (
        
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        
        
      );
    };

    const outsideLabel = (props) => {
      let {endAngle, startAngle, innerRadius, outerRadius} = props.viewBox;
      let {cx, cy, index} = props;
      const midAngle = (endAngle + startAngle) / 2;
      const item = array[index]
      if(endAngle - startAngle < 1){
        return null
      }
      

      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx +  (2.2*radius) * Math.cos(-midAngle * RADIAN); 
      const y = cy + (2.2*radius) * Math.sin(-midAngle * RADIAN);
      return (
        
          <text x={x} y={y} fill="grey" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {item.name}
          </text>
        
        
      );
    };


    return (
        <ResponsiveContainer height={width > 1024 ? 400 : 300}>
              <PieChart>
                <Pie 
                  // isAnimationActive={false}
                  data={array} 
                  dataKey="value" 
                  nameKey="name"
                  label={renderCustomizedLabel} 
                  labelLine={false} 
                >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                ))}
                  <LabelList dataKey="value" content={outsideLabel} position="outside">
                    <Line type="linear"/>
                  </LabelList>
                </Pie>
              </PieChart>
        </ResponsiveContainer>
    );
});
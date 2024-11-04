import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface EChartsComponentProps {
  data: number[];
  labels: string[];
}

const EChartsComponent: React.FC<EChartsComponentProps> = ({ data, labels }) => {
  const getOption = (): echarts.EChartsOption => ({
    xAxis: {
      type: 'category',
      data: labels,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data,
        type: 'bar',
      },
    ],
  });

  return <ReactEcharts option={getOption()} echarts={echarts} />;
};

export default EChartsComponent;

import React, {useState, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import InsightCard from '../components/Insight/InsightCard';
import MonthYearPicker from '../components/Common/MonthYearPicker';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux'; 
import { RootState } from '../ReduxToolkit/store';

echarts.use([TitleComponent, TooltipComponent, GridComponent, PieChart, BarChart, CanvasRenderer]);

interface Category {
  category: string;
  tatalCat: number;
  totalCatAmount: number;
}

interface Overview {
  categories: Category[];
  totalTypeAmount: number;
  type: string;
}

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(color);
  return color;
};

const Insight: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const barChartRef = useRef<HTMLDivElement | null>(null); // Ref for bar chart
  const { monthlyOverviews } = useSelector((state: RootState) => state.insightReducer);

  // Use useRef to store colorMapping to persist colors across renders
  const colorMappingRef = useRef<{ [key: string]: string }>({});
 
    monthlyOverviews.forEach((item: Overview) => {
      if (!colorMappingRef.current[item.type]) {
        colorMappingRef.current[item.type] = getRandomColor();
      }
    });

  const pieOptions = {
    title: {
      text: 'Expenses by Type',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ( {d}% )' // Displays category, value, and percentage
    },
    series: [
      {
        name: 'Type',
        type: 'pie',
        radius: '50%',
        data: monthlyOverviews.map((item: any) => ({
          name: item.type,
          value: item.totalTypeAmount,
          itemStyle: {
            color: colorMappingRef.current[item.type] // Use the color from the mapping
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {d}%', // Displays category name and percentage
          position: 'outside' // Optional: places labels outside the pie chart
        }
      }
    ]
  };

  const emptyOptions = {
    title: { text: '' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ data: [], type: 'bar' }]
  };

  const handlePieClick = (e: any) => {
    setSelectedType(e.name);
    if (barChartRef.current) {
      barChartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categories = monthlyOverviews.find((item: Overview) => item.type === selectedType)?.categories || [];
  const categoryLabels = categories.map((cat: Category) => cat.category);
  const categoryValues = categories.map((cat: Category) => cat.totalCatAmount);
  const barOptions = selectedType
    ? {
      title: {
        text: `Categories in ${selectedType}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const { name, value } = params[0];
          return `${name}: ₹${value}`;
        }
      },
      xAxis: {
        type: 'category',
        data: categoryLabels,
        axisLabel: {
          interval: 0, // Show every label
          rotate: 30,  // Rotate labels if they’re long
          formatter: (value: any) => (value.length > 10 ? `${value.slice(0, 10)}...` : value) // Optional truncation for long labels
        }
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        bottom: 80  // Add space if needed for rotated labels
      },
      series: [
        {
          data: categoryValues,
          type: 'bar',
          barWidth: categoryLabels.length === 1 ? '30%' : '60%', // Adjust for single bar
          barMaxWidth: 50, // Maximum width limit to avoid very wide bars
          itemStyle: {
            color: colorMappingRef.current[selectedType] // Use the color from the mapping
          }
        }
      ]
    }
    : emptyOptions;


  return (
    <Box sx={{ overflow: 'true' }} p={2}>
      <InsightCard />
      <MonthYearPicker />
      <Box mt={2}>
        <ReactEChartsCore
          echarts={echarts}
          option={pieOptions}
          style={{ width: '100%', height: '400px' }}
          onEvents={{
            click: handlePieClick
          }}
        />
        <div ref={barChartRef}> {/* Ref for bar chart container */}
          <ReactEChartsCore
            echarts={echarts}
            option={barOptions}
            style={{ width: '100%', height: '400px', marginTop: '20px' }}
          />
        </div>
      </Box>
    </Box>
  );
};

export default Insight;

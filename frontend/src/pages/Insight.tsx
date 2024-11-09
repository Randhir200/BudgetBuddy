import React, { useState, useRef, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import InsightCard from '../components/Insight/InsightCard';
import MonthYearPicker from '../components/Common/MonthYearPicker';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'; 
import { RootState, AppDispatch } from '../ReduxToolkit/store';
import {fetchMonthlyOverview} from '../ReduxToolkit/slices/insightSlice';

echarts.use([TitleComponent, TooltipComponent, GridComponent, PieChart, BarChart, CanvasRenderer]);

const data = [
  {
    categories: [
      { category: 'Outside Food', totalCat: 2, totalCatAmount: 296 },
      { category: 'Outing', totalCat: 11, totalCatAmount: 2009 },
      { category: 'Snacks', totalCat: 2, totalCatAmount: 30 }
    ],
    totalTypeAmount: 2335,
    type: 'Wants'
  },
  {
    categories: [{ category: 'FD', totalCat: 1, totalCatAmount: 35000 }],
    totalTypeAmount: 35000,
    type: 'Savings'
  },
  {
    categories: [
      { category: 'Groceries', totalCat: 28, totalCatAmount: 4482 },
      { category: 'Cloths', totalCat: 2, totalCatAmount: 1541 },
      { category: 'Body Care', totalCat: 3, totalCatAmount: 1019 },
      { category: 'Shampoo', totalCat: 1, totalCatAmount: 50 },
      { category: 'Dairy', totalCat: 1, totalCatAmount: 50 },
      { category: 'Loan', totalCat: 2, totalCatAmount: 5048 },
      { category: 'Fuel', totalCat: 1, totalCatAmount: 150 },
      { category: 'Mobile Recharge', totalCat: 1, totalCatAmount: 161 },
      { category: 'Foods', totalCat: 17, totalCatAmount: 994 },
      { category: 'Bills', totalCat: 5, totalCatAmount: 21908.72 },
    ],
    totalTypeAmount: 35403.72,
    type: 'Needs'
  },
  {
    categories: [{ category: 'Family', totalCat: 1, totalCatAmount: 10000 }],
    totalTypeAmount: 10000,
    type: 'Lend'
  }
];

const userId = localStorage.getItem('userId');

const Insight: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const barChartRef = useRef<HTMLDivElement | null>(null); // Ref for bar chart
  const { monthlyOverviews} = useSelector((state: RootState) => state.insightReducer);
  const dispatch:AppDispatch = useDispatch();

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
        data: monthlyOverviews.map((item:any) => ({
          name: item.type,
          value: item.totalTypeAmount
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

  const categories = data.find(item => item.type === selectedType)?.categories || [];
  const categoryLabels = categories.map(cat => cat.category);
  const categoryValues = categories.map(cat => cat.totalCatAmount);

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
          barMaxWidth: 50 // Maximum width limit to avoid very wide bars
        }
      ]
    }
    : emptyOptions;

  const handlePieClick = (e: any) => {
    setSelectedType(e.name);
    if (barChartRef.current) {
      barChartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(()=>{
    dispatch(fetchMonthlyOverview(userId||''));
  },[])

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

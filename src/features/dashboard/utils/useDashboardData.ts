"use client";

import { useState, useEffect } from 'react';
import { getChartData, getTableData } from '../actions';

const useDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    let intervalId: NodeJS.Timeout;
    intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 90) {
          return prevProgress + 10;
        }
        return prevProgress;
      });
    }, 100);
    const chart = await getChartData();
    const table = await getTableData();
    setChartData(chart);
    setTableData(table);
    clearInterval(intervalId);
    setProgress(100);
    setLoading(false);
  };

  return { loading, progress, chartData, tableData, fetchData };
};

export default useDashboardData;

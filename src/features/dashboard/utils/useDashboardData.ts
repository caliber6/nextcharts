"use client";

import { useState, useEffect, useCallback } from 'react';
import { getChartData, getTableData } from '../actions';

const useDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 90) {
          return prevProgress + 10;
        }
        return prevProgress;
      });
    }, 100);

    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setProgress(100);
      setLoading(false);
    }, 5000);

    try {
      const chart = await getChartData();
      const table = await getTableData();
      setChartData(chart);
      setTableData(table);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      setProgress(100);
      setLoading(false);
    } catch (error) {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      setProgress(100);
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, progress, chartData, tableData, fetchData };
};

export default useDashboardData;

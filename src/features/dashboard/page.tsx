"use client";

import React from 'react';
import LoadingBar from '../components/LoadingBar';
import useDashboardData from '../utils/useDashboardData';
import ReportElement from '../components/ReportElement';

const DashboardPage = () => {
  const { loading, progress, chartData, tableData, fetchData } = useDashboardData();

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold transition-opacity duration-500 animate-fade-in">Report Dashboard</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </header>
      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingBar progress={progress} />
          </div>
        ) : (
          <div className="flex">
            <div className="w-1/2 p-2">
              <ReportElement type="Chart" chartData={chartData} tableData={tableData} />
            </div>
            <div className="w-1/2 p-2">
              <ReportElement type="Table" chartData={chartData} tableData={tableData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;

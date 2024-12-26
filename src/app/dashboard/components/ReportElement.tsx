import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReportElementProps, TableData } from "../../types";

const ITEMS_PER_PAGE = 20;
const INITIAL_LOAD_SIZE = 200;
const CACHE_THRESHOLD_PAGE = 5;

const ReportElement: React.FC<ReportElementProps> = ({
  type,
  chartData = [],
  tableData = [],
}) => {
  const [allTableData, setAllTableData] = useState<TableData[]>([]);
  const [displayedTableData, setDisplayedTableData] = useState<TableData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadedDataSize, setLoadedDataSize] = useState(INITIAL_LOAD_SIZE);
  const [cachedData, setCachedData] = useState<TableData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors
      try {
        if (type === "Table") {
          if (isInitialLoad) {
            if (tableData) {
              setAllTableData(tableData);
              setTotalPages(Math.ceil(loadedDataSize / ITEMS_PER_PAGE));
              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const endIndex = Math.min(
                startIndex + ITEMS_PER_PAGE,
                loadedDataSize
              );
              setDisplayedTableData(
                tableData
                  .slice(0, loadedDataSize)
                  .slice(startIndex, endIndex)
                  .map((item) => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString(),
                  }))
              );
              if (currentPage <= CACHE_THRESHOLD_PAGE) {
                setCachedData(tableData.slice(0, loadedDataSize));
              }
              setIsInitialLoad(false);
            }
          } else {
            setTotalPages(Math.ceil(loadedDataSize / ITEMS_PER_PAGE));
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = Math.min(
              startIndex + ITEMS_PER_PAGE,
              loadedDataSize
            );
            if (currentPage <= CACHE_THRESHOLD_PAGE) {
              if (allTableData.length > 0) {
                setDisplayedTableData(
                  allTableData
                    .slice(0, loadedDataSize)
                    .slice(startIndex, endIndex)
                    .map((item) => ({
                      ...item,
                      date: new Date(item.date).toLocaleDateString(),
                    }))
                );
                if (currentPage === CACHE_THRESHOLD_PAGE) {
                  setCachedData(allTableData.slice(0, loadedDataSize));
                }
              }
            } else {
              if (cachedData.length > 0) {
                setDisplayedTableData(
                  cachedData.slice(startIndex, endIndex).map((item) => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString(),
                  }))
                );
              } else if (allTableData.length > 0) {
                setDisplayedTableData(
                  allTableData
                    .slice(0, loadedDataSize)
                    .slice(startIndex, endIndex)
                    .map((item) => ({
                      ...item,
                      date: new Date(item.date).toLocaleDateString(),
                    }))
                );
              }
            }
          }
        }
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data"); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [
    type,
    currentPage,
    loadedDataSize,
    cachedData,
    allTableData,
    isInitialLoad,
    tableData,
  ]);

  const handlePageChange = async (newPage: number) => {
    if (newPage > totalPages && allTableData.length > loadedDataSize) {
      setLoadedDataSize(loadedDataSize + INITIAL_LOAD_SIZE);
      setTotalPages(
        Math.ceil((loadedDataSize + INITIAL_LOAD_SIZE) / ITEMS_PER_PAGE)
      );
    }
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>; // Display loading message
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>; // Display error message
  }

  if (type === "Chart") {
    return (
      <div className="bg-white p-4 rounded-md mb-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">
          Sales by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "Table") {
    return (
      <div className="bg-white p-4 rounded-md mb-4 shadow-md overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800">Sales Data</h3>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-100 text-gray-700">Date</th>
              <th className="px-4 py-2 bg-gray-100 text-gray-700">Product</th>
              <th className="px-4 py-2 bg-gray-100 text-gray-700">Category</th>
              <th className="px-4 py-2 bg-gray-100 text-gray-700">Price</th>
              <th className="px-4 py-2 bg-gray-100 text-gray-700">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {displayedTableData.map((sale: TableData, index: number) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="border px-4 py-2 text-gray-700">{sale.date}</td>
                <td className="border px-4 py-2 text-gray-700">
                  {sale.product}
                </td>
                <td className="border px-4 py-2 text-gray-700">
                  {sale.category}
                </td>
                <td className="border px-4 py-2 text-gray-700">{sale.price}</td>
                <td className="border px-4 py-2 text-gray-700">
                  {sale.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  if (type === "Text") {
    return (
      <div className="bg-white p-4 rounded-md mb-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Text Area</h3>
        <textarea
          className="border p-2 w-full h-32 text-gray-700"
          placeholder="Enter text here"
        ></textarea>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md mb-4">
      <h3 className="text-lg font-semibold">{type}</h3>
      <p className="text-gray-600">Report element content here</p>
    </div>
  );
};

export default ReportElement;
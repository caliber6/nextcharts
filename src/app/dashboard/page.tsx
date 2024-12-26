"use client";

import React, { useState, useEffect } from "react";
import {
  addItem,
  getChartData,
  getTableData,
  checkDatabaseConnection,
} from "@/app/dashboard/actions";
import { Input } from "@/components/ui/input";
import DatePickerField from "./components/DatePickerField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ReportElement from "./components/ReportElement";
import { ChartData, TableData } from "../types";

const DashboardPage = () => {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const isConnected = await checkDatabaseConnection();
        setDbConnected(Boolean(isConnected));
        if (isConnected) {
          setDataLoading(true);
          const [chartData, tableData] = await Promise.all([
            getChartData(),
            getTableData(),
          ]);
          setChartData(chartData);
          setTableData(tableData);
        } else {
          setError("Database connection failed.");
        }
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async () => {
    if (
      date &&
      product.trim() !== "" &&
      category.trim() !== "" &&
      price.trim() !== "" &&
      quantity.trim() !== ""
    ) {
      try {
        await addItem({
          date: date.toISOString(),
          product,
          category,
          price: parseFloat(price),
          quantity: parseInt(quantity),
        });
        setDate(null);
        setProduct("");
        setCategory("");
        setPrice("");
        setQuantity("");
        // Refresh data after adding an item
        const newTableData = await getTableData();
        setTableData(newTableData);
      } catch (err: unknown) {
        console.error("Error adding item:", err);
        setError(err instanceof Error ? err.message : "Failed to add item");
      }
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate === undefined ? null : newDate);
  };

  if (loading) {
    return <div className="text-center">Checking database connection...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!dbConnected) {
    return (
      <div className="text-center text-red-500">Database not connected.</div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </header>
      <main className="flex-1 p-4 flex flex-col items-center justify-start w-full max-w-7xl mx-auto gap-4 min-h-[calc(100vh-100px)]">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <div className="mb-4">
            <Label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </Label>
            <DatePickerField onDateChange={handleDateChange} />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700"
            >
              Product
            </Label>
            <Input
              id="product"
              type="text"
              placeholder="Product"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </Label>
            <Input
              id="category"
              type="text"
              placeholder="Category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Price"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Quantity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </div>
        {dataLoading ? (
          <div className="text-center">Loading data...</div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <ReportElement type="Chart" chartData={chartData} />
            <ReportElement type="Table" tableData={tableData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;

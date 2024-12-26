"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSalesData } from "../sales/actions";
import { TableData } from "../types";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/app/dashboard/utils/utils";

const SalesChartPage = () => {
  const [salesData, setSalesData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Initialize filters to empty strings and null dates
  const [productFilter, setProductFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const itemsPerPage = 100000; // Fetch all data for charting

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getSalesData(itemsPerPage, 0);
      setSalesData(data);
      console.log(data);
    } catch (err: unknown) {
      console.error("Error fetching sales data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load sales data"
      );
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = [...salesData];

    if (productFilter) {
      filtered = filtered.filter((item) =>
        item.product.toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    setFilteredData(filtered);
  }, [salesData, productFilter, categoryFilter, dateRange]);

  const chartData = filteredData.reduce((acc: any, item) => {
    const existingCategory = acc.find((entry: any) => entry.category === item.category);
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    console.log("Item:", item, "Price:", price, "Quantity:", qty); // Add this line
    if (existingCategory) {
      existingCategory.sales += price * qty;
    } else {
      acc.push({ category: item.category, sales: price * qty });
    }
    return acc;
  }, []);

  const handleDateChange = (newDate: {
    from?: Date | null;
    to?: Date | null;
  }) => {
    setDateRange((prev) => ({
      from: newDate.from === undefined ? prev.from : newDate.from,
      to: newDate.to === undefined ? prev.to : newDate.to,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-12 w-12 border-t-1 border-b-1 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Chart</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <Label htmlFor="productFilter">Product Filter</Label>
          <Input
            type="text"
            id="productFilter"
            placeholder="Filter by product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="categoryFilter">Category Filter</Label>
          <Input
            type="text"
            id="categoryFilter"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <div>
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}
              >
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                    {format(dateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange.from ? dateRange.from : new Date()}
                selected={dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChartPage;

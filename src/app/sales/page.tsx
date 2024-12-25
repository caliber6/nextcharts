"use client";

import { useState, useEffect } from "react";
import { TableData } from "../types";
import { getSalesData } from "./actions";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SalesPage = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, total } = await getSalesData(
          itemsPerPage,
          (currentPage - 1) * itemsPerPage,
          searchQuery,
          categoryFilter
        );
        setTableData(data);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } catch (err: unknown) {
        console.error("Error fetching sales data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load sales data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, categoryFilter, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === "all" ? "" : value);
    setCurrentPage(1); // Reset to first page on filter
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

  const columns = [
    { header: "ID", key: "id" as keyof TableData },
    { header: "Product", key: "product" as keyof TableData },
    { header: "Price", key: "price" as keyof TableData },
    { header: "Quantity", key: "qty" as keyof TableData },
    { header: "Category", key: "category" as keyof TableData },
    {
      header: "Date",
      key: "date" as keyof TableData,
      formatter: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  // Extract unique categories for filter
  const categories = [...new Set(tableData.map((item) => item.category))];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales Data</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search">Search</Label>
          <Input
            type="text"
            id="search"
            placeholder="Search by product..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="min-w-[150px]">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table data={tableData} columns={columns} />
      <div className="flex justify-center mt-4">
        <Button
          variant={`${currentPage === totalPages ? "default" : "outline"}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "bg-purple-400 hover:bg-purple-500 text-white"
          }`}
        >
          Previous
        </Button>
        <span className="mx-2 px-3 py-1">{currentPage}</span>
        <Button
          variant={`${currentPage === totalPages ? "outline" : "default"}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "bg-purple-400 hover:bg-purple-500 text-white"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SalesPage;

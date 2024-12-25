"use server";

import { ChartData, TableData, AddItemData } from "../types";
import { createConnection } from "@/lib/db";

export const checkDatabaseConnection = async () => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const connection = await createConnection();
        await connection.query('SELECT 1'); // Use ping to check connection
        await connection.release();
        resolve(true);
      } catch (error) {
        console.error("Database connection error:", error);
        resolve(false);
      }
    }, 1000);
  });
};

export const getChartData = async (): Promise<ChartData[]> => {
  try {
    const connection = await createConnection();
    const result = await connection.query(
      `SELECT category, SUM(price * quantity) AS sales FROM ${
        process.env.TABLE_NAME || "items"
      } GROUP BY category`
    );
    await connection.release();
    return result.rows as ChartData[];
  } catch (error) {
    console.error("Database query error (getChartData):", error);
    return [];
  }
};

export const getTableData = async (): Promise<TableData[]> => {
  try {
    const connection = await createConnection();
    const result = await connection.query(
      `SELECT * FROM ${process.env.TABLE_NAME || "items"} ORDER BY date DESC` // Order by date
    );
    await connection.release();
    return result.rows as TableData[];
  } catch (error) {
    console.error("Database query error (getTableData):", error);
    return [];
  }
};

export const addItem = async (item: AddItemData) => {
  try {
    const connection = await createConnection();
    await connection.query(
      `INSERT INTO ${
        process.env.TABLE_NAME || "items"
      } (date, product, category, price, quantity) VALUES (?, ?, ?, ?, ?)`,
      [item.date, item.product, item.category, item.price, item.quantity]
    );
    await connection.release();
  } catch (error) {
    console.error("Database query error (addItem):", error);
    throw new Error("Failed to add item"); // Throw error to be caught by the component
  }
};
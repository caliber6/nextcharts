"use server";

import { createConnection } from "@/lib/db";
import { TableData } from "../types";

export const getSalesData = async (limit: number, offset: number, searchQuery: string = "", categoryFilter: string = ""): Promise<{ data: TableData[], total: number }> => {
    try {
      const connection = await createConnection();
      let query = `SELECT * FROM sales WHERE 1=1`;
      const params: any[] = [];

      if (searchQuery) {
        query += ` AND product LIKE $${params.length + 1}`;
        params.push(`%${searchQuery}%`);
      }

      if (categoryFilter) {
        query += ` AND category = $${params.length + 1}`;
        params.push(categoryFilter);
      }

      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const dataResult = await connection.query(query, params);

      let countQuery = `SELECT COUNT(*) FROM sales WHERE 1=1`;
      const countParams: any[] = [];

      if (searchQuery) {
        countQuery += ` AND product LIKE $${countParams.length + 1}`;
        countParams.push(`%${searchQuery}%`);
      }

      if (categoryFilter) {
        countQuery += ` AND category = $${countParams.length + 1}`;
        countParams.push(categoryFilter);
      }

      const countResult = await connection.query(countQuery, countParams);

      connection.release();
      return {
        data: dataResult.rows as TableData[],
        total: Number(countResult.rows[0].count)
      };
    } catch (error) {
      console.error("Database query error (getSalesData):", error);
      return { data: [], total: 0 };
    }
  };
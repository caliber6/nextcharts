'use server';

import mysql from 'mysql2/promise';

export interface ChartData {
  category: string;
  sales: number;
}

export interface TableData {
  id: number;
  date: string;
  product: string;
  category: string;
  price: number;
  quantity: number;
}

interface AddItemData {
    date: string;
    product: string;
    category: string;
    price: number;
    quantity: number;
}

const dbConfig = {
  host: process.env.DB_HOST || '54.242.194.26',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'mysql',
  password: process.env.DB_PASS || 'yIQdszXPlkmRgY9sSKlguuf12PZLVMIzp3o4uENHmSehoeoUEWJ5VwgPfam7mnpo',
  database: process.env.DB_NAME || 'default',
};

export const checkDatabaseConnection = async () => {
  return new Promise(resolve => {
    setTimeout(async () => {
      try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.end();
        resolve(true);
      } catch (error) {
        console.error('Database connection error:', error);
        resolve(false);
      }
    }, 1000);
  });
};

export const getChartData = async (): Promise<ChartData[]> => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT category, SUM(price * quantity) AS sales FROM ${process.env.TABLE_NAME || 'items'} GROUP BY category`
    );
    await connection.end();
    console.log('Chart data:', rows);
    return rows as ChartData[];
  } catch (error) {
    console.error('Database query error (getChartData):', error);
    return [];
  }
};

export const getTableData = async (): Promise<TableData[]> => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT * FROM ${process.env.TABLE_NAME || 'items'}`
    );
    await connection.end();
    console.log('Table data:', rows);
    return rows as TableData[];
  } catch (error) {
    console.error('Database query error (getTableData):', error);
    return [];
  }
};

export const addItem = async (item: AddItemData) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        `INSERT INTO ${process.env.TABLE_NAME || 'items'} (date, product, category, price, quantity) VALUES (?, ?, ?, ?, ?)`,
        [item.date, item.product, item.category, item.price, item.quantity]
      );
      await connection.end();
      console.log('Item added:', item);
    } catch (error) {
      console.error('Database query error (addItem):', error);
    }
  };
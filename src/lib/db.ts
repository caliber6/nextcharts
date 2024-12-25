import pg from 'pg';
const { Pool } = pg;

const dbConfig = {
    host: "95.217.7.150",
    port: 5432,
    user: "postgres",
    password:
      "NbvKSY7Z0bF632qtN7afz4X2y6GO0kEihVjGRk4Pm7yUBoXSjfKdSr7zPDWihrmB",
    database: "itemsales",
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait for a connection before timing out
  };
  
  const db = new Pool(dbConfig);

export const createConnection = async () => {
  return await db.connect();
};
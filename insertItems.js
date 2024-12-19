// insertItems.js

const mysql = require('mysql2/promise');

/**
 * Configuration
 */
const DB_HOST = process.env.DB_HOST || '54.242.194.26';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');     // Dolt/MySQL port
const DB_USER = process.env.DB_USER || 'mysql';
const DB_PASS = process.env.DB_PASS || 'yIQdszXPlkmRgY9sSKlguuf12PZLVMIzp3o4uENHmSehoeoUEWJ5VwgPfam7mnpo';

// Database and table we want to create
const NEW_DB_NAME = process.env.DB_NAME || 'default';
const TABLE_NAME = 'items';

// Number of rows to generate
const ROW_COUNT = 1000000;

// Categories and products
const categories = [
  "Produce", "Dairy", "Bakery", "Meat", "Seafood",
  "Beverages", "Pantry", "Frozen", "Snacks",
  "Household", "Health"
];

const productsByCategory = {
  "Produce": [
    "Apples", "Bananas", "Tomatoes", "Lettuce", "Carrots",
    "Onions", "Potatoes", "Grapes", "Broccoli", "Spinach",
    "Cucumbers", "Peppers", "Avocados", "Mushrooms",
    "Garlic", "Ginger", "Lemons", "Limes", "Celery",
    "Radishes", "Beets", "Parsley", "Cilantro", "Dill",
    "Basil", "Mint"
  ],
  "Dairy": [
    "Milk", "Cheddar Cheese", "Yogurt", "Cream Cheese", "Butter",
    "Eggs", "Cottage Cheese"
  ],
  "Bakery": [
    "Bread", "Cookies", "Buns", "Donuts", "Croissants"
  ],
  "Meat": [
    "Chicken Breast", "Ground Beef", "Pork Chops", "Bacon", "Turkey"
  ],
  "Seafood": [
    "Salmon", "Tilapia", "Shrimp", "Tuna"
  ],
  "Beverages": [
    "Orange Juice", "Coffee", "Tea", "Soda", "Water", "Energy Drink"
  ],
  "Pantry": [
    "Pasta", "Canned Soup", "Peanut Butter", "Jelly", "Honey",
    "Syrup", "Mustard", "Ketchup", "Pickles", "Rice", "Beans"
  ],
  "Frozen": [
    "Ice Cream", "Frozen Pizza", "Frozen Vegetables", "Frozen Meals"
  ],
  "Snacks": [
    "Chips", "Pretzels", "Popcorn", "Candy", "Chocolate", "Nuts",
    "Trail Mix", "Granola Bars", "Rice Cakes", "Fruit Snacks", "Pudding"
  ],
  "Household": [
    "Paper Towels", "Toilet Paper", "Laundry Detergent", "Dish Soap"
  ],
  "Health": [
    "Vitamins", "Pain Reliever", "Cough Syrup", "Hand Sanitizer"
  ]
};

/**
 * Generate a random date in 2022 in YYYY-MM-DD format
 */
function randomDateIn2022() {
  const start = new Date("2022-01-01");
  const end = new Date("2022-12-31");
  const diff = end.getTime() - start.getTime();
  const newTime = start.getTime() + Math.random() * diff;
  const randomDate = new Date(newTime);
  return randomDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

/**
 * Pick a random element from an array
 */
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate one random record: { date, product, category, price, quantity }
 */
function generateRandomRecord() {
  const category = randomFromArray(categories);
  const product = randomFromArray(productsByCategory[category]);
  const price = parseFloat((Math.random() * 20 + 1).toFixed(2)); // 1.00 ~ 21.00
  const quantity = Math.floor(Math.random() * 10) + 1; // 1~10
  return {
    date: randomDateIn2022(),
    product,
    category,
    price,
    quantity
  };
}

(async function main() {
  let connection;
  try {
    // Connect to Dolt/MySQL WITHOUT specifying a database (we'll create one)
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: NEW_DB_NAME
    });

    console.log(`Connected to ${DB_HOST}:${DB_PORT} as ${DB_USER}`);


    // Create table if not exists
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`${TABLE_NAME}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        product VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(5,2) NOT NULL,
        quantity INT NOT NULL
      );
    `;
    await connection.execute(createTableSQL);
    console.log(`Ensured table "${TABLE_NAME}" exists.`);

    // Generate data
    console.log(`Generating ${ROW_COUNT} random rows...`);
    const rows = [];
    for (let i = 0; i < ROW_COUNT; i++) {
      const record = generateRandomRecord();
      rows.push([record.date, record.product, record.category, record.price, record.quantity]);
    }

    // Insert in batches for performance
    let insertedCount = 0;
    const batchSize = 1000;

    while (rows.length > 0) {
      const batch = rows.splice(0, batchSize);
      const insertSQL = `
        INSERT INTO \`${TABLE_NAME}\` (date, product, category, price, quantity)
        VALUES ?
      `;
      await connection.query(insertSQL, [batch]);
      insertedCount += batch.length;
      process.stdout.write(`\rInserted ${insertedCount}/${ROW_COUNT} rows...`);
    }

    console.log(`\nDone! Inserted ${ROW_COUNT} rows into "${NEW_DB_NAME}.${TABLE_NAME}".`);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
})();

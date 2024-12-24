"use client";

import React, { useState } from 'react';
import { addItem } from '@/features/dashboard/actions';
import { Input } from '@/components/ui/input';
import DatePickerField from './components/DatePickerField';
import { Label } from '@/components/ui/label';

const DashboardPage = () => {
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState<Date | null>(null);

  const handleAddItem = async () => {
    if (date && product.trim() !== '' && category.trim() !== '' && price.trim() !== '' && quantity.trim() !== '') {
      await addItem({ date: date.toISOString(), product, category, price: parseFloat(price), quantity: parseInt(quantity) });
      setDate(null);
      setProduct('');
      setCategory('');
      setPrice('');
      setQuantity('');
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold transition-opacity duration-500 animate-fade-in">Dashboard</h1>
      </header>
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center w-full max-w-sm">
          <div className="mb-4 w-full">
            <Label htmlFor="date">Date</Label>
            <DatePickerField onDateChange={handleDateChange} />
          </div>
          <div className="mb-4 w-full">
            <Label htmlFor="product">Product</Label>
            <Input
              id="product"
              type="text"
              placeholder="Product"
              className="text-black p-2 rounded w-full"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="Category"
              className="text-black p-2 rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Price"
              className="text-black p-2 rounded w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Quantity"
              className="text-black p-2 rounded w-full"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

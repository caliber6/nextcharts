export interface ChartData {
  id: number;
  date: string;
  product: string;
  category: string;
  price: number;
  qty: number;
}

export interface TableData {
  id: number;
  date: string;
  product: string;
  category: string;
  price: number;
  qty: number;
}

export interface AddItemData {
  date: string;
  product: string;
  category: string;
  price: number;
  qty: number;
}

export interface ReportElementProps {
  type: string;
  chartData?: ChartData[];
  tableData?: TableData[];
}

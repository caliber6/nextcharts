import React from "react";

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: {
    header: string;
    key: keyof T;
    formatter?: (value: any) => React.ReactNode;
  }[];
}

const Table = <T extends Record<string, any>>({ data, columns }: TableProps<T>) => {
  if (!data || data.length === 0) {
    return <div className="text-center">No data available.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md mb-4 shadow-md overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key.toString()} className="px-4 py-2 bg-gray-100 text-gray-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              {columns.map((column) => (
                <td key={column.key.toString()} className="border px-4 py-2 text-gray-700">
                  {column.formatter ? column.formatter(item[column.key]) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
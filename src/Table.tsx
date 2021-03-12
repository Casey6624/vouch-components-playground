import React from "react";

interface TableProps<T> {
  columns: Array<keyof T>;
  data: Array<T>;
}

export default function Table<Parent>({ columns, data }: TableProps<Parent>) {
  return (
    <table>
      <thead>
        {columns.map((col, index) => (
          <th key={index}>{col}</th>
        ))}
      </thead>
      {data.map((row, index) => (
        <tr key={index}>
          {columns.map((col, i) => (
            <td key={i}>{row[col]}</td>
          ))}
        </tr>
      ))}
    </table>
  );
}

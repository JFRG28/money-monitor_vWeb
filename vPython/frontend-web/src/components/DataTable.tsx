import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  CurrencyDollarIcon, 
  EyeIcon, 
  CalendarIcon,
  TagIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'currency' | 'date' | 'select' | 'boolean';
  options?: string[];
  editable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = "No hay datos disponibles" 
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingCell, setEditingCell] = useState<{row: number, column: string} | null>(null);

  const getIconForColumn = (column: Column) => {
    switch (column.key) {
      case 'monto':
        return <CurrencyDollarIcon className="h-4 w-4" />;
      case 'fecha_cargo':
      case 'fecha_pago':
      case 'mes':
        return <CalendarIcon className="h-4 w-4" />;
      case 'tag':
        return <TagIcon className="h-4 w-4" />;
      case 'no_mens':
      case 'total_meses':
      case 'anio':
        return <HashtagIcon className="h-4 w-4" />;
      default:
        return <EyeIcon className="h-4 w-4" />;
    }
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const renderCellContent = (row: any, column: Column, rowIndex: number) => {
    const value = row[column.key];
    const isEditing = editingCell?.row === rowIndex && editingCell?.column === column.key;

    if (isEditing && column.editable) {
      if (column.type === 'select' && column.options) {
        return (
          <select 
            className="w-full bg-gray-100 border-0 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={value}
            onBlur={() => setEditingCell(null)}
            autoFocus
          >
            {column.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else {
        return (
          <input 
            type={column.type === 'number' ? 'number' : 'text'}
            className="w-full bg-gray-100 border-0 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={value}
            onBlur={() => setEditingCell(null)}
            autoFocus
          />
        );
      }
    }

    // Formatear el valor según el tipo
    let displayValue = value;
    if (column.type === 'currency') {
      if (typeof value === 'string' && value.startsWith('$')) {
        displayValue = value; // Ya viene formateado
      } else {
        displayValue = `$${Number(value).toLocaleString()}`;
      }
    } else if (column.type === 'date' && value) {
      displayValue = new Date(value).toLocaleDateString();
    } else if (column.type === 'boolean') {
      displayValue = value ? 'Sí' : 'No';
    } else if (column.type === 'number') {
      displayValue = value?.toString() || '';
    }

    return (
      <span 
        className={column.editable ? "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" : ""}
        onClick={() => column.editable && setEditingCell({row: rowIndex, column: column.key})}
      >
        {displayValue}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-green-800">
            <tr>
              <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-green-700">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-2 py-3 text-xs font-semibold text-white uppercase tracking-wider border-r border-green-700 last:border-r-0 ${
                    column.width ? `w-${column.width}` : ''
                  } ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-1">
                    {getIconForColumn(column)}
                    <span>{column.label}</span>
                    <button
                      onClick={() => handleSort(column.key)}
                      className="ml-1 hover:bg-green-700 rounded p-1"
                    >
                      <ChevronDownIcon 
                        className={`h-3 w-3 transition-transform ${
                          sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-2 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                  {index + 1}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-2 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0 ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {renderCellContent(row, column, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
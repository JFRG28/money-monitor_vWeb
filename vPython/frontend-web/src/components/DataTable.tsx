import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  CurrencyDollarIcon, 
  EyeIcon, 
  CalendarIcon,
  TagIcon,
  HashtagIcon,
  TrashIcon
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
  onDelete?: (ids: number[]) => Promise<void>;
  onDeleteSingle?: (id: number) => Promise<void>;
  idKey?: string;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = "No hay datos disponibles",
  onDelete,
  onDeleteSingle,
  idKey = 'id'
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingCell, setEditingCell] = useState<{row: number, column: string} | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const getIconForColumn = (column: Column) => {
    switch (column.key) {
      case 'monto':
        return <CurrencyDollarIcon className="h-3 w-3" />;
      case 'fecha_cargo':
      case 'fecha_pago':
      case 'mes':
        return <CalendarIcon className="h-3 w-3" />;
      case 'tag':
        return <TagIcon className="h-3 w-3" />;
      case 'no_mens':
      case 'total_meses':
      case 'anio':
        return <HashtagIcon className="h-3 w-3" />;
      default:
        return <EyeIcon className="h-3 w-3" />;
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = sortedData.map((row, index) => row[idKey] || index);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0 || !onDelete) return;
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar ${selectedRows.size} registro(s) seleccionado(s)?`
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Error deleting records:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSingle = async (rowId: number) => {
    if (!onDeleteSingle) return;
    
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este registro?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDeleteSingle(rowId);
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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
      {/* Barra de herramientas para eliminación */}
      {selectedRows.size > 0 && onDelete && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-red-700">
            {selectedRows.size} registro(s) seleccionado(s)
          </span>
          <button
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-3 w-3 mr-1" />
            {isDeleting ? 'Eliminando...' : 'Eliminar Seleccionados'}
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-green-800">
            <tr>
              <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider border-r border-green-700">
                <input
                  type="checkbox"
                  checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
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
                        className={`h-2.5 w-2.5 transition-transform ${
                          sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </th>
              ))}
              {onDeleteSingle && (
                <th className="px-2 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedData.map((row, index) => {
              const rowId = row[idKey] || index;
              const isSelected = selectedRows.has(rowId);
              
              return (
                <tr 
                  key={index} 
                  className={`hover:bg-gray-50 border-b border-gray-200 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-2 py-3 text-sm text-gray-900 text-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
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
                  {onDeleteSingle && (
                    <td className="px-2 py-3 text-sm text-gray-900 text-center">
                      <button
                        onClick={() => handleDeleteSingle(rowId)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar registro"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import TabMenu from './TabMenu';
import DataTable from './DataTable';

interface TabbedInterfaceProps {
  initialTab?: string;
}

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({ initialTab = 'unificado_v4' }) => {
  const { state, loadGastos, loadBalance, loadDeudas, loadDashboard, deleteGasto } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Cargar datos cuando cambie la pestaña activa
  useEffect(() => {
    switch (activeTab) {
      case 'unificado_v4':
        loadGastos();
        break;
      case 'balance':
        loadBalance();
        break;
      case 'deuda':
        loadDeudas();
        break;
      case 'cálculos':
        loadDashboard();
        break;
      case 'app_wallet_x_tdc':
        loadGastos(); // Por ahora usar gastos, después se puede filtrar
        break;
    }
  }, [activeTab, loadGastos, loadBalance, loadDeudas, loadDashboard]);

  const tabs = [
    { id: 'unificado_v4', label: 'Registros históricos' },
    { id: 'cálculos', label: 'cálculos' },
    { id: 'app_wallet_x_tdc', label: 'app wallet x TDC' },
    { id: 'balance', label: 'balance' },
    { id: 'deuda', label: 'deuda' }
  ];

  // Configuración de columnas para cada pestaña
  const getColumns = (tabId: string) => {
    switch (tabId) {
      case 'unificado_v4':
        return [
          { key: 'concepto', label: 'concepto', width: '200px', type: 'text' as const, editable: true },
          { key: 'monto', label: 'monto', width: '120px', align: 'right' as const, type: 'currency' as const, editable: true },
          { key: 'tipo_gasto', label: 'tipo_gasto', width: '120px', type: 'select' as const, editable: true, options: ['Variable', 'Fijo', 'MSI', 'MCI'] },
          { key: 'forma_pago', label: 'forma_pago', width: '120px', type: 'text' as const, editable: true },
          { key: 'mes', label: 'mes', width: '100px', type: 'select' as const, editable: true, options: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] },
          { key: 'anio', label: 'año', width: '80px', align: 'center' as const, type: 'number' as const, editable: true },
          { key: 'fecha_cargo', label: 'fecha_cargo', width: '120px', type: 'date' as const, editable: true },
          { key: 'fecha_pago', label: 'fecha_pago', width: '120px', type: 'date' as const, editable: true },
          { key: 'categoria', label: 'categoría', width: '100px', align: 'center' as const, type: 'select' as const, editable: true, options: ['E', 'I'] },
          { key: 'a_pagos', label: 'a_pagos', width: '100px', align: 'center' as const, type: 'boolean' as const, editable: true },
          { key: 'no_mens', label: 'no_mens', width: '100px', align: 'center' as const, type: 'number' as const, editable: true },
          { key: 'total_meses', label: 'total_meses', width: '120px', align: 'center' as const, type: 'number' as const, editable: true },
          { key: 'tag', label: 'tag', width: '100px', type: 'text' as const, editable: true },
          { key: 'se_divide', label: 'se_divide', width: '100px', align: 'center' as const, type: 'boolean' as const, editable: true },
          { key: 'gasto_x_mes', label: 'gasto_x_mes', width: '120px', type: 'text' as const, editable: true }
        ];
      
      case 'balance':
        return [
          { key: 'tipo', label: 'tipo', width: '100px', align: 'center' as const, type: 'select' as const, editable: true, options: ['Débito', 'Inversión'] },
          { key: 'concepto', label: 'concepto', width: '200px', type: 'text' as const, editable: true },
          { key: 'monto', label: 'monto', width: '120px', align: 'right' as const, type: 'currency' as const, editable: true },
          { key: 'deben_ser', label: 'deben_ser', width: '120px', align: 'right' as const, type: 'currency' as const, editable: true },
          { key: 'diferencia', label: 'diferencia', width: '120px', align: 'right' as const, type: 'currency' as const, editable: false },
          { key: 'comentarios', label: 'comentarios', width: '200px', type: 'text' as const, editable: true }
        ];
      
      case 'deuda':
        return [
          { key: 'item', label: 'Concepto', width: '200px' },
          { key: 'monto', label: 'Monto', width: '120px', align: 'right' as const },
          { key: 'fecha', label: 'Fecha', width: '120px' }
        ];
      
      case 'cálculos':
        return [
          { key: 'concepto', label: 'Concepto', width: '200px' },
          { key: 'valor', label: 'Valor', width: '120px', align: 'right' as const },
          { key: 'tipo', label: 'Tipo', width: '100px' }
        ];
      
      case 'app_wallet_x_tdc':
        return [
          { key: 'concepto', label: 'Concepto', width: '200px' },
          { key: 'monto', label: 'Monto', width: '120px', align: 'right' as const },
          { key: 'tipo_gasto', label: 'Tipo Gasto', width: '120px' },
          { key: 'forma_pago', label: 'Forma Pago', width: '120px' },
          { key: 'mes', label: 'Mes', width: '100px' },
          { key: 'anio', label: 'Año', width: '80px', align: 'center' as const }
        ];
      
      default:
        return [];
    }
  };

  // Obtener datos para la pestaña activa
  const getData = (tabId: string) => {
    switch (tabId) {
      case 'unificado_v4':
        return state.gastos.map(gasto => ({
          ...gasto,
          // Mantener los datos en formato original para permitir edición
          monto: gasto.monto,
          fecha_cargo: gasto.fecha_cargo,
          fecha_pago: gasto.fecha_pago,
          a_pagos: gasto.a_pagos,
          se_divide: gasto.se_divide,
          categoria: gasto.categoria
        }));
      
      case 'balance':
        return state.balance.map(item => ({
          ...item,
          // Mantener los datos en formato original para permitir edición
          monto: item.monto,
          deben_ser: item.deben_ser,
          diferencia: item.diferencia,
          tipo: item.tipo
        }));
      
      case 'deuda':
        return state.deudas.map(item => ({
          ...item,
          monto: `$${item.monto.toLocaleString()}`,
          fecha: new Date(item.fecha).toLocaleDateString()
        }));
      
      case 'cálculos':
        if (state.dashboard) {
          return [
            { concepto: 'Total Gastos', valor: `$${state.dashboard.total_gastos.toLocaleString()}`, tipo: 'Egreso' },
            { concepto: 'Total Ingresos', valor: `$${state.dashboard.total_ingresos.toLocaleString()}`, tipo: 'Ingreso' },
            { concepto: 'Balance Mensual', valor: `$${state.dashboard.balance_mensual.toLocaleString()}`, tipo: 'Balance' },
            { concepto: 'Deuda Total', valor: `$${state.dashboard.deuda_total.toLocaleString()}`, tipo: 'Deuda' },
            { concepto: 'Diferencia Lulu', valor: `$${state.dashboard.diferencia_lulu.toLocaleString()}`, tipo: 'Diferencia' }
          ];
        }
        return [];
      
      case 'app_wallet_x_tdc':
        // Filtrar gastos que sean MSI o MCI
        return state.gastos
          .filter(gasto => gasto.tipo_gasto === 'MSI' || gasto.forma_pago.includes('TDC'))
          .map(gasto => ({
            ...gasto,
            monto: `$${gasto.monto.toLocaleString()}`,
            categoria: gasto.categoria === 'E' ? 'Egreso' : gasto.categoria === 'I' ? 'Ingreso' : gasto.categoria
          }));
      
      default:
        return [];
    }
  };

  const getLoadingState = (tabId: string) => {
    switch (tabId) {
      case 'unificado_v4':
      case 'app_wallet_x_tdc':
        return state.loadingStates.gastos;
      case 'balance':
        return state.loadingStates.balance;
      case 'deuda':
        return state.loadingStates.deudas;
      case 'cálculos':
        return state.loadingStates.dashboard;
      default:
        return false;
    }
  };

  // Funciones de eliminación para gastos
  const handleDeleteGastos = async (ids: number[]) => {
    try {
      // Eliminar uno por uno (en el futuro se puede optimizar con un endpoint batch)
      for (const id of ids) {
        await deleteGasto(id);
      }
    } catch (error) {
      console.error('Error deleting gastos:', error);
      throw error;
    }
  };

  const handleDeleteSingleGasto = async (id: number) => {
    try {
      await deleteGasto(id);
    } catch (error) {
      console.error('Error deleting gasto:', error);
      throw error;
    }
  };

  return (
    <div>
      {/* Menú de pestañas */}
      <TabMenu 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {/* Contenido de la pestaña activa */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
          </div>
          
          <DataTable
            columns={getColumns(activeTab)}
            data={getData(activeTab)}
            loading={getLoadingState(activeTab)}
            emptyMessage={`No hay datos disponibles para ${tabs.find(tab => tab.id === activeTab)?.label}`}
            onDelete={activeTab === 'unificado_v4' ? handleDeleteGastos : undefined}
            onDeleteSingle={activeTab === 'unificado_v4' ? handleDeleteSingleGasto : undefined}
            idKey="id"
          />
        </div>
      </div>
    </div>
  );
};

export default TabbedInterface;

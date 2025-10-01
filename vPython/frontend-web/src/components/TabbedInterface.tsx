import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import TabMenu from './TabMenu';
import DataTable from './DataTable';

interface TabbedInterfaceProps {
  initialTab?: string;
}

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({ initialTab = 'unificado_v4' }) => {
  const { state, loadGastos, loadBalance, loadDeudas, loadDashboard } = useApp();
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
          { key: 'concepto', label: 'Concepto', width: '200px' },
          { key: 'monto', label: 'Monto', width: '120px', align: 'right' as const },
          { key: 'tipo_gasto', label: 'Tipo Gasto', width: '120px' },
          { key: 'forma_pago', label: 'Forma Pago', width: '120px' },
          { key: 'mes', label: 'Mes', width: '100px' },
          { key: 'anio', label: 'Año', width: '80px', align: 'center' as const },
          { key: 'fecha_cargo', label: 'Fecha Cargo', width: '120px' },
          { key: 'fecha_pago', label: 'Fecha Pago', width: '120px' },
          { key: 'categoria', label: 'Categoría', width: '100px', align: 'center' as const },
          { key: 'a_pagos', label: 'A Pagos', width: '100px', align: 'center' as const },
          { key: 'no_mens', label: 'No Mens', width: '100px', align: 'center' as const },
          { key: 'total_meses', label: 'Total Meses', width: '120px', align: 'center' as const },
          { key: 'tag', label: 'Tag', width: '100px' },
          { key: 'se_divide', label: 'Se Divide', width: '100px', align: 'center' as const },
          { key: 'gasto_x_mes', label: 'Gasto x Mes', width: '120px' }
        ];
      
      case 'balance':
        return [
          { key: 'tipo', label: 'Tipo', width: '100px', align: 'center' as const },
          { key: 'concepto', label: 'Concepto', width: '200px' },
          { key: 'monto', label: 'Monto', width: '120px', align: 'right' as const },
          { key: 'deben_ser', label: 'Deben Ser', width: '120px', align: 'right' as const }
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
          monto: `$${gasto.monto.toLocaleString()}`,
          fecha_cargo: new Date(gasto.fecha_cargo).toLocaleDateString(),
          fecha_pago: new Date(gasto.fecha_pago).toLocaleDateString(),
          a_pagos: gasto.a_pagos ? 'Sí' : 'No',
          se_divide: gasto.se_divide ? 'Sí' : 'No',
          categoria: gasto.categoria === 'E' ? 'Egreso' : gasto.categoria === 'I' ? 'Ingreso' : gasto.categoria
        }));
      
      case 'balance':
        return state.balance.map(item => ({
          ...item,
          monto: `$${item.monto.toLocaleString()}`,
          deben_ser: `$${item.deben_ser.toLocaleString()}`,
          tipo: item.tipo === 'D' ? 'Débito' : 'Crédito'
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
          />
        </div>
      </div>
    </div>
  );
};

export default TabbedInterface;

import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useApp } from '../contexts/AppContext';
import { TIPOS_GASTO, CATEGORIAS, MESES, FORMAS_PAGO } from '../constants/catalogs';

interface GastoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const GastoFormModal: React.FC<GastoFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createGasto } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    tipo_gasto: '',
    forma_pago: '',
    mes: '',
    anio: new Date().getFullYear(),
    fecha_cargo: '',
    fecha_pago: '',
    categoria: '',
    a_pagos: false,
    no_mens: 0,
    total_meses: 0,
    tag: '',
    se_divide: false,
    gasto_x_mes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'monto' || name === 'no_mens' || name === 'total_meses' || name === 'anio') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.concepto || !formData.monto || !formData.tipo_gasto || !formData.forma_pago || 
        !formData.mes || !formData.fecha_cargo || !formData.fecha_pago || !formData.categoria) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    
    try {
      const gastoData = {
        ...formData,
        monto: Number(formData.monto),
        anio: Number(formData.anio),
        fecha_cargo: new Date(formData.fecha_cargo),
        fecha_pago: new Date(formData.fecha_pago),
        no_mens: Number(formData.no_mens) || 0,
        total_meses: Number(formData.total_meses) || 0,
        tag: formData.tag || 'NA',
        gasto_x_mes: formData.gasto_x_mes || 'NA'
      };

      await createGasto(gastoData);
      
      // Reset form
      setFormData({
        concepto: '',
        monto: '',
        tipo_gasto: '',
        forma_pago: '',
        mes: '',
        anio: new Date().getFullYear(),
        fecha_cargo: '',
        fecha_pago: '',
        categoria: '',
        a_pagos: false,
        no_mens: 0,
        total_meses: 0,
        tag: '',
        se_divide: false,
        gasto_x_mes: ''
      });
      
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error al crear gasto:', error);
      alert('Error al crear el gasto. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Gasto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Concepto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concepto *
              </label>
              <input
                type="text"
                name="concepto"
                value={formData.concepto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del gasto"
                required
              />
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Tipo de Gasto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Gasto *
              </label>
              <select
                name="tipo_gasto"
                value={formData.tipo_gasto}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un tipo</option>
                {TIPOS_GASTO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Forma de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pago *
              </label>
              <select
                name="forma_pago"
                value={formData.forma_pago}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona forma de pago</option>
                {FORMAS_PAGO.map(forma => (
                  <option key={forma} value={forma}>{forma}</option>
                ))}
              </select>
            </div>

            {/* Mes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mes *
              </label>
              <select
                name="mes"
                value={formData.mes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un mes</option>
                {MESES.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año *
              </label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                min="2000"
                max="2100"
                required
              />
            </div>

            {/* Fecha de Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Cargo *
              </label>
              <input
                type="date"
                name="fecha_cargo"
                value={formData.fecha_cargo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Fecha de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago *
              </label>
              <input
                type="date"
                name="fecha_pago"
                value={formData.fecha_pago}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'E' ? 'Egreso' : 'Ingreso'}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Etiqueta opcional"
              />
            </div>

            {/* A Pagos */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="a_pagos"
                checked={formData.a_pagos}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                A Pagos
              </label>
            </div>

            {/* Se Divide */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="se_divide"
                checked={formData.se_divide}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Se Divide
              </label>
            </div>

            {/* No. Mensualidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Mensualidades
              </label>
              <input
                type="number"
                name="no_mens"
                value={formData.no_mens}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Total Meses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Meses
              </label>
              <input
                type="number"
                name="total_meses"
                value={formData.total_meses}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Gasto por Mes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gasto por Mes
              </label>
              <input
                type="text"
                name="gasto_x_mes"
                value={formData.gasto_x_mes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del gasto mensual"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Crear Gasto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GastoFormModal;

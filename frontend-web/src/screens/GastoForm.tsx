import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { TIPOS_GASTO, CATEGORIAS, MESES, ROUTES } from '../constants';

// Tipos locales para evitar problemas de importación
interface GastoCreateInput {
  concepto: string;
  monto: number;
  tipo_gasto: 'MSI' | 'Variable' | 'Fijo';
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: 'E' | 'I';
  a_pagos: boolean;
  no_mens: number;
  total_meses: number;
  tag: string;
  se_divide: boolean;
  gasto_x_mes: string;
}
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const GastoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, createGasto, updateGasto, loadGastos } = useApp();
  const { loading, error } = state;

  const isEdit = Boolean(id);
  const gasto = isEdit ? state.gastos.find(g => g.id === parseInt(id!)) : null;

  const [formData, setFormData] = useState<GastoCreateInput>({
    concepto: '',
    monto: 0,
    tipo_gasto: 'Variable',
    forma_pago: '',
    mes: 'Enero',
    anio: new Date().getFullYear(),
    fecha_cargo: new Date(),
    fecha_pago: new Date(),
    categoria: 'E',
    a_pagos: false,
    no_mens: 0,
    total_meses: 0,
    tag: '',
    se_divide: false,
    gasto_x_mes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && gasto) {
      setFormData({
        concepto: gasto.concepto,
        monto: gasto.monto,
        tipo_gasto: gasto.tipo_gasto,
        forma_pago: gasto.forma_pago,
        mes: gasto.mes,
        anio: gasto.anio,
        fecha_cargo: new Date(gasto.fecha_cargo),
        fecha_pago: new Date(gasto.fecha_pago),
        categoria: gasto.categoria,
        a_pagos: gasto.a_pagos,
        no_mens: gasto.no_mens,
        total_meses: gasto.total_meses,
        tag: gasto.tag,
        se_divide: gasto.se_divide,
        gasto_x_mes: gasto.gasto_x_mes
      });
    }
  }, [isEdit, gasto]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es requerido';
    }

    if (formData.monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    if (!formData.forma_pago.trim()) {
      newErrors.forma_pago = 'La forma de pago es requerida';
    }

    if (!formData.mes) {
      newErrors.mes = 'El mes es requerido';
    }

    if (!formData.anio || formData.anio < 2000 || formData.anio > 2100) {
      newErrors.anio = 'El año debe ser válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && id) {
        await updateGasto(parseInt(id), formData);
      } else {
        await createGasto(formData);
      }
      navigate(ROUTES.GASTOS);
    } catch (error) {
      console.error('Error saving gasto:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 :
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'date' ? new Date(value) :
              value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(ROUTES.GASTOS)}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Modifica la información del gasto' : 'Agrega un nuevo gasto o ingreso'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Concepto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Concepto *
          </label>
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.concepto ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: Compra en supermercado"
          />
          {errors.concepto && (
            <p className="mt-1 text-sm text-red-600">{errors.concepto}</p>
          )}
        </div>

        {/* Monto y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto *
            </label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.monto ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.monto && (
              <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'E' ? 'Egreso' : 'Ingreso'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tipo de Gasto y Forma de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Gasto
            </label>
            <select
              name="tipo_gasto"
              value={formData.tipo_gasto}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIPOS_GASTO.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Pago *
            </label>
            <input
              type="text"
              name="forma_pago"
              value={formData.forma_pago}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.forma_pago ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Efectivo, Tarjeta, Transferencia"
            />
            {errors.forma_pago && (
              <p className="mt-1 text-sm text-red-600">{errors.forma_pago}</p>
            )}
          </div>
        </div>

        {/* Mes y Año */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes *
            </label>
            <select
              name="mes"
              value={formData.mes}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.mes ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {MESES.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
            {errors.mes && (
              <p className="mt-1 text-sm text-red-600">{errors.mes}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año *
            </label>
            <input
              type="number"
              name="anio"
              value={formData.anio}
              onChange={handleInputChange}
              min="2000"
              max="2100"
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.anio ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.anio && (
              <p className="mt-1 text-sm text-red-600">{errors.anio}</p>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Cargo
            </label>
            <input
              type="date"
              name="fecha_cargo"
              value={formData.fecha_cargo.toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Pago
            </label>
            <input
              type="date"
              name="fecha_pago"
              value={formData.fecha_pago.toISOString().split('T')[0]}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Campos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Trabajo, Personal, Casa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gasto por Mes
            </label>
            <input
              type="text"
              name="gasto_x_mes"
              value={formData.gasto_x_mes}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: $500"
            />
          </div>
        </div>

        {/* Campos numéricos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Mensualidades
            </label>
            <input
              type="number"
              name="no_mens"
              value={formData.no_mens}
              onChange={handleInputChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total de Meses
            </label>
            <input
              type="number"
              name="total_meses"
              value={formData.total_meses}
              onChange={handleInputChange}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="a_pagos"
              checked={formData.a_pagos}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              A pagos
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="se_divide"
              checked={formData.se_divide}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Se divide
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.GASTOS)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GastoForm;

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import TabbedInterface from '../components/TabbedInterface';
import GastoFormModal from '../components/GastoFormModal';

const Dashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSuccess = () => {
    // El formulario se cierra automáticamente y los datos se recargan
    // gracias al contexto que maneja la actualización
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de agregar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Money Monitor Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona tus finanzas personales de manera eficiente
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Gasto
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal con pestañas */}
      <TabbedInterface initialTab="unificado_v4" />

      {/* Modal del formulario */}
      <GastoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Dashboard;

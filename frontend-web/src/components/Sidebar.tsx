import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ChartBarIcon,
  CreditCardIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '../constants';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
    { name: 'Gastos', href: ROUTES.GASTOS, icon: CurrencyDollarIcon },
    { name: 'Nuevo Gasto', href: ROUTES.GASTO_FORM, icon: PlusIcon },
    { name: 'Balance', href: ROUTES.BALANCE, icon: ChartBarIcon },
    { name: 'Deudas', href: ROUTES.DEUDAS, icon: CreditCardIcon },
    { name: 'Configuración', href: ROUTES.CONFIGURACION, icon: CogIcon },
  ];

  return (
    <div className="w-56 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-lg font-bold text-gray-900">Money Monitor</h1>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

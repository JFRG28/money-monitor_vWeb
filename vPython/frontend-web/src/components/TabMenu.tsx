import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Tab {
  id: string;
  label: string;
  active?: boolean;
}

interface TabMenuProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-green-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{tab.label}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          ))}
        </div>
        {/* Línea verde debajo del menú */}
        <div className="h-1 bg-green-500"></div>
      </div>
    </div>
  );
};

export default TabMenu;

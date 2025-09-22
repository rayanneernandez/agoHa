import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard de Leads</h1>
              <p className="text-sm text-gray-600">Postos de Combustíveis - agHora Conveniência</p>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar Dados</span>
          </button>
        </div>
      </div>
    </header>
  );
};
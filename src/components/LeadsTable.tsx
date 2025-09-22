import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Lead } from '../types/Lead';

interface LeadsTableProps {
  leads: Lead[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUF, setFilterUF] = useState('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.uf.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'ativo' && lead.ativo) ||
                         (filterStatus === 'inativo' && !lead.ativo);
    
    const matchesUF = filterUF === 'all' || lead.uf === filterUF;
    
    return matchesSearch && matchesStatus && matchesUF;
  });

  const uniqueUFs = [...new Set(leads.map(lead => lead.uf))].sort();

  const getStatusColor = (status: string, ativo: boolean) => {
    if (!ativo) return 'bg-red-100 text-red-800';
    if (status.includes('operando ok')) return 'bg-green-100 text-green-800';
    if (status.includes('nova')) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string, ativo: boolean) => {
    if (!ativo) return '🔴';
    if (status.includes('operando ok')) return '🟢';
    if (status.includes('nova')) return '🔵';
    return '🟡';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Lista de Leads</h3>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Todos Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
            
            <select
              value={filterUF}
              onChange={(e) => setFilterUF(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Todos Estados</option>
              {uniqueUFs.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Situação
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {lead.razaoSocial}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.cpfCnpj}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.cidade}, {lead.uf}</div>
                  <div className="text-sm text-gray-500">{lead.bairro}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {lead.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {getStatusIcon(lead.status, lead.ativo)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(lead.status, lead.ativo)
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-8">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum lead encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros de busca.
          </p>
        </div>
      )}
    </div>
  );
};
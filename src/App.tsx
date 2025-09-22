import React, { useState } from 'react';
import { Users, UserCheck, UserX, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { RegionChart } from './components/charts/RegionChart';
import { UFChart } from './components/charts/UFChart';
import { StatusChart } from './components/charts/StatusChart';
import { BrazilMap } from './components/BrazilMap';
import { LeadsTable } from './components/LeadsTable';
import { useDashboardData } from './hooks/useDashboardData';

function App() {
  const { stats, regionData, ufData, statusData, leads } = useDashboardData();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total de Leads"
            value={stats.totalLeads}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-100"
            subtitle="Total geral"
          />
          <StatsCard
            title="Leads Ativos"
            value={stats.leadsAtivos}
            icon={UserCheck}
            color="text-green-600"
            bgColor="bg-green-100"
            subtitle="Em operação"
          />
          <StatsCard
            title="Leads Inativos"
            value={stats.leadsInativos}
            icon={UserX}
            color="text-red-600"
            bgColor="bg-red-100"
            subtitle="Fora de operação"
          />
          <StatsCard
            title="Leads Quentes"
            value={stats.leadsQuentes}
            icon={TrendingUp}
            color="text-orange-600"
            bgColor="bg-orange-100"
            subtitle="Potencial fechamento"
          />
          <StatsCard
            title="Leads Frios"
            value={stats.leadsFrios}
            icon={TrendingDown}
            color="text-purple-600"
            bgColor="bg-purple-100"
            subtitle="Baixo potencial"
          />
        </div>

        {/* Gráficos e Mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RegionChart data={regionData} />
          <BrazilMap onRegionSelect={setSelectedRegion} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UFChart data={ufData} />
          <StatusChart data={statusData} />
        </div>

        {/* Tabela de Leads */}
        <LeadsTable leads={leads} />

        {/* Informações sobre Integração */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Integração com Google Sheets
          </h3>
          <p className="text-blue-700 text-sm mb-3">
            Para integrar diretamente com sua planilha do Google Sheets, seria necessário:
          </p>
          <ul className="text-blue-600 text-sm space-y-1 list-disc list-inside">
            <li>Configurar a API do Google Sheets</li>
            <li>Implementar autenticação OAuth 2.0</li>
            <li>Criar funções para buscar dados automaticamente</li>
            <li>Configurar atualizações em tempo real</li>
          </ul>
          <p className="text-blue-700 text-sm mt-3">
            <strong>Link da planilha:</strong> 
            <a 
              href="https://docs.google.com/spreadsheets/d/1uZajgkDCNmamwa4zljMfiPSyPBarVayCvKHWW3Qco5c/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline ml-1"
            >
              Acessar Planilha Original
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
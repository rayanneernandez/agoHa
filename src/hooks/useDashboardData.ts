import { useMemo } from 'react';
import { mockLeads, getRegionByUF } from '../data/mockData';
import { DashboardStats, RegionData } from '../types/Lead';

export const useDashboardData = () => {
  const stats: DashboardStats = useMemo(() => {
    const totalLeads = mockLeads.length;
    const leadsAtivos = mockLeads.filter(lead => lead.ativo).length;
    const leadsInativos = totalLeads - leadsAtivos;
    
    // Considerando "quentes" como leads ativos com status operando ou novos
    const leadsQuentes = mockLeads.filter(lead => 
      lead.ativo && (
        lead.status.includes('operando ok') || 
        lead.status.includes('nova')
      )
    ).length;
    
    const leadsFrios = mockLeads.filter(lead => 
      !lead.ativo || 
      lead.status.includes('fechou') || 
      lead.status.includes('cancelou') ||
      lead.status.includes('não renovar')
    ).length;

    return {
      totalLeads,
      leadsAtivos,
      leadsInativos,
      leadsQuentes,
      leadsFrios
    };
  }, []);

  const regionData: RegionData[] = useMemo(() => {
    const regionCounts: { [key: string]: { total: number; ativos: number } } = {};
    
    mockLeads.forEach(lead => {
      const regiao = getRegionByUF(lead.uf);
      if (!regionCounts[regiao]) {
        regionCounts[regiao] = { total: 0, ativos: 0 };
      }
      regionCounts[regiao].total++;
      if (lead.ativo) {
        regionCounts[regiao].ativos++;
      }
    });

    return Object.entries(regionCounts).map(([regiao, data]) => ({
      regiao,
      leads: data.total,
      ativos: data.ativos,
      percentual: Math.round((data.total / stats.totalLeads) * 100)
    }));
  }, [stats.totalLeads]);

  const ufData = useMemo(() => {
    const ufCounts: { [key: string]: { total: number; ativos: number } } = {};
    
    mockLeads.forEach(lead => {
      if (!ufCounts[lead.uf]) {
        ufCounts[lead.uf] = { total: 0, ativos: 0 };
      }
      ufCounts[lead.uf].total++;
      if (lead.ativo) {
        ufCounts[lead.uf].ativos++;
      }
    });

    return Object.entries(ufCounts).map(([uf, data]) => ({
      uf,
      total: data.total,
      ativos: data.ativos,
      inativos: data.total - data.ativos
    }));
  }, []);

  const statusData = useMemo(() => {
    const statusCounts: { [key: string]: number } = {};
    
    mockLeads.forEach(lead => {
      const status = lead.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / stats.totalLeads) * 100)
    }));
  }, [stats.totalLeads]);

  return {
    stats,
    regionData,
    ufData,
    statusData,
    leads: mockLeads
  };
};
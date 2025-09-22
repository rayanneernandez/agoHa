export interface Lead {
  id: number;
  razaoSocial: string;
  cpfCnpj: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  status: string;
}

export interface DashboardStats {
  totalLeads: number;
  leadsAtivos: number;
  leadsInativos: number;
  leadsQuentes: number;
  leadsFrios: number;
}

export interface RegionData {
  regiao: string;
  leads: number;
  ativos: number;
  percentual: number;
}
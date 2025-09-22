import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UFChartProps {
  data: Array<{
    uf: string;
    total: number;
    ativos: number;
    inativos: number;
  }>;
}

export const UFChart: React.FC<UFChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads por Estado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="uf" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ativos" stackId="a" fill="#10B981" name="Ativos" />
          <Bar dataKey="inativos" stackId="a" fill="#EF4444" name="Inativos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
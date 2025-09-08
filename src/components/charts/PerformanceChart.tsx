"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HabilidadePerformance {
  codigo: string;
  habilidade: string;
  totalAlunos: number;
  acertos: number;
  erros: number;
  percentualAcerto: number;
  defasagem: 'baixa' | 'media' | 'alta';
}

interface PerformanceChartProps {
  data: HabilidadePerformance[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Cores baseadas no nível de defasagem
  const getColor = (defasagem: string) => {
    switch (defasagem) {
      case 'baixa': return '#22c55e';
      case 'media': return '#f59e0b';
      case 'alta': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-gray-700 mb-2">{data.habilidade}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Percentual de Acerto:</span> {data.percentualAcerto}%
            </p>
            <p className="text-sm">
              <span className="font-medium">Acertos:</span> {data.acertos}/{data.totalAlunos}
            </p>
            <p className="text-sm">
              <span className="font-medium">Defasagem:</span>{' '}
              <span className={`font-medium ${
                data.defasagem === 'baixa' ? 'text-green-600' :
                data.defasagem === 'media' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {data.defasagem}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="codigo" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[0, 100]}
            label={{ value: 'Percentual de Acerto (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="percentualAcerto" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.defasagem)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
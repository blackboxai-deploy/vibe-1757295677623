"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface HabilidadePerformance {
  codigo: string;
  habilidade: string;
  percentualAcerto: number;
  defasagem: 'baixa' | 'media' | 'alta';
}

interface HabilidadesRadarProps {
  data: HabilidadePerformance[];
}

export function HabilidadesRadar({ data }: HabilidadesRadarProps) {
  // Transformar dados para o radar
  const radarData = data.map(item => ({
    habilidade: item.codigo,
    percentual: item.percentualAcerto,
    descricao: item.habilidade,
    fullMax: 100
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{data.habilidade}</p>
          <p className="text-xs text-gray-600 mb-2">{data.descricao}</p>
          <p className="text-sm">
            <span className="font-medium text-blue-600">Desempenho:</span> {data.percentual}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="habilidade" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickCount={5}
          />
          <Radar
            name="Percentual"
            dataKey="percentual"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ r: 4, fill: '#3b82f6' }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
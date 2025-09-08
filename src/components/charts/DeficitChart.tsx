"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface HabilidadePerformance {
  codigo: string;
  habilidade: string;
  percentualAcerto: number;
  defasagem: 'baixa' | 'media' | 'alta';
}

interface DeficitChartProps {
  data: HabilidadePerformance[];
}

export function DeficitChart({ data }: DeficitChartProps) {
  // Preparar dados para o gráfico de pizza
  const chartData = data.map(item => ({
    name: item.codigo,
    value: 100 - item.percentualAcerto, // Deficit percentual
    deficit: item.percentualAcerto,
    habilidade: item.habilidade,
    fullData: item
  }));

  const COLORS = ['#ef4444', '#f97316', '#dc2626', '#b91c1c'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <p className="text-sm text-gray-700 mb-2">{data.habilidade}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium text-green-600">Acerto:</span> {data.deficit}%
            </p>
            <p className="text-sm">
              <span className="font-medium text-red-600">Deficit:</span> {data.value.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <p>Nenhuma habilidade com defasagem alta!</p>
          <p className="text-sm mt-1">Parabéns pelo excelente desempenho.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
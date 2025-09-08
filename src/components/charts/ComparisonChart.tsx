"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ComparisonChart() {
  // Dados simulados de evolução temporal
  const data = [
    {
      mes: 'Jan',
      mediaGeral: 65,
      portugues: 68,
      matematica: 62,
    },
    {
      mes: 'Fev',
      mediaGeral: 70,
      portugues: 72,
      matematica: 68,
    },
    {
      mes: 'Mar',
      mediaGeral: 73,
      portugues: 75,
      matematica: 71,
    },
    {
      mes: 'Abr',
      mediaGeral: 76,
      portugues: 78,
      matematica: 74,
    },
    {
      mes: 'Mai',
      mediaGeral: 78,
      portugues: 80,
      matematica: 76,
    },
    {
      mes: 'Jun',
      mediaGeral: 81,
      portugues: 83,
      matematica: 79,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm">
                <span className="inline-block w-3 h-3 rounded mr-2" style={{ backgroundColor: entry.color }}></span>
                <span className="font-medium">{entry.name}:</span> {entry.value}%
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="mes" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[50, 90]}
            label={{ value: 'Percentual (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="mediaGeral" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Média Geral"
            dot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="portugues" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Português"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="matematica" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Matemática"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
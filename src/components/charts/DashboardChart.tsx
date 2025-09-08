"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'H01 - Localizar informações',
    acertos: 85,
    erros: 15,
  },
  {
    name: 'H02 - Inferir informação',
    acertos: 72,
    erros: 28,
  },
  {
    name: 'H03 - Inferir significado',
    acertos: 68,
    erros: 32,
  },
  {
    name: 'H04 - Tema/assunto principal',
    acertos: 79,
    erros: 21,
  },
  {
    name: 'H05 - Interpretar texto',
    acertos: 64,
    erros: 36,
  },
  {
    name: 'H06 - Organização textual',
    acertos: 71,
    erros: 29,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-green-600">
            <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
            Acertos: {payload[0]?.value}%
          </p>
          <p className="text-red-600">
            <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
            Erros: {payload[1]?.value}%
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export function DashboardChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            domain={[0, 100]}
            label={{ value: 'Percentual (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="rect"
          />
          <Bar 
            dataKey="acertos" 
            stackId="a" 
            fill="#22c55e" 
            name="Acertos"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="erros" 
            stackId="a" 
            fill="#ef4444" 
            name="Erros"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
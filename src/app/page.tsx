"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardChart } from "@/components/charts/DashboardChart";

export default function HomePage() {
  const stats = [
    {
      title: "Planos de Aula",
      value: "24",
      description: "Criados este mês",
      trend: "+12%",
    },
    {
      title: "Provas Aplicadas", 
      value: "8",
      description: "Últimas 4 semanas",
      trend: "+25%",
    },
    {
      title: "Alunos Avaliados",
      value: "156", 
      description: "Total cadastrados",
      trend: "+8%",
    },
    {
      title: "Habilidades SAEB",
      value: "47",
      description: "Mapeadas no sistema",
      trend: "100%",
    },
  ];

  const recentActivities = [
    {
      type: "plano",
      title: "Plano de Português - 5º Ano",
      time: "2 horas atrás",
      status: "concluído",
    },
    {
      type: "prova", 
      title: "Prova de Matemática - Frações",
      time: "1 dia atrás",
      status: "aplicada",
    },
    {
      type: "correção",
      title: "Correção Turma 5A - 28 alunos",
      time: "2 dias atrás", 
      status: "processada",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Educacional</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao sistema de gestão educacional baseado na BNCC e SAEB
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Desempenho por Habilidades SAEB
              </CardTitle>
              <p className="text-sm text-gray-600">
                Análise das últimas avaliações aplicadas
              </p>
            </CardHeader>
            <CardContent>
              <DashboardChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'plano' ? 'bg-blue-500' :
                      activity.type === 'prova' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Habilidades Mapeadas</span>
                  <span className="font-medium">47/50</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Planos Criados</span>
                  <span className="font-medium">24/30</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Avaliações Aplicadas</span>
                  <span className="font-medium">8/12</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "@/components/charts/PerformanceChart";
import { DeficitChart } from "@/components/charts/DeficitChart";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { HabilidadesRadar } from "@/components/charts/HabilidadesRadar";

interface HabilidadePerformance {
  codigo: string;
  habilidade: string;
  totalAlunos: number;
  acertos: number;
  erros: number;
  percentualAcerto: number;
  defasagem: 'baixa' | 'media' | 'alta';
}

interface AlunoResultado {
  nome: string;
  turma: string;
  nota: number;
  percentual: number;
  habilidadesCorretas: string[];
  habilidadesErradas: string[];
}

export default function RelatoriosPage() {
  const [filtroTurma, setFiltroTurma] = useState('todas');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('ultimo_mes');

  // Dados simulados de performance por habilidade
  const habilidadesPerformance: HabilidadePerformance[] = [
    {
      codigo: 'H01',
      habilidade: 'Localizar informações explícitas',
      totalAlunos: 156,
      acertos: 133,
      erros: 23,
      percentualAcerto: 85,
      defasagem: 'baixa'
    },
    {
      codigo: 'H02',
      habilidade: 'Inferir sentido de palavras',
      totalAlunos: 156,
      acertos: 112,
      erros: 44,
      percentualAcerto: 72,
      defasagem: 'media'
    },
    {
      codigo: 'H03',
      habilidade: 'Inferir informação implícita',
      totalAlunos: 156,
      acertos: 106,
      erros: 50,
      percentualAcerto: 68,
      defasagem: 'alta'
    },
    {
      codigo: 'H04',
      habilidade: 'Identificar tema do texto',
      totalAlunos: 156,
      acertos: 123,
      erros: 33,
      percentualAcerto: 79,
      defasagem: 'baixa'
    },
    {
      codigo: 'H05',
      habilidade: 'Interpretar texto',
      totalAlunos: 156,
      acertos: 100,
      erros: 56,
      percentualAcerto: 64,
      defasagem: 'alta'
    },
    {
      codigo: 'H06',
      habilidade: 'Organização textual',
      totalAlunos: 156,
      acertos: 111,
      erros: 45,
      percentualAcerto: 71,
      defasagem: 'media'
    }
  ];

  // Dados simulados de resultados individuais
  const resultadosIndividuais: AlunoResultado[] = [
    {
      nome: 'Ana Silva',
      turma: '5º A',
      nota: 8.5,
      percentual: 85,
      habilidadesCorretas: ['H01', 'H04', 'H06'],
      habilidadesErradas: ['H02', 'H03', 'H05']
    },
    {
      nome: 'João Santos',
      turma: '5º A',
      nota: 7.2,
      percentual: 72,
      habilidadesCorretas: ['H01', 'H02', 'H04'],
      habilidadesErradas: ['H03', 'H05', 'H06']
    },
    {
      nome: 'Maria Oliveira',
      turma: '5º B',
      nota: 9.1,
      percentual: 91,
      habilidadesCorretas: ['H01', 'H02', 'H04', 'H06'],
      habilidadesErradas: ['H03', 'H05']
    }
  ];

  const turmas = ['todas', '5º A', '5º B', '5º C'];
  const disciplinas = ['todas', 'portugues', 'matematica'];
  const periodos = [
    { value: 'ultima_semana', label: 'Última Semana' },
    { value: 'ultimo_mes', label: 'Último Mês' },
    { value: 'ultimo_trimestre', label: 'Último Trimestre' },
    { value: 'ano_letivo', label: 'Ano Letivo' }
  ];

  const getDefasagemColor = (defasagem: string) => {
    switch (defasagem) {
      case 'baixa': return 'text-green-600 bg-green-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'alta': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDefasagemIcon = (defasagem: string) => {
    switch (defasagem) {
      case 'baixa': return '🟢';
      case 'media': return '🟡';
      case 'alta': return '🔴';
      default: return '⚪';
    }
  };

  const habilidadesComDefasagem = habilidadesPerformance.filter(h => h.defasagem === 'alta');
  const mediaGeral = Math.round(habilidadesPerformance.reduce((acc, h) => acc + h.percentualAcerto, 0) / habilidadesPerformance.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
          <p className="text-gray-600 mt-2">
            Análise detalhada do desempenho por habilidades SAEB e identificação de defasagens
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔍 Filtros de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Turma</label>
              <Select value={filtroTurma} onValueChange={setFiltroTurma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map(turma => (
                    <SelectItem key={turma} value={turma}>
                      {turma === 'todas' ? 'Todas as Turmas' : turma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Disciplina</label>
              <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map(disc => (
                    <SelectItem key={disc} value={disc}>
                      {disc === 'todas' ? 'Todas' : 
                       disc === 'portugues' ? 'Português' : 'Matemática'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map(periodo => (
                    <SelectItem key={periodo.value} value={periodo.value}>
                      {periodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                📊 Atualizar Análise
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {mediaGeral}%
              </div>
              <p className="text-sm text-gray-600">Média Geral</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {habilidadesPerformance.filter(h => h.defasagem === 'baixa').length}
              </div>
              <p className="text-sm text-gray-600">Habilidades OK</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {habilidadesComDefasagem.length}
              </div>
              <p className="text-sm text-gray-600">Com Defasagem</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {resultadosIndividuais.length}
              </div>
              <p className="text-sm text-gray-600">Alunos Avaliados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análise */}
      <Tabs defaultValue="habilidades" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="habilidades">📊 Por Habilidades</TabsTrigger>
          <TabsTrigger value="defasagem">🔍 Defasagens</TabsTrigger>
          <TabsTrigger value="comparativo">📈 Comparativo</TabsTrigger>
          <TabsTrigger value="individual">👤 Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="habilidades" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📈 Performance por Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={habilidadesPerformance} />
              </CardContent>
            </Card>

            {/* Radar das Habilidades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 Radar de Competências</CardTitle>
              </CardHeader>
              <CardContent>
                <HabilidadesRadar data={habilidadesPerformance} />
              </CardContent>
            </Card>
          </div>

          {/* Tabela Detalhada */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Detalhamento por Habilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {habilidadesPerformance.map((hab) => (
                  <div key={hab.codigo} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{hab.codigo}</Badge>
                        <span className="font-medium">{hab.habilidade}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{hab.percentualAcerto}%</span>
                        <span className="text-lg">{getDefasagemIcon(hab.defasagem)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Progress value={hab.percentualAcerto} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total: </span>
                        <span className="font-medium">{hab.totalAlunos} alunos</span>
                      </div>
                      <div>
                        <span className="text-green-600">Acertos: </span>
                        <span className="font-medium">{hab.acertos}</span>
                      </div>
                      <div>
                        <span className="text-red-600">Erros: </span>
                        <span className="font-medium">{hab.erros}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Badge className={`text-xs ${getDefasagemColor(hab.defasagem)}`}>
                        Defasagem {hab.defasagem}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defasagem" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚨 Habilidades com Maior Defasagem</CardTitle>
              <p className="text-sm text-gray-600">
                Habilidades que requerem atenção pedagógica prioritária
              </p>
            </CardHeader>
            <CardContent>
              <DeficitChart data={habilidadesComDefasagem} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Recomendações Pedagógicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habilidadesComDefasagem.map((hab) => (
                  <div key={hab.codigo} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-red-500 text-xl">⚠️</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-2">
                          {hab.codigo} - {hab.habilidade}
                        </h4>
                        <p className="text-red-800 text-sm mb-3">
                          Apenas {hab.percentualAcerto}% de acerto. {hab.erros} alunos precisam de reforço.
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm">
                            <strong>Sugestão:</strong> Desenvolver atividades específicas para esta habilidade, 
                            como exercícios de {hab.codigo === 'H03' ? 'interpretação indireta' : 
                            hab.codigo === 'H05' ? 'análise textual' : 'prática contextualizada'}.
                            Considere grupos de estudo e atenção individualizada.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Comparativo Temporal</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">👤 Resultados Individuais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultadosIndividuais.map((aluno, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{aluno.nome}</h4>
                        <p className="text-sm text-gray-600">{aluno.turma}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {aluno.percentual}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Nota: {aluno.nota}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-2">
                          ✅ Habilidades Dominadas:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {aluno.habilidadesCorretas.map(hab => (
                            <Badge key={hab} variant="secondary" className="bg-green-100 text-green-800">
                              {hab}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-red-700 mb-2">
                          ❌ Necessita Reforço:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {aluno.habilidadesErradas.map(hab => (
                            <Badge key={hab} variant="secondary" className="bg-red-100 text-red-800">
                              {hab}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
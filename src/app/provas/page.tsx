"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import saebData from "@/data/saeb.json";

interface Question {
  id: string;
  habilidade: string;
  enunciado: string;
  alternativas: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  gabarito: 'a' | 'b' | 'c' | 'd';
  explicacao: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
}

interface Prova {
  id: string;
  disciplina: string;
  ano: string;
  habilidades: string[];
  dificuldade: string;
  dataGeracao: string;
  questoes: Question[];
  gabarito: Record<string, string>;
}

export default function ProvasPage() {
  const [configuracao, setConfiguracao] = useState({
    disciplina: '',
    ano: '',
    quantidade: 10,
    dificuldade: 'medio' as 'facil' | 'medio' | 'dificil',
    habilidadesSelecionadas: [] as string[]
  });

  const [provaGerada, setProvaGerada] = useState<Prova | null>(null);
  const [gerando, setGerando] = useState(false);
  const [provasSalvas, setProvasSalvas] = useState<Prova[]>([]);
  const [visualizacao, setVisualizacao] = useState<'configurar' | 'preview' | 'lista'>('configurar');

  const disciplinas = [
    { value: "portugues", label: "Português" },
    { value: "matematica", label: "Matemática" }
  ];

  const anos = [
    { value: "3_ano", label: "3º Ano" },
    { value: "5_ano", label: "5º Ano" },
    { value: "9_ano", label: "9º Ano" },
    { value: "3_medio", label: "3º Ano Médio" }
  ];

  const getHabilidadesPorDisciplina = (disciplina: string) => {
    if (!disciplina) return [];
    
    try {
      const dados = saebData[disciplina as keyof typeof saebData];
      if (!dados) return [];
      
      const habilidades: any[] = [];
      Object.values(dados).forEach((categoria: any) => {
        if (Array.isArray(categoria)) {
          habilidades.push(...categoria);
        }
      });
      
      return habilidades;
    } catch (error) {
      console.error('Erro ao buscar habilidades SAEB:', error);
      return [];
    }
  };

  const handleGerarProva = async () => {
    if (!configuracao.disciplina || configuracao.habilidadesSelecionadas.length === 0) {
      alert('Selecione disciplina e pelo menos uma habilidade');
      return;
    }

    setGerando(true);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disciplina: configuracao.disciplina,
          habilidades: configuracao.habilidadesSelecionadas,
          quantidade: configuracao.quantidade,
          dificuldade: configuracao.dificuldade,
          ano: configuracao.ano
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProvaGerada(result.data.prova);
        setVisualizacao('preview');
      } else {
        alert(`Erro ao gerar prova: ${result.error}`);
      }
    } catch (error) {
      alert('Erro de conexão ao gerar prova');
      console.error(error);
    } finally {
      setGerando(false);
    }
  };

  const handleSalvarProva = () => {
    if (!provaGerada) return;
    
    setProvasSalvas([...provasSalvas, provaGerada]);
    alert('Prova salva com sucesso!');
    setVisualizacao('lista');
  };

  const handleToggleHabilidade = (codigo: string) => {
    setConfiguracao(prev => ({
      ...prev,
      habilidadesSelecionadas: prev.habilidadesSelecionadas.includes(codigo)
        ? prev.habilidadesSelecionadas.filter(h => h !== codigo)
        : [...prev.habilidadesSelecionadas, codigo]
    }));
  };

  const exportarParaPDF = () => {
    if (!provaGerada) return;
    
    let conteudoPDF = `PROVA DE ${configuracao.disciplina.toUpperCase()}\n\n`;
    conteudoPDF += `Ano: ${configuracao.ano} | Dificuldade: ${configuracao.dificuldade}\n`;
    conteudoPDF += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    provaGerada.questoes.forEach((questao, index) => {
      conteudoPDF += `${index + 1}. ${questao.enunciado}\n\n`;
      conteudoPDF += `a) ${questao.alternativas.a}\n`;
      conteudoPDF += `b) ${questao.alternativas.b}\n`;
      conteudoPDF += `c) ${questao.alternativas.c}\n`;
      conteudoPDF += `d) ${questao.alternativas.d}\n\n`;
    });
    
    // Criar download
    const blob = new Blob([conteudoPDF], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prova_${configuracao.disciplina}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const habilidadesDisponiveis = getHabilidadesPorDisciplina(configuracao.disciplina);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provas com IA</h1>
          <p className="text-gray-600 mt-2">
            Gere avaliações automaticamente baseadas nas habilidades do SAEB
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={visualizacao === 'configurar' ? 'default' : 'outline'}
            onClick={() => setVisualizacao('configurar')}
          >
            ⚙️ Configurar
          </Button>
          {provaGerada && (
            <Button
              variant={visualizacao === 'preview' ? 'default' : 'outline'}
              onClick={() => setVisualizacao('preview')}
            >
              👁️ Preview
            </Button>
          )}
          <Button
            variant={visualizacao === 'lista' ? 'default' : 'outline'}
            onClick={() => setVisualizacao('lista')}
          >
            📚 Provas ({provasSalvas.length})
          </Button>
        </div>
      </div>

      {visualizacao === 'configurar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuração Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Configuração da Prova
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Defina os parâmetros para geração automática da avaliação
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Configurações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Disciplina *</Label>
                    <Select 
                      value={configuracao.disciplina} 
                      onValueChange={(value) => {
                        setConfiguracao({
                          ...configuracao, 
                          disciplina: value,
                          habilidadesSelecionadas: []
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplinas.map(disc => (
                          <SelectItem key={disc.value} value={disc.value}>
                            {disc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Ano/Série</Label>
                    <Select 
                      value={configuracao.ano} 
                      onValueChange={(value) => setConfiguracao({...configuracao, ano: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {anos.map(ano => (
                          <SelectItem key={ano.value} value={ano.value}>
                            {ano.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Dificuldade</Label>
                    <Select 
                      value={configuracao.dificuldade} 
                      onValueChange={(value: 'facil' | 'medio' | 'dificil') => 
                        setConfiguracao({...configuracao, dificuldade: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">🟢 Fácil</SelectItem>
                        <SelectItem value="medio">🟡 Médio</SelectItem>
                        <SelectItem value="dificil">🔴 Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Quantidade de Questões</Label>
                    <Input
                      type="number"
                      min="5"
                      max="50"
                      value={configuracao.quantidade}
                      onChange={(e) => setConfiguracao({
                        ...configuracao, 
                        quantidade: parseInt(e.target.value) || 10
                      })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Entre 5 e 50 questões
                    </p>
                  </div>

                  <div>
                    <Label>Habilidades Selecionadas</Label>
                    <div className="p-3 border rounded-md bg-gray-50 min-h-[42px] flex items-center">
                      {configuracao.habilidadesSelecionadas.length === 0 ? (
                        <span className="text-gray-500 text-sm">Nenhuma selecionada</span>
                      ) : (
                        <span className="text-sm font-medium">
                          {configuracao.habilidadesSelecionadas.length} habilidade(s) selecionada(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    onClick={handleGerarProva}
                    disabled={gerando || !configuracao.disciplina || configuracao.habilidadesSelecionadas.length === 0}
                    size="lg"
                    className="px-8"
                  >
                    {gerando ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Gerando Prova com IA...
                      </>
                    ) : (
                      <>🤖 Gerar Prova com IA</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Habilidades SAEB */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Habilidades SAEB
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Selecione as competências a serem avaliadas
                </p>
              </CardHeader>
              <CardContent>
                {!configuracao.disciplina ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎯</div>
                    <p>Selecione uma disciplina para ver as habilidades SAEB</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {habilidadesDisponiveis.map((hab, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={hab.codigo}
                            checked={configuracao.habilidadesSelecionadas.includes(hab.codigo)}
                            onCheckedChange={() => handleToggleHabilidade(hab.codigo)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={hab.codigo} className="cursor-pointer">
                              <Badge variant="outline" className="mb-2">
                                {hab.codigo}
                              </Badge>
                              <p className="text-sm font-medium mb-1">
                                {hab.habilidade}
                              </p>
                              <p className="text-xs text-gray-600">
                                {hab.descricao}
                              </p>
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {configuracao.habilidadesSelecionadas.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Selecionadas ({configuracao.habilidadesSelecionadas.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {configuracao.habilidadesSelecionadas.map(codigo => (
                          <Badge key={codigo} variant="default" className="text-xs">
                            {codigo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {visualizacao === 'preview' && provaGerada && (
        <div className="space-y-6">
          {/* Header da Prova */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Prova de {disciplinas.find(d => d.value === provaGerada.disciplina)?.label}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>ID: {provaGerada.id}</span>
                    <span>•</span>
                    <span>Questões: {provaGerada.questoes.length}</span>
                    <span>•</span>
                    <span>Dificuldade: {provaGerada.dificuldade}</span>
                    <span>•</span>
                    <span>Gerada: {new Date(provaGerada.dataGeracao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportarParaPDF}>
                    📄 Exportar PDF
                  </Button>
                  <Button onClick={handleSalvarProva}>
                    💾 Salvar Prova
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Questões */}
          <div className="space-y-6">
            {provaGerada.questoes.map((questao, index) => (
              <Card key={questao.id}>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">Questão {index + 1}</Badge>
                      <Badge variant="outline">{questao.habilidade}</Badge>
                      <Badge variant={
                        questao.dificuldade === 'facil' ? 'secondary' :
                        questao.dificuldade === 'medio' ? 'default' : 'destructive'
                      }>
                        {questao.dificuldade}
                      </Badge>
                    </div>
                    <p className="text-gray-900 leading-relaxed">
                      {questao.enunciado}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {Object.entries(questao.alternativas).map(([letra, texto]) => (
                      <div 
                        key={letra}
                        className={`p-3 rounded-lg border ${
                          letra === questao.gabarito 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <span className="font-medium mr-3">{letra.toUpperCase()})</span>
                        {texto}
                        {letra === questao.gabarito && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            ✓ Correta
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                      💡 Ver Explicação
                    </summary>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">{questao.explicacao}</p>
                    </div>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gabarito */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📝 Gabarito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {provaGerada.questoes.map((questao, index) => (
                  <div 
                    key={questao.id}
                    className="text-center p-2 bg-gray-100 rounded"
                  >
                    <div className="text-xs text-gray-600">{index + 1}</div>
                    <div className="font-bold">{questao.gabarito.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {visualizacao === 'lista' && (
        <div>
          {provasSalvas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma prova salva</h3>
                <p className="text-gray-600 mb-4">
                  Gere sua primeira prova com IA baseada nas habilidades SAEB
                </p>
                <Button onClick={() => setVisualizacao('configurar')}>
                  🤖 Gerar Primeira Prova
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {provasSalvas.map((prova) => (
                <Card key={prova.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          Prova de {disciplinas.find(d => d.value === prova.disciplina)?.label}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{prova.questoes.length} questões</Badge>
                          <Badge variant={
                            prova.dificuldade === 'facil' ? 'secondary' :
                            prova.dificuldade === 'medio' ? 'default' : 'destructive'
                          }>
                            {prova.dificuldade}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Gerada em {new Date(prova.dataGeracao).toLocaleDateString('pt-BR')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-2">
                        Habilidades SAEB ({prova.habilidades.length}):
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {prova.habilidades.slice(0, 6).map(hab => (
                          <Badge key={hab} variant="secondary" className="text-xs">
                            {hab}
                          </Badge>
                        ))}
                        {prova.habilidades.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{prova.habilidades.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setProvaGerada(prova);
                          setVisualizacao('preview');
                        }}
                      >
                        👁️ Ver
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            📄 PDF
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Exportar Prova</AlertDialogTitle>
                            <AlertDialogDescription>
                              A prova será baixada como arquivo de texto. Você pode copiar o conteúdo para um editor de texto ou PDF.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction onClick={() => {
                              setProvaGerada(prova);
                              exportarParaPDF();
                            }}>
                              Baixar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
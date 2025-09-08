"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import bnccData from "@/data/bncc.json";

interface PlanoAula {
  id: string;
  disciplina: string;
  ano: string;
  titulo: string;
  objetivo: string;
  habilidades: string[];
  conteudo: string;
  metodologia: string;
  recursos: string;
  avaliacao: string;
  duracao: string;
  dataCriacao: string;
}

export default function PlanejamentoPage() {
  const [planoAtual, setPlanoAtual] = useState<Partial<PlanoAula>>({});
  const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState<string[]>([]);
  const [planosSalvos, setPlanosSalvos] = useState<PlanoAula[]>([]);
  const [modoVisualizacao, setModoVisualizacao] = useState<'criar' | 'lista'>('criar');

  // Opções disponíveis
  const disciplinas = [
    { value: "lingua_portuguesa", label: "Língua Portuguesa" },
    { value: "matematica", label: "Matemática" },
  ];

  const anos = [
    { value: "1_ano", label: "1º Ano" },
    { value: "2_ano", label: "2º Ano" },
    { value: "3_ano", label: "3º Ano" },
    { value: "4_ano", label: "4º Ano" },
    { value: "5_ano", label: "5º Ano" },
  ];

  const getHabilidadesPorDisciplinaAno = (disciplina: string, ano: string) => {
    if (!disciplina || !ano) return [];
    
    try {
      const area = disciplina === 'lingua_portuguesa' ? 'linguagens' : 'matematica';
      const componente = disciplina === 'lingua_portuguesa' ? 'lingua_portuguesa' : null;
      
      let habilidades: any[] = [];
      
      if (area === 'linguagens' && componente) {
        const dadosAno = (bnccData.areas.linguagens.componentes as any)[componente]?.anos[ano];
        if (dadosAno?.unidades_tematicas) {
          dadosAno.unidades_tematicas.forEach((ut: any) => {
            habilidades = habilidades.concat(ut.habilidades || []);
          });
        }
      } else if (area === 'matematica') {
        const dadosAno = (bnccData.areas.matematica as any).anos[ano];
        if (dadosAno?.unidades_tematicas) {
          dadosAno.unidades_tematicas.forEach((ut: any) => {
            habilidades = habilidades.concat(ut.habilidades || []);
          });
        }
      }
      
      return habilidades;
    } catch (error) {
      console.error('Erro ao buscar habilidades:', error);
      return [];
    }
  };

  const handleSalvarPlano = () => {
    if (!planoAtual.titulo || !planoAtual.disciplina || !planoAtual.ano) {
      alert('Preencha os campos obrigatórios: Título, Disciplina e Ano');
      return;
    }

    const novoPlano: PlanoAula = {
      id: Date.now().toString(),
      titulo: planoAtual.titulo || '',
      disciplina: planoAtual.disciplina || '',
      ano: planoAtual.ano || '',
      objetivo: planoAtual.objetivo || '',
      habilidades: habilidadesSelecionadas,
      conteudo: planoAtual.conteudo || '',
      metodologia: planoAtual.metodologia || '',
      recursos: planoAtual.recursos || '',
      avaliacao: planoAtual.avaliacao || '',
      duracao: planoAtual.duracao || '',
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    };

    setPlanosSalvos([...planosSalvos, novoPlano]);
    
    // Limpar formulário
    setPlanoAtual({});
    setHabilidadesSelecionadas([]);
    
    alert('Plano de aula salvo com sucesso!');
    setModoVisualizacao('lista');
  };

  const toggleHabilidade = (codigo: string) => {
    setHabilidadesSelecionadas(prev => 
      prev.includes(codigo) 
        ? prev.filter(h => h !== codigo)
        : [...prev, codigo]
    );
  };

  const habilidadesDisponiveis = getHabilidadesPorDisciplinaAno(
    planoAtual.disciplina || '', 
    planoAtual.ano || ''
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planejamento BNCC</h1>
          <p className="text-gray-600 mt-2">
            Crie planos de aula alinhados às habilidades da Base Nacional Comum Curricular
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={modoVisualizacao === 'criar' ? 'default' : 'outline'}
            onClick={() => setModoVisualizacao('criar')}
          >
            ➕ Criar Plano
          </Button>
          <Button
            variant={modoVisualizacao === 'lista' ? 'default' : 'outline'}
            onClick={() => setModoVisualizacao('lista')}
          >
            📋 Meus Planos ({planosSalvos.length})
          </Button>
        </div>
      </div>

      {modoVisualizacao === 'criar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="disciplina">Disciplina *</Label>
                    <Select 
                      value={planoAtual.disciplina || ""} 
                      onValueChange={(value) => {
                        setPlanoAtual({...planoAtual, disciplina: value});
                        setHabilidadesSelecionadas([]);
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
                    <Label htmlFor="ano">Ano Escolar *</Label>
                    <Select 
                      value={planoAtual.ano || ""} 
                      onValueChange={(value) => {
                        setPlanoAtual({...planoAtual, ano: value});
                        setHabilidadesSelecionadas([]);
                      }}
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
                    <Label htmlFor="duracao">Duração</Label>
                    <Select 
                      value={planoAtual.duracao || ""} 
                      onValueChange={(value) => setPlanoAtual({...planoAtual, duracao: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Duração..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50min">50 minutos</SelectItem>
                        <SelectItem value="100min">100 minutos (2 aulas)</SelectItem>
                        <SelectItem value="150min">150 minutos (3 aulas)</SelectItem>
                        <SelectItem value="semanal">1 semana</SelectItem>
                        <SelectItem value="quinzenal">15 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="titulo">Título do Plano *</Label>
                  <Input
                    id="titulo"
                    value={planoAtual.titulo || ""}
                    onChange={(e) => setPlanoAtual({...planoAtual, titulo: e.target.value})}
                    placeholder="Ex: Interpretação de Textos Narrativos"
                  />
                </div>

                <div>
                  <Label htmlFor="objetivo">Objetivo Geral</Label>
                  <Textarea
                    id="objetivo"
                    value={planoAtual.objetivo || ""}
                    onChange={(e) => setPlanoAtual({...planoAtual, objetivo: e.target.value})}
                    placeholder="Descreva o objetivo principal desta aula..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Conteúdo e Metodologia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="conteudo">Conteúdo Programático</Label>
                  <Textarea
                    id="conteudo"
                    value={planoAtual.conteudo || ""}
                    onChange={(e) => setPlanoAtual({...planoAtual, conteudo: e.target.value})}
                    placeholder="Liste os temas e conceitos que serão abordados..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="metodologia">Metodologia e Estratégias</Label>
                  <Textarea
                    id="metodologia"
                    value={planoAtual.metodologia || ""}
                    onChange={(e) => setPlanoAtual({...planoAtual, metodologia: e.target.value})}
                    placeholder="Descreva as estratégias pedagógicas, atividades e dinâmicas..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="recursos">Recursos Necessários</Label>
                  <Input
                    id="recursos"
                    value={planoAtual.recursos || ""}
                    onChange={(e) => setPlanoAtual({...planoAtual, recursos: e.target.value})}
                    placeholder="Ex: Quadro, projetor, textos impressos, jogos..."
                  />
                </div>

                <div>
                  <Label htmlFor="avaliacao">Avaliação</Label>
                  <Textarea
                    id="avaliacao"
                    value={planoAtual.avaliacao || ""}
                    onChange={(e) => setPlanoAtual({...planoAtual, avaliacao: e.target.value})}
                    placeholder="Como os alunos serão avaliados? Critérios e instrumentos..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Habilidades BNCC */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Habilidades BNCC
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Selecione as habilidades que serão desenvolvidas
                </p>
              </CardHeader>
              <CardContent>
                {!planoAtual.disciplina || !planoAtual.ano ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎓</div>
                    <p>Selecione disciplina e ano para ver as habilidades disponíveis</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {habilidadesDisponiveis.map((habilidade, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          habilidadesSelecionadas.includes(habilidade.codigo)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleHabilidade(habilidade.codigo)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={habilidadesSelecionadas.includes(habilidade.codigo) ? 'default' : 'secondary'}>
                            {habilidade.codigo}
                          </Badge>
                          <div className="text-right">
                            {habilidadesSelecionadas.includes(habilidade.codigo) && 
                              <span className="text-blue-500 text-sm">✓</span>
                            }
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {habilidade.descricao}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {habilidadesSelecionadas.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Habilidades Selecionadas ({habilidadesSelecionadas.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {habilidadesSelecionadas.map(codigo => (
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

            <Button 
              onClick={handleSalvarPlano} 
              className="w-full mt-4" 
              size="lg"
              disabled={!planoAtual.titulo || !planoAtual.disciplina || !planoAtual.ano}
            >
              💾 Salvar Plano de Aula
            </Button>
          </div>
        </div>
      ) : (
        /* Lista de Planos Salvos */
        <div>
          {planosSalvos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Nenhum plano criado ainda</h3>
                <p className="text-gray-600 mb-4">
                  Comece criando seu primeiro plano de aula baseado na BNCC
                </p>
                <Button onClick={() => setModoVisualizacao('criar')}>
                  ➕ Criar Primeiro Plano
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planosSalvos.map((plano) => (
                <Card key={plano.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{plano.titulo}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">
                            {disciplinas.find(d => d.value === plano.disciplina)?.label}
                          </Badge>
                          <Badge variant="outline">
                            {anos.find(a => a.value === plano.ano)?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Criado em {plano.dataCriacao}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {plano.objetivo && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold mb-1">Objetivo:</h4>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {plano.objetivo}
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-2">
                        Habilidades BNCC ({plano.habilidades.length}):
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {plano.habilidades.slice(0, 6).map(hab => (
                          <Badge key={hab} variant="secondary" className="text-xs">
                            {hab}
                          </Badge>
                        ))}
                        {plano.habilidades.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{plano.habilidades.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {plano.duracao && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        ⏱️ Duração: {plano.duracao}
                      </div>
                    )}
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
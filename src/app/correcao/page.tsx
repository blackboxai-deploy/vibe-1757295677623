"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Resultado {
  questao: number;
  resposta: string;
  gabarito: string;
  correto: boolean;
}

interface AlunoCorrecao {
  id: string;
  nome: string;
  turma: string;
  prova: string;
  resultados: Resultado[];
  nota: number;
  percentual: number;
  dataCorrecao: string;
}

export default function CorrecaoPage() {
  const [modoAtivo, setModoAtivo] = useState<'selecionar' | 'camera' | 'resultados'>('selecionar');
  const [imagemCapturada, setImagemCapturada] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);
  const [gabarito, setGabarito] = useState<Record<number, string>>({});
  const [nomeAluno, setNomeAluno] = useState('');
  const [turmaAluno, setTurmaAluno] = useState('');
  const [provaId, setProvaId] = useState('');
  const [resultadosCorrecao, setResultadosCorrecao] = useState<AlunoCorrecao[]>([]);
  const [mostrarCamera, setMostrarCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configurar câmera
  const iniciarCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Câmera traseira
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMostrarCamera(true);
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar câmera. Verifique as permissões.');
    }
  }, []);

  const pararCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setMostrarCamera(false);
    }
  }, []);

  const capturarImagem = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    // Ajustar tamanho do canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Capturar frame do vídeo
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Converter para base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setImagemCapturada(imageData);
    
    pararCamera();
    setModoAtivo('resultados');
  }, [pararCamera]);

  const processarCartaoResposta = async (_imageData: string) => {
    setProcessando(true);
    
    try {
      // Simular processamento OCR
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular leitura das marcações (exemplo com 10 questões)
      const respostasDetectadas: Record<number, string> = {};
      
      for (let i = 1; i <= Object.keys(gabarito).length; i++) {
        // Simular detecção aleatória das marcações
        const opcoes = ['a', 'b', 'c', 'd'];
        respostasDetectadas[i] = opcoes[Math.floor(Math.random() * opcoes.length)];
      }
      
      // Calcular correção
      const resultados: Resultado[] = [];
      let acertos = 0;
      
      Object.keys(gabarito).forEach(questaoStr => {
        const questao = parseInt(questaoStr);
        const resposta = respostasDetectadas[questao];
        const gabaritoCorreto = gabarito[questao];
        const correto = resposta === gabaritoCorreto;
        
        if (correto) acertos++;
        
        resultados.push({
          questao,
          resposta,
          gabarito: gabaritoCorreto,
          correto
        });
      });
      
      const totalQuestoes = Object.keys(gabarito).length;
      const percentual = Math.round((acertos / totalQuestoes) * 100);
      
      const novaCorrecao: AlunoCorrecao = {
        id: Date.now().toString(),
        nome: nomeAluno,
        turma: turmaAluno,
        prova: provaId,
        resultados,
        nota: acertos,
        percentual,
        dataCorrecao: new Date().toLocaleDateString('pt-BR')
      };
      
      setResultadosCorrecao(prev => [...prev, novaCorrecao]);
      
      // Limpar formulário
      setNomeAluno('');
      setTurmaAluno('');
      setImagemCapturada(null);
      
    } catch (error) {
      console.error('Erro no processamento:', error);
      alert('Erro ao processar cartão resposta');
    } finally {
      setProcessando(false);
    }
  };

  const handleUploadImagem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setImagemCapturada(imageData);
      setModoAtivo('resultados');
    };
    reader.readAsDataURL(file);
  };

  const configurarGabarito = () => {
    // Exemplo: configurar gabarito para 10 questões
    const novoGabarito: Record<number, string> = {};
    for (let i = 1; i <= 10; i++) {
      novoGabarito[i] = ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)];
    }
    setGabarito(novoGabarito);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Correção Automática</h1>
          <p className="text-gray-600 mt-2">
            Corrija provas automaticamente através da leitura do cartão resposta
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={modoAtivo === 'selecionar' ? 'default' : 'outline'}
            onClick={() => setModoAtivo('selecionar')}
          >
            ⚙️ Configurar
          </Button>
          <Button
            variant={modoAtivo === 'camera' ? 'default' : 'outline'}
            onClick={() => setModoAtivo('camera')}
            disabled={Object.keys(gabarito).length === 0}
          >
            📷 Câmera
          </Button>
          <Button
            variant={modoAtivo === 'resultados' ? 'default' : 'outline'}
            onClick={() => setModoAtivo('resultados')}
          >
            📊 Resultados ({resultadosCorrecao.length})
          </Button>
        </div>
      </div>

      {modoAtivo === 'selecionar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuração do Gabarito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Configuração do Gabarito
              </CardTitle>
              <p className="text-sm text-gray-600">
                Configure o gabarito da prova que será corrigida
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provaId">ID ou Nome da Prova</Label>
                <Input
                  id="provaId"
                  value={provaId}
                  onChange={(e) => setProvaId(e.target.value)}
                  placeholder="Ex: Prova_Matematica_5ano_2024"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={configurarGabarito}
                  variant="outline"
                  className="flex-1"
                >
                  🎯 Gerar Gabarito Exemplo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 Carregar Gabarito
                </Button>
              </div>

              {Object.keys(gabarito).length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Gabarito Configurado ({Object.keys(gabarito).length} questões):
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(gabarito).map(([questao, resposta]) => (
                      <div key={questao} className="text-center p-2 bg-gray-100 rounded">
                        <div className="text-xs text-gray-600">{questao}</div>
                        <div className="font-bold">{resposta.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ℹ️ Como Usar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Configure o Gabarito</p>
                    <p className="text-sm text-gray-600">
                      Defina as respostas corretas para cada questão da prova
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Capture o Cartão Resposta</p>
                    <p className="text-sm text-gray-600">
                      Use a câmera para fotografar o cartão resposta preenchido pelo aluno
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Correção Automática</p>
                    <p className="text-sm text-gray-600">
                      O sistema processa a imagem e gera automaticamente o resultado
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Visualize Relatórios</p>
                    <p className="text-sm text-gray-600">
                      Acesse gráficos e análises de desempenho por habilidade
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Dica:</strong> Para melhor precisão, certifique-se de que o cartão resposta 
                  esteja bem iluminado e sem dobras. Posicione a câmera diretamente sobre o cartão.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}

      {modoAtivo === 'camera' && (
        <div className="space-y-6">
          {/* Dados do Aluno */}
          <Card>
            <CardHeader>
              <CardTitle>👤 Dados do Aluno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nomeAluno">Nome do Aluno *</Label>
                  <Input
                    id="nomeAluno"
                    value={nomeAluno}
                    onChange={(e) => setNomeAluno(e.target.value)}
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="turmaAluno">Turma</Label>
                  <Input
                    id="turmaAluno"
                    value={turmaAluno}
                    onChange={(e) => setTurmaAluno(e.target.value)}
                    placeholder="Ex: 5º A"
                  />
                </div>
                <div>
                  <Label>Prova</Label>
                  <Input value={provaId} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interface da Câmera */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📷 Captura do Cartão Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!mostrarCamera && !imagemCapturada && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-xl font-semibold mb-2">Iniciar Captura</h3>
                  <p className="text-gray-600 mb-6">
                    Clique no botão abaixo para abrir a câmera e fotografar o cartão resposta
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={iniciarCamera} size="lg">
                      📸 Abrir Câmera
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📁 Upload Imagem
                    </Button>
                  </div>
                </div>
              )}

              {mostrarCamera && (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-h-96 object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-dashed border-white opacity-50 m-8"></div>
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      Posicione o cartão resposta dentro da área marcada
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button onClick={capturarImagem} size="lg">
                      📸 Capturar Imagem
                    </Button>
                    <Button onClick={pararCamera} variant="outline" size="lg">
                      ❌ Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {imagemCapturada && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Imagem Capturada</h3>
                    <img 
                      src={imagemCapturada} 
                      alt="Cartão resposta capturado" 
                      className="max-w-full max-h-96 mx-auto rounded-lg border"
                    />
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => processarCartaoResposta(imagemCapturada)}
                      disabled={processando || !nomeAluno}
                      size="lg"
                    >
                      {processando ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Processando OCR...
                        </>
                      ) : (
                        <>🔍 Processar Correção</>
                      )}
                    </Button>
                    <Button 
                      onClick={() => {
                        setImagemCapturada(null);
                        setModoAtivo('camera');
                      }}
                      variant="outline" 
                      size="lg"
                    >
                      🔄 Nova Captura
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Canvas oculto para captura */}
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadImagem}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {modoAtivo === 'resultados' && (
        <div className="space-y-6">
          {resultadosCorrecao.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma correção realizada</h3>
                <p className="text-gray-600 mb-4">
                  Configure o gabarito e comece a corrigir cartões resposta com a câmera
                </p>
                <Button onClick={() => setModoAtivo('selecionar')}>
                  ⚙️ Começar Configuração
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>📋 Resultados das Correções</CardTitle>
                <p className="text-sm text-gray-600">
                  {resultadosCorrecao.length} aluno(s) corrigido(s)
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Prova</TableHead>
                        <TableHead>Nota</TableHead>
                        <TableHead>Percentual</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultadosCorrecao.map((resultado) => (
                        <TableRow key={resultado.id}>
                          <TableCell className="font-medium">
                            {resultado.nome}
                          </TableCell>
                          <TableCell>{resultado.turma}</TableCell>
                          <TableCell>{resultado.prova}</TableCell>
                          <TableCell>
                            {resultado.nota}/{resultado.resultados.length}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                resultado.percentual >= 70 ? 'default' :
                                resultado.percentual >= 50 ? 'secondary' : 'destructive'
                              }
                            >
                              {resultado.percentual}%
                            </Badge>
                          </TableCell>
                          <TableCell>{resultado.dataCorrecao}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              ✓ Processado
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
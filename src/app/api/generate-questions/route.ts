import { NextRequest, NextResponse } from 'next/server';

interface QuestionRequest {
  disciplina: 'portugues' | 'matematica';
  habilidades: string[];
  quantidade: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  ano: string;
}

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

// Templates de questões por habilidade SAEB
const questionTemplates = {
  portugues: {
    H01: {
      facil: [
        {
          pattern: "Leia o texto e responda: [TEXTO_CURTO] Onde acontece a história?",
          alternatives: ["Na escola", "Em casa", "No parque", "Na rua"],
          explanation: "A informação sobre o local está explícita no texto."
        },
        {
          pattern: "No texto '[TEXTO_CURTO]', qual é o nome do personagem principal?",
          alternatives: ["João", "Maria", "Pedro", "Ana"],
          explanation: "O nome do personagem está claramente mencionado no início do texto."
        }
      ],
      medio: [
        {
          pattern: "Segundo o texto, [CONTEXTO], qual informação pode ser encontrada diretamente?",
          alternatives: ["Dado A", "Dado B", "Dado C", "Dado D"],
          explanation: "Esta informação está explicitamente declarada no segundo parágrafo."
        }
      ],
      dificil: [
        {
          pattern: "Com base na leitura completa do texto, identifique qual das seguintes informações está explicitamente apresentada:",
          alternatives: ["Informação complexa A", "Informação complexa B", "Informação complexa C", "Informação complexa D"],
          explanation: "Embora o texto seja mais complexo, esta informação está diretamente mencionada."
        }
      ]
    },
    H02: {
      facil: [
        {
          pattern: "No contexto da frase '[FRASE]', a palavra '[PALAVRA]' significa:",
          alternatives: ["Significado A", "Significado B", "Significado C", "Significado D"],
          explanation: "O contexto da frase nos ajuda a entender o significado da palavra."
        }
      ],
      medio: [
        {
          pattern: "Na expressão '[EXPRESSAO]' usada no texto, o sentido é de:",
          alternatives: ["Sentido A", "Sentido B", "Sentido C", "Sentido D"],
          explanation: "O contexto em que a expressão é utilizada indica este significado."
        }
      ]
    },
    H03: {
      facil: [
        {
          pattern: "O que podemos concluir sobre [PERSONAGEM] a partir de suas ações no texto?",
          alternatives: ["Característica A", "Característica B", "Característica C", "Característica D"],
          explanation: "As ações do personagem nos permitem inferir esta característica."
        }
      ]
    },
    H04: {
      facil: [
        {
          pattern: "O assunto principal do texto é:",
          alternatives: ["Tema A", "Tema B", "Tema C", "Tema D"],
          explanation: "Todo o texto gira em torno deste tema central."
        }
      ]
    }
  },
  matematica: {
    H01: {
      facil: [
        {
          pattern: "No número [NUMERO], o algarismo [ALGARISMO] ocupa a posição das:",
          alternatives: ["unidades", "dezenas", "centenas", "unidades de milhar"],
          explanation: "Analisando o valor posicional no sistema decimal."
        }
      ],
      medio: [
        {
          pattern: "O número [NUMERO_GRANDE] pode ser decomposto como:",
          alternatives: ["Decomposição A", "Decomposição B", "Decomposição C", "Decomposição D"],
          explanation: "Cada posição representa uma potência de 10."
        }
      ]
    },
    H02: {
      facil: [
        {
          pattern: "Na reta numérica, o número [NUMERO] está localizado entre:",
          alternatives: ["[A] e [B]", "[C] e [D]", "[E] e [F]", "[G] e [H]"],
          explanation: "Comparando com os números vizinhos na reta."
        }
      ]
    },
    H04: {
      facil: [
        {
          pattern: "[NOME] tinha [QTD1] [OBJETO]. Ganhou mais [QTD2]. Com quantos [OBJETO] ficou?",
          alternatives: ["[RESULTADO1]", "[RESULTADO2]", "[RESULTADO3]", "[RESULTADO4]"],
          explanation: "Situação de adição: [QTD1] + [QTD2] = [RESULTADO_CORRETO]"
        }
      ],
      medio: [
        {
          pattern: "Em uma escola há [QTD1] salas com [QTD2] alunos cada uma. Quantos alunos há no total?",
          alternatives: ["[RESULTADO1]", "[RESULTADO2]", "[RESULTADO3]", "[RESULTADO4]"],
          explanation: "Multiplicação: [QTD1] × [QTD2] = [RESULTADO_CORRETO]"
        }
      ]
    },
    H11: {
      facil: [
        {
          pattern: "O perímetro de um retângulo com [LARGURA] cm de largura e [ALTURA] cm de altura é:",
          alternatives: ["[RESULTADO1] cm", "[RESULTADO2] cm", "[RESULTADO3] cm", "[RESULTADO4] cm"],
          explanation: "Perímetro = 2 × (largura + altura) = 2 × ([LARGURA] + [ALTURA]) = [RESULTADO_CORRETO] cm"
        }
      ]
    }
  }
};

// Função para gerar questões baseadas em templates
function generateQuestionsFromTemplates(params: QuestionRequest): Question[] {
  const questions: Question[] = [];
  const templates = questionTemplates[params.disciplina];
  
  let questionId = 1;
  
  for (const habilidade of params.habilidades) {
    const habilidadeTemplates = templates[habilidade as keyof typeof templates];
    
    if (!habilidadeTemplates) continue;
    
    const difficultyKey = params.dificuldade as keyof typeof habilidadeTemplates;
    const difficultyTemplates = habilidadeTemplates[difficultyKey];
    if (!difficultyTemplates) continue;
    
    const questionsPerHabilidade = Math.ceil(params.quantidade / params.habilidades.length);
    
    for (let i = 0; i < questionsPerHabilidade && questions.length < params.quantidade; i++) {
      const template = difficultyTemplates[i % difficultyTemplates.length];
      
      // Gerar valores aleatórios para preenchimento
      const valores = generateRandomValues(params.disciplina, habilidade, params.dificuldade);
      let enunciado = template.pattern;
      let alternativas = [...template.alternatives];
      let explicacao = template.explanation;
      
      // Substituir placeholders
      Object.entries(valores).forEach(([key, value]) => {
        const placeholder = `[${key.toUpperCase()}]`;
        enunciado = enunciado.replace(new RegExp(placeholder, 'g'), value.toString());
        explicacao = explicacao.replace(new RegExp(placeholder, 'g'), value.toString());
        
        alternativas = alternativas.map(alt => 
          alt.replace(new RegExp(placeholder, 'g'), value.toString())
        );
      });
      
      // Determinar gabarito (primeira alternativa correta por padrão)
      const gabarito = Math.random() < 0.7 ? 'a' : ['b', 'c', 'd'][Math.floor(Math.random() * 3)];
      
      // Se gabarito não for 'a', trocar posições
      if (gabarito !== 'a') {
        const temp = alternativas[0];
        alternativas[0] = alternativas[gabarito.charCodeAt(0) - 97];
        alternativas[gabarito.charCodeAt(0) - 97] = temp;
      }
      
      questions.push({
        id: `Q${questionId.toString().padStart(3, '0')}`,
        habilidade,
        enunciado,
        alternativas: {
          a: alternativas[0],
          b: alternativas[1],
          c: alternativas[2],
          d: alternativas[3]
        },
        gabarito: 'a', // Sempre 'a' após reorganização
        explicacao,
        dificuldade: params.dificuldade
      });
      
      questionId++;
    }
  }
  
  return questions.slice(0, params.quantidade);
}

// Gerar valores aleatórios para diferentes tipos de questões
function generateRandomValues(disciplina: string, _habilidade: string, dificuldade: string): Record<string, any> {
  const valores: Record<string, any> = {};
  
  if (disciplina === 'matematica') {
    // Gerar números baseados na dificuldade
    const range = dificuldade === 'facil' ? [1, 50] : 
                  dificuldade === 'medio' ? [10, 500] : [50, 9999];
    
    valores.numero = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    valores.numero_grande = Math.floor(Math.random() * 8999) + 1000;
    valores.qtd1 = Math.floor(Math.random() * 20) + 5;
    valores.qtd2 = Math.floor(Math.random() * 15) + 3;
    valores.largura = Math.floor(Math.random() * 20) + 3;
    valores.altura = Math.floor(Math.random() * 15) + 4;
    
    // Calcular resultados corretos
    valores.resultado_correto = valores.qtd1 + valores.qtd2;
    
    // Gerar alternativas incorretas
    const correto = valores.resultado_correto;
    valores.resultado1 = correto;
    valores.resultado2 = correto + Math.floor(Math.random() * 5) + 1;
    valores.resultado3 = correto - Math.floor(Math.random() * 5) - 1;
    valores.resultado4 = correto + Math.floor(Math.random() * 10) + 6;
    
    // Algarismos
    valores.algarismo = valores.numero.toString()[Math.floor(Math.random() * valores.numero.toString().length)];
  } else {
    // Português
    const nomes = ['Ana', 'João', 'Maria', 'Pedro', 'Lucas', 'Sofia'];
    const objetos = ['livros', 'brinquedos', 'figurinhas', 'lápis', 'canetas'];
    const textos = [
      'Era uma vez uma menina chamada Clara que morava em uma casa azul.',
      'O gato subiu no telhado para pegar um pássaro.',
      'Na escola, os alunos estavam muito animados para a festa junina.'
    ];
    
    valores.nome = nomes[Math.floor(Math.random() * nomes.length)];
    valores.objeto = objetos[Math.floor(Math.random() * objetos.length)];
    valores.texto_curto = textos[Math.floor(Math.random() * textos.length)];
    valores.personagem = valores.nome;
    valores.palavra = ['casa', 'azul', 'animados', 'festa'][Math.floor(Math.random() * 4)];
    valores.frase = 'A menina estava muito feliz com o presente.';
  }
  
  return valores;
}

export async function POST(request: NextRequest) {
  try {
    const params: QuestionRequest = await request.json();
    
    // Validações
    if (!params.disciplina || !params.habilidades || params.habilidades.length === 0) {
      return NextResponse.json(
        { error: 'Disciplina e habilidades são obrigatórias' },
        { status: 400 }
      );
    }
    
    if (!params.quantidade || params.quantidade < 1 || params.quantidade > 50) {
      return NextResponse.json(
        { error: 'Quantidade deve ser entre 1 e 50' },
        { status: 400 }
      );
    }
    
    // Simular delay de processamento IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Gerar questões
    const questions = generateQuestionsFromTemplates(params);
    
    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível gerar questões para as habilidades selecionadas' },
        { status: 422 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        prova: {
          id: `PROVA_${Date.now()}`,
          disciplina: params.disciplina,
          ano: params.ano,
          habilidades: params.habilidades,
          dificuldade: params.dificuldade,
          dataGeracao: new Date().toISOString(),
          questoes: questions,
          gabarito: questions.reduce((acc, q) => ({
            ...acc,
            [q.id]: q.gabarito
          }), {} as Record<string, string>)
        }
      },
      message: `Prova gerada com sucesso! ${questions.length} questões criadas.`
    });
    
  } catch (error) {
    console.error('Erro ao gerar questões:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor ao gerar questões',
        details: typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
import React, { useState } from 'react';
import { ExternalLink, ChevronRight, BookOpen, Target, TrendingUp, Sparkles, Users, BarChart2, Database, Lightbulb, CheckCircle, ArrowRight, X, Settings, Filter, PieChart } from 'lucide-react';

const TutorialPage = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<number | null>(null);

  const steps = [
    {
      number: '1',
      title: 'Acesse a área de Datasets',
      description: 'No menu principal do HubSpot, navegue até:',
      path: 'Relatórios → Gerenciamento de dados → Conjuntos de dados',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '2', 
      title: 'Inicie um novo Dataset',
      description: 'Clique no botão "Criar conjunto de dados" no canto superior direito da página.',
      color: 'from-green-500 to-green-600'
    },
    {
      number: '3',
      title: 'Selecione as fontes de dados',
      description: 'Escolha até 5 objetos do CRM como fontes para seu dataset:',
      items: [
        'Escolha Contatos como fonte primária para analisar seus leads enriquecidos',
        'Adicione Empresas se quiser correlacionar os leads com suas empresas',
        'Inclua Negócios para análises de conversão e receita',
        'Opcionalmente adicione Tickets ou Produtos se relevante'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '4',
      title: 'Adicione propriedades',
      description: 'Selecione as propriedades que deseja incluir no dataset:',
      items: [
        'Para contatos enriquecidos, inclua Nome, Empresa, Cargo e as propriedades personalizadas Especialidade e Grau',
        'Da fonte Empresas, inclua Nome da empresa, Setor, Tamanho da empresa, etc.',
        'De Negócios, adicione Valor, Fase, Data de fechamento, etc.'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      number: '5',
      title: 'Salve e nomeie seu dataset',
      description: 'Dê um nome descritivo ao seu conjunto de dados, como "Leads Enriquecidos - Análise de Conversão" e clique em "Salvar".',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const useCases = [
    {
      title: 'Análise de Conversão por Especialidade',
      description: 'Crie um relatório que mostra a taxa de conversão de leads para clientes, segmentando por especialidade profissional identificada pela IA.',
      color: 'from-blue-500 to-blue-600',
      icon: TrendingUp,
      details: {
        objective: 'Identificar quais especialidades profissionais convertem melhor em clientes para otimizar campanhas de marketing.',
        chartType: 'Gráfico de Barras ou Funil',
        dimensions: [
          { name: 'Especialidade', description: 'Campo personalizado criado pela IA (Marketing, Vendas, TI, RH, etc.)', source: 'Contatos' },
          { name: 'Mês/Ano', description: 'Data de criação do lead', source: 'Contatos' }
        ],
        metrics: [
          { name: 'Taxa de Conversão', description: 'Fórmula: (Negócios Fechados / Total de Leads) * 100', calculation: 'Campo calculado' },
          { name: 'Total de Leads', description: 'Contagem de contatos por especialidade', calculation: 'COUNT(Contatos)' },
          { name: 'Negócios Criados', description: 'Número de oportunidades abertas', calculation: 'COUNT(Negócios)' },
          { name: 'Valor Médio do Negócio', description: 'Receita média por especialidade', calculation: 'AVG(Valor do Negócio)' }
        ],
        filters: [
          'Lifecycle Stage = "Lead" ou "Customer"',
          'Data de criação nos últimos 12 meses',
          'Especialidade não está vazia'
        ],
        insights: [
          'Especialidades com maior taxa de conversão',
          'Valor médio de negócio por área profissional',
          'Tendências sazonais de conversão',
          'ROI por especialidade para otimização de budget'
        ]
      }
    },
    {
      title: 'Distribuição de Leads por Grau de Senioridade',
      description: 'Visualize como seus leads estão distribuídos entre diferentes níveis hierárquicos (Junior, Senior, C-Level) para otimizar abordagens.',
      color: 'from-green-500 to-green-600',
      icon: Users,
      details: {
        objective: 'Entender a distribuição hierárquica dos leads para personalizar estratégias de abordagem e pricing.',
        chartType: 'Gráfico de Pizza ou Donut',
        dimensions: [
          { name: 'Grau de Senioridade', description: 'Campo criado pela IA (Junior, Pleno, Senior, Gerente, Diretor, C-Level)', source: 'Contatos' },
          { name: 'Setor da Empresa', description: 'Categoria da indústria', source: 'Empresas' }
        ],
        metrics: [
          { name: 'Quantidade de Leads', description: 'Total de contatos por nível hierárquico', calculation: 'COUNT(Contatos)' },
          { name: 'Percentual por Nível', description: 'Distribuição percentual', calculation: '(COUNT por nível / COUNT total) * 100' },
          { name: 'Lead Score Médio', description: 'Pontuação média por senioridade', calculation: 'AVG(Lead Score)' },
          { name: 'Tempo Médio de Conversão', description: 'Dias até primeira compra', calculation: 'AVG(Data primeira compra - Data criação)' }
        ],
        filters: [
          'Grau de Senioridade não está vazio',
          'Lifecycle Stage = "Lead", "MQL", "SQL"',
          'Data de criação nos últimos 6 meses'
        ],
        insights: [
          'Perfil hierárquico predominante dos leads',
          'Níveis com maior propensão à compra',
          'Estratégias de pricing por senioridade',
          'Canais de aquisição mais efetivos por nível'
        ]
      }
    },
    {
      title: 'Performance de Campanhas por Segmento',
      description: 'Compare o desempenho de diferentes campanhas de marketing baseado nas especialidades e senioridade dos leads capturados.',
      color: 'from-purple-500 to-purple-600',
      icon: BarChart2,
      details: {
        objective: 'Otimizar campanhas de marketing identificando quais geram leads de maior qualidade por segmento profissional.',
        chartType: 'Gráfico de Barras Agrupadas ou Matriz',
        dimensions: [
          { name: 'Campanha Original', description: 'Fonte da primeira interação', source: 'Contatos' },
          { name: 'Especialidade + Senioridade', description: 'Combinação dos campos de IA', source: 'Contatos' },
          { name: 'Mês da Campanha', description: 'Período de execução', source: 'Contatos' }
        ],
        metrics: [
          { name: 'Custo por Lead Qualificado', description: 'CPL segmentado por perfil', calculation: 'Gasto da Campanha / COUNT(MQLs)' },
          { name: 'ROI por Segmento', description: 'Retorno sobre investimento', calculation: '(Receita - Custo) / Custo * 100' },
          { name: 'Taxa de Qualificação', description: 'Lead para MQL', calculation: '(MQLs / Total Leads) * 100' },
          { name: 'Lifetime Value Médio', description: 'Valor do cliente por perfil', calculation: 'AVG(LTV por segmento)' }
        ],
        filters: [
          'Campanha Original não está vazia',
          'Data de criação nos últimos 12 meses',
          'Especialidade e Grau preenchidos'
        ],
        insights: [
          'Campanhas mais efetivas por segmento',
          'Cost per Acquisition (CPA) por perfil profissional',
          'Canais que geram leads de maior valor',
          'Segmentos mais lucrativos para investir'
        ]
      }
    }
  ];

  const tips = [
    {
      icon: '💡',
      title: 'Nomear de forma descritiva',
      description: 'Use nomes descritivos tanto para o dataset quanto para os campos calculados, facilitando o entendimento para toda a equipe.'
    },
    {
      icon: '🔐',
      title: 'Verificar permissões',
      description: 'A criação de datasets requer uma assinatura do Operations Hub Professional ou Enterprise. Verifique se sua conta possui as permissões necessárias.'
    },
    {
      icon: '🔄',
      title: 'Atualizações automáticas',
      description: 'Lembre-se que alterações no dataset refletem em todos os relatórios baseados nele. Isso é útil para manter tudo atualizado.'
    },
    {
      icon: '📊',
      title: 'Monitorar limites',
      description: 'Há limites para o número de datasets que podem ser criados, dependendo da sua assinatura do HubSpot. Gerencie seus datasets cuidadosamente.'
    }
  ];

  const closeModal = () => setSelectedUseCase(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Tutorial HubSpot</h1>
              <p className="text-purple-100">Crie datasets poderosos com dados enriquecidos</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-purple-100 max-w-4xl leading-relaxed">
            Aprenda como criar e utilizar conjuntos de dados no HubSpot para aproveitar ao máximo seus leads enriquecidos.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Database,
            title: 'Datasets Inteligentes',
            description: 'Combine múltiplas fontes de dados em análises unificadas',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: Target,
            title: 'Segmentação Avançada',
            description: 'Use especialidades e senioridade para análises precisas',
            color: 'from-green-500 to-green-600'
          },
          {
            icon: BarChart2,
            title: 'Relatórios Personalizados',
            description: 'Crie visualizações que revelam insights únicos',
            color: 'from-purple-500 to-purple-600'
          }
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* What is a Dataset */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">O que é um Dataset no HubSpot?</h2>
            <p className="text-gray-600">Conceitos fundamentais que você precisa conhecer</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Um conjunto de dados (dataset) no HubSpot é uma coleção de propriedades e cálculos
              preparados para facilitar a criação de relatórios personalizados. Com datasets,
              você pode combinar diferentes objetos do CRM (contatos, empresas, negócios) em uma
              única fonte de dados para análise.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Os datasets são especialmente úteis quando você quer analisar seus leads enriquecidos
              em relação a outras entidades no HubSpot, como oportunidades de negócio ou atividades
              de marketing.
            </p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Benefícios dos Datasets</h3>
            <div className="space-y-3">
              {[
                'Combinar múltiplas fontes de dados',
                'Criar relatórios personalizados avançados',
                'Análises cross-objeto automatizadas',
                'Campos calculados personalizados'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <ArrowRight className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Passo a Passo: Criando um Dataset</h2>
            <p className="text-gray-600">Guia completo para configurar seu primeiro dataset</p>
          </div>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex">
              <div className="mr-6 flex-shrink-0">
                <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 mb-3">{step.description}</p>
                
                {step.path && (
                  <div className="flex items-center text-sm text-indigo-600 mb-3 bg-indigo-50 px-3 py-2 rounded-xl">
                    <span className="font-medium">{step.path}</span>
                  </div>
                )}
                
                {step.items && (
                  <ul className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Using Dataset for Reports */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Usando o Dataset para Relatórios</h2>
            <p className="text-gray-600">Como criar relatórios poderosos com seus dados</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
          <p className="text-blue-800 font-medium mb-4">
            Após criar seu dataset, você pode usá-lo para criar relatórios personalizados:
          </p>
          <ol className="space-y-3 text-blue-700">
            {[
              'No menu de Relatórios, clique em "Criar relatório personalizado"',
              'Selecione o seu dataset como fonte de dados',
              'Escolha o tipo de visualização (tabela, gráfico de barras, pizza, etc.)',
              'Configure as dimensões e métricas com base nas propriedades disponíveis',
              'Aplique filtros, como filtrar por especialidade ou grau específicos',
              'Salve o relatório em um dashboard para acesso regular'
            ].map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full text-xs font-bold text-blue-800 mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Exemplos de Uso com Leads Enriquecidos</h2>
            <p className="text-gray-600">Casos práticos para maximizar o valor dos seus dados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{useCase.description}</p>
                <button
                  onClick={() => setSelectedUseCase(index)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  Ver Configuração Detalhada
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips and Best Practices */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dicas e Boas Práticas</h2>
            <p className="text-gray-600">Recomendações para maximizar seus resultados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
              <div className="text-2xl mr-4 flex-shrink-0">{tip.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-700 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Link */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 text-center border border-indigo-200">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ExternalLink className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentação Oficial do HubSpot</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Para informações mais detalhadas e atualizadas sobre datasets no HubSpot, consulte a documentação oficial.
        </p>
        <a
          href="https://knowledge.hubspot.com/reports/create-custom-reports-with-datasets"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Acessar Documentação
          <ExternalLink className="ml-3 h-5 w-5" />
        </a>
      </div>

      {/* Modal for Use Case Details */}
      {selectedUseCase !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${useCases[selectedUseCase].color} rounded-xl flex items-center justify-center mr-4`}>
                      {React.createElement(useCases[selectedUseCase].icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{useCases[selectedUseCase].title}</h2>
                      <p className="text-gray-600">Configuração Detalhada no HubSpot</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Objective */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Objetivo do Relatório</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{useCases[selectedUseCase].details.objective}</p>
                </div>

                {/* Chart Type */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <PieChart className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Tipo de Visualização Recomendada</h3>
                  </div>
                  <p className="text-gray-700 font-medium">{useCases[selectedUseCase].details.chartType}</p>
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center">
                      <BarChart2 className="h-6 w-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Dimensões (Eixos/Categorias)</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {useCases[selectedUseCase].details.dimensions.map((dimension, index) => (
                        <div key={index} className="flex items-start p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{dimension.name}</h4>
                            <p className="text-gray-700 text-sm mb-2">{dimension.description}</p>
                            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                              Fonte: {dimension.source}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Métricas (Valores/KPIs)</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {useCases[selectedUseCase].details.metrics.map((metric, index) => (
                        <div key={index} className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{metric.name}</h4>
                            <p className="text-gray-700 text-sm mb-2">{metric.description}</p>
                            <div className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded-lg font-mono">
                              {metric.calculation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                    <div className="flex items-center">
                      <Filter className="h-6 w-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Filtros Recomendados</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {useCases[selectedUseCase].details.filters.map((filter, index) => (
                        <div key={index} className="flex items-center p-3 bg-teal-50 rounded-xl border border-teal-200">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium font-mono text-sm">{filter}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-6 w-6 text-yellow-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Insights Que Você Obterá</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {useCases[selectedUseCase].details.insights.map((insight, index) => (
                      <div key={index} className="flex items-start p-3 bg-white rounded-xl border border-yellow-200">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={closeModal}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Entendi, vou implementar!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;
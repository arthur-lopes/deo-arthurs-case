import React from 'react';
import { ExternalLink, Clock, Users, Award, CheckCircle, Star, GraduationCap, Target, TrendingUp, Sparkles, BookOpen, Brain, Zap, BarChart2 } from 'lucide-react';

const CoursePage = () => {
  const modules = [
    {
      number: '1',
      title: 'Fundamentos de Geração e Qualificação de Leads',
      description: 'Conceitos básicos, tipos de leads, critérios de qualificação e métricas essenciais',
      duration: '4h',
      color: 'from-blue-500 to-blue-600',
      icon: Target
    },
    {
      number: '2',
      title: 'Ferramentas de Automação de Marketing',
      description: 'HubSpot workflows, e-mail marketing automatizado, sequências de nutrição',
      duration: '4h',
      color: 'from-green-500 to-green-600',
      icon: Zap
    },
    {
      number: '3',
      title: 'Enriquecimento de Dados com IA',
      description: 'Usando OpenAI para análise e classificação de leads - conectando com a experiência do app',
      duration: '4h',
      color: 'from-purple-500 to-purple-600',
      icon: Brain
    },
    {
      number: '4',
      title: 'Lead Scoring e Routing',
      description: 'Como priorizar leads automaticamente e distribuir para as equipes certas',
      duration: '4h',
      color: 'from-orange-500 to-orange-600',
      icon: TrendingUp
    },
    {
      number: '5',
      title: 'Análise de Leads e Métricas',
      description: 'Como criar relatórios/dashboards, uso de datasets do HubSpot',
      duration: '4h',
      color: 'from-indigo-500 to-indigo-600',
      icon: BarChart2
    }
  ];

  const audience = [
    {
      title: 'Profissionais de Marketing',
      description: 'Que desejam automatizar geração e nutrição de leads',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Analistas de Dados',
      description: 'Em vendas que querem otimizar métricas',
      icon: BarChart2,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Gestores de CRM',
      description: 'Procurando otimizar pipelines de vendas',
      icon: Target,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Empreendedores',
      description: 'Que querem escalar seus processos de vendas',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const benefits = [
    'Acesso a ferramentas reais usadas no mercado',
    'Casos práticos e projetos hands-on',
    'Suporte direto com especialistas',
    'Material complementar exclusivo',
    'Network com outros profissionais',
    'Certificado reconhecido no mercado'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Curso Avançado</h1>
              <p className="text-teal-100">Automação e Análise de Leads</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-teal-100 max-w-4xl leading-relaxed mb-6">
            Do Lead à Conversão: dominando automação e análise com IA
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">20 horas de conteúdo</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-medium">Online ao vivo</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-medium">Certificado incluído</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Sparkles,
            title: 'IA na Prática',
            description: 'Aprenda a usar OpenAI para enriquecimento e análise de leads',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: Zap,
            title: 'Automação Avançada',
            description: 'Domine workflows e sequences no HubSpot',
            color: 'from-green-500 to-green-600'
          },
          {
            icon: BarChart2,
            title: 'Métricas & Insights',
            description: 'Crie dashboards e relatórios que geram resultados',
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Course */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sobre o Curso</h2>
                <p className="text-gray-600">Transforme sua estratégia de leads</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Este curso ensina estratégias de automação de marketing e técnicas de análise de leads 
                para aumentar conversão, usando ferramentas modernas como HubSpot e IA. Baseado em casos 
                reais e experiência prática do mercado.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Aprenda a transformar seu processo de geração e nutrição de leads através da automação 
                inteligente, desde a captura até a conversão final.
              </p>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Para Quem é Este Curso</h2>
                <p className="text-gray-600">Profissionais que querem crescer</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audience.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Conteúdo Programático</h2>
                <p className="text-gray-600">5 módulos completos e projeto prático</p>
              </div>
            </div>

            <div className="space-y-6">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div key={index} className="flex">
                    <div className="mr-6 flex-shrink-0">
                      <div className={`w-14 h-14 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{module.number}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <Icon className="h-5 w-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                        <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {module.duration}
                        </span>
                      </div>
                      <p className="text-gray-700">{module.description}</p>
                    </div>
                  </div>
                );
              })}
              
              {/* Practical Project */}
              <div className="flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Projeto Prático</h3>
                    <span className="ml-auto text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                      Hands-on
                    </span>
                  </div>
                  <p className="text-gray-700">
                    Implementando uma campanha automatizada de follow-up de leads e análise de resultados
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl p-8 border border-teal-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MS</span>
                </div>
              </div>
              <div>
                <blockquote className="text-xl italic text-teal-800 mb-4 font-medium">
                  "Este curso transformou nossa abordagem de leads - passamos a converter 2x mais! 
                  A automação nos permitiu focar no que realmente importa: relacionamento com clientes."
                </blockquote>
                <cite className="text-teal-700 font-semibold">
                  Maria Silva
                </cite>
                <p className="text-teal-600 text-sm">Gerente de Marketing Digital</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Details */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Detalhes do Curso</h3>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Duração</p>
                  <p className="text-gray-600">20 horas (5 módulos de 4h)</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Formato</p>
                  <p className="text-gray-600">Online ao vivo + gravações</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Certificado</p>
                  <p className="text-gray-600">Digital ao final</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Diferenciais</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-xl shadow-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Pronto para começar?</h3>
            <p className="text-teal-100 mb-6">
              Transforme sua estratégia de leads hoje mesmo
            </p>
            <a
              href="https://lp.deodata.com.br/curso-leads"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-teal-600 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Inscrever-se Agora
              <ExternalLink className="ml-3 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 
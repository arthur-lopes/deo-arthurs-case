import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, BarChart2, GraduationCap, Globe, Mail, BookOpen, TrendingUp, Users, Database, Sparkles, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Leads Processados', value: '12.5K+', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Empresas Analisadas', value: '1.2K+', icon: Database, color: 'from-green-500 to-green-600' },
    { label: 'Taxa de Precisão', value: '94.5%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Tempo Economizado', value: '850h', icon: Zap, color: 'from-orange-500 to-orange-600' },
  ];

  const features = [
    {
      to: '/upload',
      title: 'Processar CSV',
      description: 'Upload e processamento inteligente de dados com IA avançada',
      icon: FileUp,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'Mais Popular',
      features: ['Limpeza automática', 'Detecção de duplicatas', 'IA consolidadora']
    },
    {
      to: '/domain',
      title: 'Buscar por Domínio',
      description: 'Encontre leads automaticamente a partir do website da empresa',
      icon: Globe,
      gradient: 'from-green-600 to-emerald-600',
      badge: 'IA Avançada',
      features: ['Busca inteligente', 'Dados em tempo real', 'Múltiplas fontes']
    },
    {
      to: '/email',
      title: 'Enriquecer Email',
      description: 'Obtenha perfil profissional completo usando email específico',
      icon: Mail,
      gradient: 'from-purple-600 to-pink-600',
      badge: 'Perfil Completo',
      features: ['Dados sociais', 'Histórico profissional', 'Empresa atual']
    }
  ];

  const tools = [
    {
      to: '/results',
      title: 'Centro de Resultados',
      description: 'Visualize, analise e exporte seus dados processados',
      icon: BarChart2,
      color: 'text-indigo-600'
    },
    {
      to: '/tutorial',
      title: 'Tutorial HubSpot',
      description: 'Aprenda a criar datasets e listas no HubSpot',
      icon: GraduationCap,
      color: 'text-blue-600'
    },
    {
      to: '/course',
      title: 'Academia DEO',
      description: 'Curso completo de automação e análise de leads',
      icon: BookOpen,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">DEO - Arthur Case</h1>
              <p className="text-blue-100">Plataforma Inteligente de Enriquecimento de Dados</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed">
            Transforme dados brutos em insights valiosos com nossa IA avançada. 
            Limpe, padronize e enriqueça seus leads automaticamente.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div> */}

      {/* Main Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ferramentas Principais</h2>
          <p className="text-gray-600">Escolha a melhor abordagem para seus dados</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.to}
                className="group relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full">
                    {feature.badge}
                  </span>
                </div>
                
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-2 mb-6">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  Começar agora
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ferramentas Complementares</h2>
          <p className="text-gray-600">Maximize seus resultados com essas funcionalidades</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                to={tool.to}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors`}>
                    <Icon className={`h-6 w-6 ${tool.color} transition-colors`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Process Overview */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Três abordagens diferentes para atender suas necessidades de enriquecimento de dados
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Método CSV</h3>
              <p className="text-blue-600 font-medium">Upload e Processamento</p>
            </div>
            
            {[
              { step: '1', title: 'Upload de Dados', desc: 'Carregue seu arquivo CSV com leads' },
              { step: '2', title: 'Limpeza Automática', desc: 'IA limpa e padroniza os dados' },
              { step: '3', title: 'Enriquecimento', desc: 'Adiciona especialidades e graus' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Método Domínio</h3>
              <p className="text-green-600 font-medium">IA Descobre Leads</p>
            </div>
            
            {[
              { step: '1', title: 'Digite o Domínio', desc: 'Insira website da empresa' },
              { step: '2', title: 'IA Pesquisa', desc: 'IA identifica leads automaticamente' },
              { step: '3', title: 'Dados Completos', desc: 'Receba perfis profissionais completos' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Método Email</h3>
              <p className="text-purple-600 font-medium">Perfil Individual</p>
            </div>
            
            {[
              { step: '1', title: 'Email Específico', desc: 'Insira um email profissional' },
              { step: '2', title: 'Busca Avançada', desc: 'IA coleta dados de múltiplas fontes' },
              { step: '3', title: 'Perfil Rico', desc: 'Histórico profissional detalhado' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
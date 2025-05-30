import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, FileUp, BarChart2, Download, Target, Users, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import DataTable from '../components/DataTable';
import DataSummary from '../components/DataSummary';
import DataSourceSummary from '../components/DataSourceSummary';
import BeforeAfterComparison from '../components/BeforeAfterComparison';
import { useLeadContext } from '../context/LeadContext';

const ResultsPage = () => {
  const { leads, originalLeads, fileName } = useLeadContext();
  const navigate = useNavigate();

  useEffect(() => {
    // If no leads data, redirect to upload page
    if (leads.length === 0) {
      navigate('/upload');
    }
  }, [leads, navigate]);

  if (leads.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700 rounded-3xl p-8 md:p-12 text-white mb-8">
          <div className="absolute inset-0 bg-white/5 opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <BarChart2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Centro de Resultados</h1>
                <p className="text-blue-100">Visualize e analise seus dados processados</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-12 text-center border-2 border-dashed border-yellow-300">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nenhum dado processado</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Você precisa carregar um arquivo CSV para visualizar os resultados e análises.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FileUp className="mr-3 h-6 w-6" />
            Processar Arquivo CSV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <BarChart2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Resultados do Processamento</h1>
              <p className="text-blue-100">Dados enriquecidos e prontos para uso</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Leads Processados</p>
                  <p className="text-2xl font-bold text-white">{leads.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Arquivo</p>
                  <p className="text-lg font-bold text-white truncate">{fileName || 'leads.csv'}</p>
                </div>
                <Download className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Status</p>
                  <p className="text-lg font-bold text-white">Concluído</p>
                </div>
                <Sparkles className="h-8 w-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <DataSummary leads={leads} />
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <DataSourceSummary leads={leads} />
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Comparação: Antes vs Depois</h2>
            <p className="text-gray-600">Veja as melhorias aplicadas aos seus dados</p>
          </div>
        </div>
        <BeforeAfterComparison originalLeads={originalLeads} processedLeads={leads} />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dados Enriquecidos</h2>
              <p className="text-green-600">Prontos para download e uso</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-50 px-4 py-2 rounded-2xl">
              <p className="text-sm text-gray-500">Campos Adicionados</p>
              <p className="font-bold text-gray-900">Especialidade, Grau</p>
            </div>
          </div>
        </div>

        <DataTable data={leads} fileName={fileName?.replace('.csv', '_enriquecido.csv') || 'leads_enriquecido.csv'} />
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg border border-green-200">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <ArrowRight className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Próximos Passos</h2>
            <p className="text-green-600">Maximize o valor dos seus dados enriquecidos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Importar para CRM',
              description: 'Utilize o arquivo CSV baixado para importar os leads enriquecidos para o HubSpot ou outro CRM',
              icon: Download,
              color: 'from-blue-500 to-blue-600',
              link: null
            },
            {
              step: '2',
              title: 'Segmentar Campanhas',
              description: 'Use os campos de especialidade e grau para criar segmentações mais precisas',
              icon: Target,
              color: 'from-purple-500 to-purple-600',
              link: null
            },
            {
              step: '3',
              title: 'Tutorial HubSpot',
              description: 'Aprenda a criar datasets no HubSpot com os dados enriquecidos',
              icon: TrendingUp,
              color: 'from-green-500 to-green-600',
              link: '/tutorial'
            }
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full text-sm font-bold text-green-600 mb-2">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                {step.link && (
                  <button
                    onClick={() => navigate(step.link)}
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    Acessar Tutorial
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
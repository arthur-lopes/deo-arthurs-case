import React from 'react';
import { Globe, Code, Bot, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ScrapingDetailsProps {
  domain: string;
  isProcessing: boolean;
  currentStep: 'extracting' | 'analyzing' | 'completed' | 'error';
  htmlLength?: number;
  leadsFound?: number;
  error?: string;
}

const ScrapingDetails: React.FC<ScrapingDetailsProps> = ({
  domain,
  isProcessing,
  currentStep,
  htmlLength,
  leadsFound,
  error
}) => {
  const steps = [
    {
      id: 'extracting',
      icon: Globe,
      title: 'Extraindo HTML',
      description: `Acessando o website ${domain} e extraindo conteúdo`,
      status: currentStep === 'extracting' ? 'active' : 
              ['analyzing', 'completed'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'analyzing',
      icon: Bot,
      title: 'Análise com IA',
      description: 'OpenAI analisando o HTML para extrair dados reais',
      status: currentStep === 'analyzing' ? 'active' : 
              currentStep === 'completed' ? 'completed' : 'pending'
    },
    {
      id: 'completed',
      icon: CheckCircle,
      title: 'Processamento Concluído',
      description: 'Dados extraídos e processados com sucesso',
      status: currentStep === 'completed' ? 'completed' : 'pending'
    }
  ];

  const getStepIcon = (step: typeof steps[0]) => {
    const Icon = step.icon;
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (step.status === 'active') {
      return (
        <div className="relative">
          <Icon className="h-5 w-5 text-blue-600" />
          <div className="absolute -inset-1 rounded-full border-2 border-blue-600 animate-pulse"></div>
        </div>
      );
    } else {
      return <Icon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-800 bg-green-50 border-green-200';
      case 'active': return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-800 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isProcessing && currentStep !== 'completed' && !error) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center mb-4">
        <Code className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold">Processo de Web Scraping</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-800 font-medium">Erro no Web Scraping</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className={`p-3 rounded-lg border ${getStepColor(step.status)}`}>
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {getStepIcon(step)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm opacity-75 mt-1">{step.description}</p>
                
                {/* Show additional details for each step */}
                {step.id === 'extracting' && htmlLength && (
                  <div className="mt-2 text-xs opacity-75">
                    ✅ Extraídos {htmlLength.toLocaleString()} caracteres de HTML
                  </div>
                )}
                
                {step.id === 'analyzing' && step.status === 'active' && (
                  <div className="mt-2 text-xs opacity-75 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Analisando conteúdo com OpenAI GPT-4...
                  </div>
                )}
                
                {step.id === 'completed' && leadsFound !== undefined && (
                  <div className="mt-2 text-xs opacity-75">
                    {leadsFound > 0 ? 
                      `✅ ${leadsFound} leads encontrados` : 
                      'ℹ️ Nenhum lead verificável encontrado'
                    }
                  </div>
                )}
              </div>
              
              {step.status === 'active' && (
                <div className="ml-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentStep === 'completed' && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-purple-800">Web Scraping Concluído</p>
              <p className="text-xs text-purple-700 mt-1">
                O sistema extraiu HTML real do website e utilizou OpenAI para analisar e extrair apenas dados verificáveis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapingDetails; 
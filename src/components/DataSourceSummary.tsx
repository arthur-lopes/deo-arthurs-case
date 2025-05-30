import React from 'react';
import { Lead } from '../types/Lead';
import DataSourceIndicator from './DataSourceIndicator';
import { Bot, Database, AlertTriangle, FileText, Globe } from 'lucide-react';

interface DataSourceSummaryProps {
  leads: Lead[];
}

const DataSourceSummary: React.FC<DataSourceSummaryProps> = ({ leads }) => {
  const getSourceCounts = () => {
    const counts = {
      openai: 0,
      mock: 0,
      rules: 0,
      original: 0,
      scraping: 0
    };

    leads.forEach(lead => {
      const source = lead.dataSource || 'rules';
      counts[source]++;
    });

    return counts;
  };

  const counts = getSourceCounts();
  const total = leads.length;

  const sourceConfigs = [
    {
      key: 'openai' as const,
      icon: Bot,
      label: 'Gerados por IA',
      description: 'Dados criados pela OpenAI API',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'mock' as const,
      icon: Database,
      label: 'Dados Simulados',
      description: 'Dados de exemplo baseados no domínio',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      key: 'rules' as const,
      icon: AlertTriangle,
      label: 'Regras Básicas',
      description: 'Enriquecimento por padrões',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'original' as const,
      icon: FileText,
      label: 'Dados Originais',
      description: 'Dados do arquivo CSV original',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      key: 'scraping' as const,
      icon: Globe,
      label: 'Web Scraping',
      description: 'Dados extraídos do site da empresa',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (total === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Origem dos Dados</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sourceConfigs.map(config => {
          const count = counts[config.key];
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          const Icon = config.icon;
          
          if (count === 0) return null;
          
          return (
            <div key={config.key} className={`${config.bgColor} rounded-lg p-4 border`}>
              <div className="flex items-center mb-2">
                <Icon className={`h-5 w-5 ${config.color} mr-2`} />
                <span className="font-medium text-gray-900">{config.label}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{count}</span>
                  <span className="text-sm text-gray-600">{percentage}%</span>
                </div>
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
              
              <div className="mt-2">
                <DataSourceIndicator source={config.key} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Total de Leads:</span>
          <span className="font-bold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default DataSourceSummary; 
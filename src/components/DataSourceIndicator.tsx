import React from 'react';
import { Bot, Database, AlertTriangle, Globe } from 'lucide-react';

interface DataSourceIndicatorProps {
  source: 'openai' | 'mock' | 'rules' | 'original' | 'scraping';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ 
  source, 
  className = '', 
  size = 'md' 
}) => {
  const getConfig = () => {
    switch (source) {
      case 'openai':
        return {
          icon: Bot,
          text: 'Gerado por IA',
          subtext: 'OpenAI API',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600'
        };
      case 'mock':
        return {
          icon: Database,
          text: 'Dados Simulados',
          subtext: 'Mock Data',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600'
        };
      case 'rules':
        return {
          icon: AlertTriangle,
          text: 'Regras Básicas',
          subtext: 'Pattern Matching',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600'
        };
      case 'original':
        return {
          icon: Database,
          text: 'Dados Originais',
          subtext: 'CSV Original',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600'
        };
      case 'scraping':
        return {
          icon: Globe,
          text: 'Dados de Scraping',
          subtext: 'Web Scraping',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600'
        };
      default:
        return {
          icon: Database,
          text: 'Fonte Desconhecida',
          subtext: 'Unknown',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={`inline-flex items-center rounded-full border font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} ${className}`}>
      <Icon className={`mr-1.5 ${config.iconColor} ${iconSizes[size]}`} />
      <span>{config.text}</span>
      {size !== 'sm' && (
        <span className="ml-1 opacity-75">({config.subtext})</span>
      )}
    </div>
  );
};

export default DataSourceIndicator; 
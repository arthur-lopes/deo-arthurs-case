import React, { useState, useEffect } from 'react';
import { backendApiService } from '../services/backendApiService';

const ApiStatusIndicator: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    try {
      const isAvailable = await backendApiService.isBackendAvailable();
      setBackendStatus(isAvailable ? 'online' : 'offline');
    } catch (error) {
      console.log('Backend offline:', error);
      setBackendStatus('offline');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    // Verificar status inicial
    checkBackendStatus();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (backendStatus) {
      case 'online':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          dotColor: 'bg-green-500',
          icon: '✅',
          text: 'Backend Online',
          subtext: '(APIs Disponíveis)'
        };
      case 'offline':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          dotColor: 'bg-red-500',
          icon: '❌',
          text: 'Backend Offline',
          subtext: '(Funcionalidade Limitada)'
        };
      case 'checking':
      default:
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          dotColor: 'bg-yellow-500',
          icon: '🔄',
          text: 'Verificando Backend',
          subtext: '(Aguarde...)'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
        config.bgColor
      } ${config.textColor} ${config.borderColor} border`}
      onClick={checkBackendStatus}
      title={`Clique para verificar novamente. Backend: ${backendApiService.getBackendUrl()}. Última verificação: ${lastCheck?.toLocaleTimeString() || 'Nunca'}`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${config.dotColor} ${
        backendStatus === 'checking' ? 'animate-pulse' : ''
      }`} />
      <span>{config.icon} {config.text}</span>
      <span className={`ml-1 ${config.textColor.replace('800', '600')}`}>
        {config.subtext}
      </span>
    </div>
  );
};

export default ApiStatusIndicator; 
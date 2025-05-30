import React, { useState } from 'react';
import { Mail, Search, Loader, CheckCircle, XCircle, User, Building, Phone } from 'lucide-react';
import { enrichByEmail, EmailEnrichmentResult } from '../services/enrichmentService';
import { Lead } from '../types/Lead';

interface EmailEnrichmentFormProps {
  onLeadFound?: (lead: Lead) => void;
  className?: string;
}

const EmailEnrichmentForm: React.FC<EmailEnrichmentFormProps> = ({ 
  onLeadFound, 
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailEnrichmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, insira um e-mail');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`🚀 Starting email enrichment for: ${email}`);
      const enrichmentResult = await enrichByEmail(email);
      
      setResult(enrichmentResult);
      
      if (enrichmentResult.success && enrichmentResult.lead && onLeadFound) {
        onLeadFound(enrichmentResult.lead);
      }
      
    } catch (err) {
      console.error('Email enrichment error:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido no enrichment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setResult(null);
    setError(null);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Mail className="mr-2 h-5 w-5 text-blue-600" />
          Enrichment por E-mail
        </h3>
        <p className="text-sm text-gray-600">
          Encontre informações profissionais detalhadas baseadas no endereço de e-mail
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Endereço de E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@empresa.com"
              className="input pl-10 w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="btn btn-primary flex-1"
          >
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Buscando...' : 'Buscar Informações'}
          </button>
          
          {(result || error) && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline px-4"
            >
              Limpar
            </button>
          )}
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <Loader className="h-5 w-5 text-blue-600 animate-spin mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Processando e-mail...</p>
              <p className="text-xs text-blue-600">
                Buscando informações profissionais e da empresa
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6">
          {result.success && result.lead ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="text-sm font-semibold text-green-800">
                  Informações Encontradas
                </h4>
                {result.confidence && (
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    result.confidence === 'high' ? 'bg-green-100 text-green-800' :
                    result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Confiança: {result.confidence === 'high' ? 'Alta' : 
                               result.confidence === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Nome</p>
                      <p className="text-sm font-medium">{result.lead.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Empresa</p>
                      <p className="text-sm font-medium">{result.lead.empresa}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="text-sm font-medium">{result.lead.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Cargo</p>
                    <p className="text-sm font-medium">{result.lead.titulo || 'Não informado'}</p>
                  </div>

                  {result.lead.telefone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Telefone</p>
                        <p className="text-sm font-medium">{result.lead.telefone}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500">Especialidade</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {result.lead.especialidade || 'Geral'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Nível</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {result.lead.grau || 'Profissional'}
                    </span>
                  </div>
                </div>
              </div>

              {result.companyInfo && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h5 className="text-xs font-semibold text-green-800 mb-2">
                    Informações da Empresa
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Setor:</span>
                      <span className="ml-1">{result.companyInfo.industry}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tamanho:</span>
                      <span className="ml-1">{result.companyInfo.size}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.sources && result.sources.length > 0 && (
                <div className="mt-3 text-xs text-green-600">
                  <span className="font-medium">Fontes:</span> {result.sources.join(', ')}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">
                    Nenhuma Informação Encontrada
                  </h4>
                  <p className="text-xs text-yellow-700">
                    {result.message || 'Não foi possível encontrar informações para este e-mail.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailEnrichmentForm; 
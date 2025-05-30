import React, { useState } from 'react';
import { Lead } from '../types/Lead';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface BeforeAfterComparisonProps {
  originalLeads: Lead[];
  processedLeads: Lead[];
}

const BeforeAfterComparison = ({ originalLeads, processedLeads }: BeforeAfterComparisonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  if (originalLeads.length === 0 || processedLeads.length === 0) {
    return null;
  }

  const sampleSize = Math.min(3, originalLeads.length);
  const sampleOriginal = originalLeads.slice(0, sampleSize);
  const sampleProcessed = processedLeads.slice(0, sampleSize);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Comparação: Antes vs Depois</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>
              <span className="mr-1">Ocultar</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="mr-1">Ver Comparação</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Veja como os dados foram transformados durante o processamento
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                  showOriginal 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {showOriginal ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Dados Originais
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Dados Processados
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Data */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-red-700 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Dados Originais
              </h3>
              <div className="space-y-2">
                {sampleOriginal.map((lead, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Nome:</span>
                        <p className="text-red-700">{lead.nome}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Empresa:</span>
                        <p className="text-red-700">{lead.empresa}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Cargo:</span>
                        <p className="text-red-700">{lead.titulo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Telefone:</span>
                        <p className="text-red-700">{lead.telefone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Especialidade:</span>
                        <p className="text-red-700">{lead.especialidade || '❌ Não definido'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Grau:</span>
                        <p className="text-red-700">{lead.grau || '❌ Não definido'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processed Data */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-green-700 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Dados Processados
              </h3>
              <div className="space-y-2">
                {sampleProcessed.map((lead, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Nome:</span>
                        <p className="text-green-700">{lead.nome}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Empresa:</span>
                        <p className="text-green-700">{lead.empresa}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Cargo:</span>
                        <p className="text-green-700">{lead.titulo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Telefone:</span>
                        <p className="text-green-700">{lead.telefone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Especialidade:</span>
                        <p className="text-green-700 font-medium">
                          {lead.especialidade ? `✅ ${lead.especialidade}` : '❌ Não definido'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Grau:</span>
                        <p className="text-green-700 font-medium">
                          {lead.grau ? `✅ ${lead.grau}` : '❌ Não definido'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Melhorias Aplicadas:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Nomes padronizados com capitalização correta</li>
              <li>✅ Telefones formatados consistentemente</li>
              <li>✅ Especialidades identificadas automaticamente</li>
              <li>✅ Graus de senioridade inferidos</li>
              <li>✅ Dados limpos e estruturados</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterComparison; 
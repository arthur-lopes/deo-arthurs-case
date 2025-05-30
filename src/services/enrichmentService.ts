import { Lead } from '../types/Lead';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Email enrichment interface
export interface EmailEnrichmentResult {
  success: boolean;
  email: string;
  lead: Lead | null;
  companyInfo?: {
    name: string;
    description: string;
    industry: string;
    size: string;
    location: string;
  };
  confidence?: 'high' | 'medium' | 'low';
  sources?: string[];
  source: string;
  error?: string;
  message?: string;
}

// Email enrichment function - NEW
export const enrichByEmail = async (email: string): Promise<EmailEnrichmentResult> => {
  try {
    console.log(`📧 Starting email enrichment for: ${email}`);

    const response = await fetch(`${API_BASE_URL}/enrichment/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(90000), // Increased to 90 seconds for email enrichment
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn(`⚠️ Email enrichment API returned ${response.status}:`, data);
      return {
        success: false,
        email: email,
        lead: null,
        error: data.error || 'Email enrichment failed',
        message: data.message || 'Unable to enrich this email',
        source: 'email-enrichment-frontend'
      };
    }

    console.log(`✅ Email enrichment completed for: ${email}`);
    return data;

  } catch (error) {
    console.error('❌ Email enrichment error:', error);
    
    let errorMessage = 'Network error during email enrichment';
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        errorMessage = 'Email enrichment timeout - took too long';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to email enrichment service';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      email: email,
      lead: null,
      error: errorMessage,
      source: 'email-enrichment-frontend'
    };
  }
};

export const enrichLead = async (lead: Lead): Promise<Lead> => {
  try {
    // If both specialty and seniority are already populated, just return the lead
    if (lead.especialidade && lead.grau) {
      return lead;
    }
    
    // Check if OpenAI API key is configured and valid
    if (OPENAI_API_KEY && 
        OPENAI_API_KEY !== 'sk-your-openai-api-key-here' && 
        OPENAI_API_KEY !== 'sk-your-openai-api-key-here-ok' &&
        OPENAI_API_KEY.startsWith('sk-') &&
        OPENAI_API_KEY.trim() !== '') {
      
      console.log('🤖 Using OpenAI for lead enrichment');
      return await enrichWithOpenAI(lead);
    }
    
    // Fallback to rule-based enrichment
    console.log('📋 Using rule-based enrichment for lead');
    return await enrichWithRules(lead);
    
  } catch (error) {
    console.error('Error enriching lead:', error);
    // Fallback to rule-based enrichment if API fails
    console.log('⚠️ Falling back to rule-based enrichment');
    return await enrichWithRules(lead);
  }
};

const enrichWithOpenAI = async (lead: Lead): Promise<Lead> => {
  try {
    const prompt = createEnrichmentPrompt(lead);
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em classificação de profissionais e enriquecimento de dados B2B. Analise as informações do lead e determine a especialidade e grau de senioridade mais apropriados.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      ...lead,
      especialidade: result.especialidade || lead.especialidade,
      grau: result.grau || lead.grau,
      dataSource: 'openai' as const,
      enrichmentMethod: 'csv' as const,
      processedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error with OpenAI enrichment:', error);
    throw error; // Re-throw to trigger fallback
  }
};

const createEnrichmentPrompt = (lead: Lead): string => {
  return `
Analise as informações do seguinte lead e determine a especialidade e grau de senioridade:

Nome: ${lead.nome}
Empresa: ${lead.empresa}
Título/Cargo: ${lead.titulo}
Especialidade Atual: ${lead.especialidade || 'Não definido'}
Grau Atual: ${lead.grau || 'Não definido'}

Por favor, retorne um JSON no seguinte formato:
{
  "especialidade": "Especialidade identificada",
  "grau": "Grau de senioridade"
}

Regras para especialidades:
- Para dentistas: Ortodontia, Odontopediatria, Odontologia Estética, Clínica Geral
- Para tecnologia: Tecnologia
- Para marketing: Marketing
- Para vendas: Vendas
- Para finanças: Finanças
- Para outros: Outros

Regras para graus de senioridade:
- Proprietário (para donos/CEOs)
- Diretor (para diretores/heads)
- Gerente (para gerentes/managers)
- Sênior (para seniores/leads)
- Especialista (para especialistas/doutores)
- Profissional (para outros profissionais)

Analise o título/cargo para determinar o grau apropriado.
`;
};

const enrichWithRules = async (lead: Lead): Promise<Lead> => {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Prepare input for analysis to determine specialty and seniority
  const leadInfo = `
    Nome: ${lead.nome}
    Empresa: ${lead.empresa}
    Título/Cargo: ${lead.titulo}
    Especialidade Atual: ${lead.especialidade}
  `.toLowerCase();
  
  let especialidade = lead.especialidade || '';
  let grau = lead.grau || '';
  
  // Enhanced rule-based enrichment
  if (leadInfo.includes('dentist') || leadInfo.includes('dental') || leadInfo.includes('orthodontics') || 
      leadInfo.includes('pediatric dentistry') || leadInfo.includes('cosmetic dentistry') || 
      leadInfo.includes('general dentistry') || leadInfo.includes('smile') || leadInfo.includes('teeth')) {
    
    if (!especialidade) {
      if (leadInfo.includes('orthodontics')) {
        especialidade = 'Ortodontia';
      } else if (leadInfo.includes('pediatric') || leadInfo.includes('pediatric dentistry')) {
        especialidade = 'Odontopediatria';
      } else if (leadInfo.includes('cosmetic') || leadInfo.includes('cosmetic dentistry')) {
        especialidade = 'Odontologia Estética';
      } else if (leadInfo.includes('general dentistry')) {
        especialidade = 'Clínica Geral';
      } else {
        especialidade = 'Odontologia';
      }
    }
    
    if (!grau) {
      if (leadInfo.includes('owner') || leadInfo.includes('ceo') || leadInfo.includes('proprietário')) {
        grau = 'Proprietário';
      } else if (leadInfo.includes('head doc') || leadInfo.includes('head') || leadInfo.includes('chief')) {
        grau = 'Chefe';
      } else if (leadInfo.includes('lead dentist') || leadInfo.includes('senior') || leadInfo.includes('sênior')) {
        grau = 'Sênior';
      } else if (leadInfo.includes('doctor') || leadInfo.includes('dentist') || leadInfo.includes('doutor')) {
        grau = 'Especialista';
      } else {
        grau = 'Profissional';
      }
    }
  } else if (leadInfo.includes('engenheiro') || leadInfo.includes('desenvolvedor') || leadInfo.includes('engineer') || leadInfo.includes('developer')) {
    if (!especialidade) especialidade = 'Tecnologia';
    
    if (!grau) {
      if (leadInfo.includes('sênior') || leadInfo.includes('senior') || leadInfo.includes('líder') || leadInfo.includes('lead')) {
        grau = 'Sênior';
      } else if (leadInfo.includes('júnior') || leadInfo.includes('junior')) {
        grau = 'Júnior';
      } else {
        grau = 'Pleno';
      }
    }
  } else if (leadInfo.includes('marketing')) {
    if (!especialidade) especialidade = 'Marketing';
    
    if (!grau) {
      if (leadInfo.includes('diretor') || leadInfo.includes('director') || leadInfo.includes('head')) {
        grau = 'Diretor';
      } else if (leadInfo.includes('gerente') || leadInfo.includes('manager')) {
        grau = 'Gerente';
      } else {
        grau = 'Analista';
      }
    }
  } else if (leadInfo.includes('vendas') || leadInfo.includes('comercial') || leadInfo.includes('sales')) {
    if (!especialidade) especialidade = 'Vendas';
    
    if (!grau) {
      if (leadInfo.includes('diretor') || leadInfo.includes('director')) {
        grau = 'Diretor';
      } else if (leadInfo.includes('gerente') || leadInfo.includes('manager')) {
        grau = 'Gerente';
      } else {
        grau = 'Representante';
      }
    }
  } else if (leadInfo.includes('financeiro') || leadInfo.includes('contabilidade') || leadInfo.includes('finance')) {
    if (!especialidade) especialidade = 'Finanças';
    
    if (!grau) {
      if (leadInfo.includes('diretor') || leadInfo.includes('director') || leadInfo.includes('cfo')) {
        grau = 'Diretor';
      } else if (leadInfo.includes('gerente') || leadInfo.includes('manager')) {
        grau = 'Gerente';
      } else {
        grau = 'Analista';
      }
    }
  }
  
  // If we still don't have values, set defaults
  if (!especialidade) especialidade = 'Outros';
  if (!grau) grau = 'Não Especificado';
  
  // Return enriched lead
  return {
    ...lead,
    especialidade,
    grau,
    dataSource: 'rules' as const,
    enrichmentMethod: 'csv' as const,
    processedAt: new Date().toISOString()
  };
};
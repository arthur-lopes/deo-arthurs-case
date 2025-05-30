const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const { devLog, errorLog, successLog } = require('../utils/logger');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';

    // Configuration
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async enrichDomain(domain) {
    try {
      devLog(`🤖 Starting OpenAI enrichment for: ${domain}`);

      if (!this.apiKey || this.apiKey === 'sk-your-openai-api-key-here') {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = this.createEnrichmentPrompt(domain);
      
      const response = await axios.post(this.baseUrl, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de empresas americanas. Sua função é fornecer informações REAIS e verificáveis sobre empresas baseadas em seu domínio.

REGRAS CRÍTICAS:
- APENAS forneça informações que você tem certeza que são REAIS
- NUNCA invente nomes, cargos, telefones ou emails específicos
- Se não souber informações específicas de contato, retorne lista vazia
- Foque em empresas dos Estados Unidos
- Seja extremamente conservador - prefira retornar vazio a inventar
- Use apenas conhecimento factual sobre empresas conhecidas

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Very low temperature for factual responses
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response from OpenAI API');
      }

      let result;
      try {
        let responseContent = response.data.choices[0].message.content;
        
        // Remove markdown if present
        if (responseContent.includes('```json')) {
          responseContent = responseContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
        } else if (responseContent.includes('```')) {
          responseContent = responseContent.replace(/```\s*/g, '').replace(/```\s*$/g, '');
        }
        
        result = JSON.parse(responseContent.trim());
      } catch (parseError) {
        errorLog('Error parsing OpenAI response:', parseError);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Validate and format the result
      const leads = (result.leads || []).map((lead, index) => ({
        id: `openai-lead-${index + 1}`,
        nome: lead.nome || '',
        empresa: result.companyInfo?.name || this.extractCompanyName(domain),
        titulo: lead.titulo || '',
        telefone: lead.telefone || '',
        email: lead.email || '',
        especialidade: lead.especialidade || '',
        grau: lead.grau || '',
        dataSource: 'openai',
        enrichmentMethod: 'domain',
        processedAt: new Date().toISOString()
      }));

      successLog(`OpenAI found ${leads.length} leads for: ${domain}`);

      return {
        success: true,
        companyInfo: result.companyInfo || {
          name: this.extractCompanyName(domain),
          description: 'Company information not available',
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        leads
      };

    } catch (error) {
      errorLog(`OpenAI enrichment failed for ${domain}:`, error.message);
      throw error;
    }
  }

  createEnrichmentPrompt(domain) {
    return `
INSTRUÇÃO: Analise o domínio "${domain}" e forneça informações REAIS sobre esta empresa, se você tiver conhecimento factual sobre ela.

REGRAS OBRIGATÓRIAS:
1. APENAS forneça informações que você tem CERTEZA que são REAIS e ATUAIS
2. NUNCA invente nomes específicos de pessoas, telefones ou emails
3. Se não souber informações específicas de contato, retorne leads: []
4. Foque em empresas americanas conhecidas
5. Use apenas seu conhecimento factual sobre empresas públicas/conhecidas
6. Se a empresa não for conhecida, retorne informações básicas ou vazio

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "companyInfo": {
    "name": "Nome oficial da empresa se conhecida",
    "description": "Descrição factual dos serviços/produtos", 
    "industry": "Setor da empresa se conhecido",
    "size": "Tamanho da empresa se conhecido (Small/Medium/Large)",
    "location": "Localização principal se conhecida"
  },
  "leads": [
    // APENAS se você souber informações REAIS de executivos públicos
    // Exemplo: CEOs de empresas públicas conhecidas
    {
      "nome": "Nome REAL de executivo conhecido publicamente",
      "titulo": "Cargo REAL conhecido publicamente", 
      "telefone": "", // Deixe vazio - não invente
      "email": "", // Deixe vazio - não invente
      "especialidade": "Especialidade baseada no setor da empresa",
      "grau": "Nível hierárquico baseado no cargo"
    }
  ]
}

EXEMPLOS DE EMPRESAS CONHECIDAS:
- microsoft.com: Microsoft Corporation, Satya Nadella (CEO)
- google.com: Google LLC, Sundar Pichai (CEO)
- apple.com: Apple Inc., Tim Cook (CEO)
- amazon.com: Amazon.com Inc., Andy Jassy (CEO)

IMPORTANTE: Se "${domain}" não for uma empresa conhecida publicamente, retorne:
{
  "companyInfo": {
    "name": "Nome baseado no domínio",
    "description": null,
    "industry": null,
    "size": null,
    "location": null
  },
  "leads": []
}

Analise agora o domínio "${domain}" e forneça apenas informações REAIS e verificáveis.
`;
  }

  extractCompanyName(domain) {
    const parts = domain.split('.');
    if (parts.length > 0) {
      let companyName = parts[0];
      companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
      return companyName;
    }
    return domain;
  }

  async analyzeText(prompt, maxTokens = 500) {
    devLog(`🤖 Starting OpenAI text analysis...`);

    if (!this.apiKey || this.apiKey === 'sk-your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(this.baseUrl, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: maxTokens
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000 // 8 seconds timeout
      });

      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response from OpenAI API');
      }

      const analysis = response.data.choices[0].message.content;
      const tokensUsed = response.data.usage?.total_tokens || 0;
      const model = response.data.model || 'gpt-4o-mini';

      successLog(`OpenAI text analysis completed (${tokensUsed} tokens)`);

      return {
        success: true,
        analysis: analysis.trim(),
        tokensUsed,
        model
      };

    } catch (error) {
      errorLog(`OpenAI text analysis failed:`, error.message);
      return {
        success: false,
        error: error.message,
        analysis: null
      };
    }
  }
}

module.exports = new OpenAIService(); 
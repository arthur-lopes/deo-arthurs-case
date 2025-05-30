const axios = require('axios');

class SerpApiService {
  constructor() {
    this.apiKey = process.env.SERPAPI_KEY;
    this.baseUrl = 'https://serpapi.com/search';
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async searchDomain(domain) {
    console.log(`🔍 Starting SerpAPI search for: ${domain}`);

    if (!this.apiKey) {
      throw new Error('SerpAPI key not configured');
    }

    try {
      const searchResults = await this.performSearches(domain);

      if (searchResults.length === 0) {
        console.log(`❌ No search results found for: ${domain}`);
        return {
          success: false,
          leads: [],
          error: 'No search results found',
          source: 'SerpAPI'
        };
      }

      // Use OpenAI to analyze results if available
      if (this.openaiApiKey) {
        console.log(`🤖 Analyzing search results with OpenAI for: ${domain}`);
        return await this.analyzeWithOpenAI(domain, searchResults);
      } else {
        console.log(`📊 Using basic parsing for: ${domain}`);
        return await this.basicParsing(domain, searchResults);
      }

    } catch (error) {
      console.error(`❌ SerpAPI search failed for ${domain}:`, error.message);
      return {
        success: false,
        leads: [],
        error: 'SerpAPI search failed',
        source: 'SerpAPI'
      };
    }
  }

  async performSearches(domain) {
    // Reduced and optimized search queries for faster processing
    const searchQueries = [
      `"${domain}" CEO founder executives email contact`,
      `"${domain}" management team contact information`,
      `"${domain}" leadership email directory`,
      `"${domain}" company officers contact details`,
      `site:linkedin.com "${domain}" CEO founder`,
      `"${domain}" "team" "contact" "@${domain.split('.')[0]}"` // Look for company emails
    ];

    let allResults = [];

    for (let i = 0; i < searchQueries.length && allResults.length < 15; i++) {
      const query = searchQueries[i];
      
      try {
        console.log(`🔍 Searching: "${query}"`);
        
        const params = {
          api_key: this.apiKey,
          engine: 'google',
          q: query,
          num: 8, // Reduced from 10 to 8
          gl: 'us', // US results
          hl: 'en'  // English
        };

        const response = await axios.get(this.baseUrl, { 
          params,
          timeout: 10000 // 10 second timeout per request
        });
        
        if (response.data.organic_results) {
          const results = response.data.organic_results.map(result => ({
            title: result.title || '',
            link: result.link || '',
            snippet: result.snippet || '',
            position: result.position,
            query: query // Track which query found this result
          }));
          
          allResults.push(...results);
        }

        // Reduced delay between requests (from 1000ms to 500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Search query failed "${query}":`, error.message);
        // Continue with next query even if one fails
      }
    }

    // Remove duplicates and prioritize results with email patterns
    const uniqueResults = allResults
      .filter((result, index, self) => 
        index === self.findIndex(r => r.link === result.link)
      )
      // Prioritize results that mention emails or contact info
      .sort((a, b) => {
        const aHasEmail = (a.title + ' ' + a.snippet).toLowerCase().includes('@') || 
                         (a.title + ' ' + a.snippet).toLowerCase().includes('email') ||
                         (a.title + ' ' + a.snippet).toLowerCase().includes('contact');
        const bHasEmail = (b.title + ' ' + b.snippet).toLowerCase().includes('@') || 
                         (b.title + ' ' + b.snippet).toLowerCase().includes('email') ||
                         (b.title + ' ' + b.snippet).toLowerCase().includes('contact');
        
        if (aHasEmail && !bHasEmail) return -1;
        if (!aHasEmail && bHasEmail) return 1;
        return 0;
      })
      .slice(0, 15);

    console.log(`✅ Found ${uniqueResults.length} search results for: ${domain}`);
    return uniqueResults;
  }

  async analyzeWithOpenAI(domain, searchResults) {
    try {
      const prompt = this.createAnalysisPrompt(domain, searchResults);
      
      const response = await axios.post(this.openaiUrl, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de resultados de busca para empresas americanas. Sua função é sintetizar informações REAIS encontradas nos resultados do Google.

REGRAS CRÍTICAS:
- APENAS extraia informações que estão EXPLICITAMENTE mencionadas nos resultados
- NUNCA invente nomes, cargos, telefones ou emails
- Se não encontrar informações de contato verificáveis, retorne lista vazia
- Foque em empresas dos Estados Unidos
- Seja extremamente conservador - prefira retornar vazio a inventar
- Use apenas informações que aparecem em múltiplas fontes confiáveis

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

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
        console.error('❌ Error parsing OpenAI response:', parseError);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Format leads
      const leads = (result.leads || []).map((lead, index) => ({
        id: `serp-lead-${index + 1}`,
        nome: lead.nome || '',
        empresa: result.companyInfo?.name || this.extractCompanyName(domain),
        titulo: lead.titulo || '',
        telefone: lead.telefone || '',
        email: lead.email || '',
        especialidade: lead.especialidade || '',
        grau: lead.grau || '',
        dataSource: 'scraping',
        enrichmentMethod: 'domain',
        processedAt: new Date().toISOString()
      }));

      console.log(`✅ OpenAI analysis found ${leads.length} leads for: ${domain}`);

      return {
        success: true,
        companyInfo: result.companyInfo || {
          name: this.extractCompanyName(domain),
          description: 'Information found via Google search',
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        leads,
        source: 'SerpAPI + OpenAI'
      };

    } catch (error) {
      console.error('❌ OpenAI analysis failed:', error.message);
      throw error;
    }
  }

  async basicParsing(domain, searchResults) {
    console.log(`📊 Using basic parsing for search results of: ${domain}`);
    
    const companyName = this.extractCompanyName(domain);
    const executiveTitles = ['CEO', 'Chief Executive Officer', 'Founder', 'President', 'CTO', 'CFO'];
    const foundExecutives = [];
    
    searchResults.forEach((result, index) => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      
      executiveTitles.forEach(title => {
        if (text.includes(title.toLowerCase())) {
          // Basic pattern matching for names
          const titlePattern = new RegExp(`([A-Z][a-z]+ [A-Z][a-z]+).*${title}`, 'i');
          const match = `${result.title} ${result.snippet}`.match(titlePattern);
          
          if (match && match[1]) {
            foundExecutives.push({
              nome: match[1],
              titulo: title,
              email: '',
              telefone: '',
              especialidade: 'Leadership',
              grau: 'C-Level'
            });
          }
        }
      });
    });

    // Remove duplicates
    const uniqueExecutives = foundExecutives
      .filter((exec, index, self) =>
        index === self.findIndex(e => e.nome === exec.nome)
      )
      .slice(0, 3);

    const leads = uniqueExecutives.map((exec, index) => ({
      id: `serp-basic-lead-${index + 1}`,
      nome: exec.nome,
      empresa: companyName,
      titulo: exec.titulo,
      telefone: exec.telefone,
      email: exec.email,
      especialidade: exec.especialidade,
      grau: exec.grau,
      dataSource: 'scraping',
      enrichmentMethod: 'domain',
      processedAt: new Date().toISOString()
    }));

    return {
      success: leads.length > 0,
      companyInfo: {
        name: companyName,
        description: 'Information found via Google search (basic parsing)',
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown'
      },
      leads,
      source: 'SerpAPI (basic)'
    };
  }

  createAnalysisPrompt(domain, searchResults) {
    const resultsText = searchResults
      .map((result, index) => `
RESULTADO ${index + 1}:
Título: ${result.title}
URL: ${result.link}
Descrição: ${result.snippet}
Query: ${result.query}
---`)
      .join('\n');

    return `
INSTRUÇÃO: Analise os resultados de busca do Google sobre "${domain}" e extraia APENAS informações REAIS de contato que são mencionadas explicitamente nos resultados.

FOCO PRIORITÁRIO - BUSCAR POR:
1. EMAILS EXPLÍCITOS - Procure por padrões como: nome@empresa.com, contato@empresa.com, ceo@empresa.com
2. NOMES DE EXECUTIVOS - CEO, Founder, President, CTO, CFO, VP
3. INFORMAÇÕES DE CONTATO - telefones, endereços, emails de contato
4. DIRETÓRIOS DE STAFF - páginas de equipe, about us, contact us

REGRAS OBRIGATÓRIAS:
1. PROCURE ATIVAMENTE por emails nos textos - qualquer coisa com @ seguido de domínio
2. Se encontrar emails, SEMPRE inclua no campo "email" do lead
3. NUNCA invente emails - apenas use os encontrados explicitamente
4. Priorize executivos com informações de contato verificáveis
5. Se um resultado menciona "email:", "contact:", "@" - analise cuidadosamente
6. Valide informações que aparecem em múltiplas fontes
7. Foque em empresas americanas

PADRÕES DE EMAIL PARA BUSCAR:
- nome@${domain}
- firstname.lastname@${domain}
- ceo@${domain}, info@${domain}, contact@${domain}
- Emails mencionados diretamente nos snippets

RESULTADOS DE BUSCA PARA ANÁLISE:
${resultsText}

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "companyInfo": {
    "name": "Nome da empresa mencionado nos resultados",
    "description": "Descrição encontrada nos resultados", 
    "industry": "Setor identificado nos resultados",
    "size": "Tamanho da empresa se mencionado",
    "location": "Localização se mencionada nos resultados"
  },
  "leads": [
    {
      "nome": "Nome REAL de executivo mencionado",
      "titulo": "Cargo REAL mencionado (CEO, Founder, etc)", 
      "telefone": "Telefone REAL encontrado ou deixe vazio",
      "email": "EMAIL REAL encontrado nos resultados - IMPORTANTE: procure por @ nos textos",
      "especialidade": "Especialidade baseada no cargo",
      "grau": "Nível hierárquico (C-Level, Director, Manager, etc)"
    }
  ]
}

IMPORTANTE: Analise CUIDADOSAMENTE cada resultado procurando por:
- Qualquer texto que contenha @ (arroba)
- Menções a "email", "contact", "reach out"
- Nomes de pessoas em posições de liderança
- Informações de contato empresarial

Mesmo que não encontre emails explícitos, extraia executivos mencionados nos resultados.
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
}

module.exports = new SerpApiService();
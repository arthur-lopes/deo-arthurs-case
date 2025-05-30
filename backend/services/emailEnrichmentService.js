const axios = require('axios');
const serpApiService = require('./serpApiService');
const webScrapingService = require('./webScrapingService');

class EmailEnrichmentService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
    this.serpApiKey = process.env.SERPAPI_KEY;
  }

  async enrichByEmail(email) {
    console.log(`📧 Starting email enrichment for: ${email}`);

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    try {
      // Extract domain from email
      const domain = email.split('@')[1];
      const name = this.extractNameFromEmail(email);

      console.log(`📊 Extracted domain: ${domain}, name parts: ${name.join(' ')}`);

      // Strategy 1: Search for the specific email
      const emailSearchResults = await this.searchByEmail(email);
      
      // Strategy 2: Search for the person's name + company
      const nameSearchResults = await this.searchByNameAndCompany(name, domain);
      
      // Strategy 3: Get company information 
      const companyInfo = await this.getCompanyInfo(domain);

      // Combine and analyze all data
      const enrichedData = await this.analyzeAndCombineResults(
        email, 
        emailSearchResults, 
        nameSearchResults, 
        companyInfo
      );

      return enrichedData;

    } catch (error) {
      console.error(`❌ Email enrichment failed for ${email}:`, error.message);
      return {
        success: false,
        email: email,
        lead: null,
        error: error.message,
        source: 'email-enrichment'
      };
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  extractNameFromEmail(email) {
    const localPart = email.split('@')[0];
    
    // Remove numbers and common patterns
    const cleaned = localPart
      .replace(/\d+/g, '') // Remove numbers
      .replace(/[._-]/g, ' ') // Replace separators with spaces
      .replace(/\b(info|contact|admin|support|hello|mail|email)\b/gi, '') // Remove common words
      .trim();

    // Split into potential name parts
    const parts = cleaned.split(' ')
      .filter(part => part.length > 1) // Remove single characters
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()); // Capitalize

    return parts.slice(0, 3); // Limit to 3 parts maximum
  }

  async searchByEmail(email) {
    if (!this.serpApiKey) {
      console.log('⚠️ SerpAPI not configured for email search');
      return [];
    }

    try {
      console.log(`🔍 Searching for email: ${email}`);

      const searchQueries = [
        `"${email}"`,
        `"${email}" linkedin`,
        `"${email}" profile`
      ];

      let allResults = [];

      for (const query of searchQueries) {
        try {
          const params = {
            api_key: this.serpApiKey,
            engine: 'google',
            q: query,
            num: 5,
            gl: 'us',
            hl: 'en'
          };

          const response = await axios.get('https://serpapi.com/search', { params });
          
          if (response.data.organic_results) {
            allResults.push(...response.data.organic_results);
          }

          // Reduced delay between requests for faster processing
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`❌ Email search query failed "${query}":`, error.message);
        }
      }

      // Remove duplicates
      const uniqueResults = allResults
        .filter((result, index, self) => 
          index === self.findIndex(r => r.link === result.link)
        )
        .slice(0, 10);

      console.log(`✅ Found ${uniqueResults.length} results for email search`);
      return uniqueResults;

    } catch (error) {
      console.error('❌ Email search failed:', error.message);
      return [];
    }
  }

  async searchByNameAndCompany(nameParts, domain) {
    if (!this.serpApiKey || nameParts.length === 0) {
      return [];
    }

    try {
      const fullName = nameParts.join(' ');
      const companyName = domain.split('.')[0];
      
      console.log(`🔍 Searching for: ${fullName} at ${companyName}`);

      const searchQueries = [
        `"${fullName}" "${companyName}"`,
        `"${fullName}" site:linkedin.com`,
        `"${fullName}" "${domain}"`
      ];

      let allResults = [];

      for (const query of searchQueries) {
        try {
          const params = {
            api_key: this.serpApiKey,
            engine: 'google',
            q: query,
            num: 5,
            gl: 'us',
            hl: 'en'
          };

          const response = await axios.get('https://serpapi.com/search', { params });
          
          if (response.data.organic_results) {
            allResults.push(...response.data.organic_results);
          }

          // Reduced delay for faster processing
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`❌ Name search query failed "${query}":`, error.message);
        }
      }

      const uniqueResults = allResults
        .filter((result, index, self) => 
          index === self.findIndex(r => r.link === result.link)
        )
        .slice(0, 10);

      console.log(`✅ Found ${uniqueResults.length} results for name search`);
      return uniqueResults;

    } catch (error) {
      console.error('❌ Name search failed:', error.message);
      return [];
    }
  }

  async getCompanyInfo(domain) {
    try {
      console.log(`🏢 Getting company info for domain: ${domain}`);
      
      const companyName = this.extractCompanyName(domain);
      
      // First try basic company info from domain (fast)
      let companyInfo = {
        name: companyName,
        description: 'Company information',
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown'
      };

      // Try quick SerpAPI search for company info if available
      if (this.serpApiKey) {
        try {
          console.log(`🔍 Quick search for company info: ${companyName}`);
          
          const params = {
            api_key: this.serpApiKey,
            engine: 'google',
            q: `"${companyName}" company about industry sector`,
            num: 3,
            gl: 'us',
            hl: 'en'
          };

          const response = await axios.get('https://serpapi.com/search', { params });
          
          if (response.data.organic_results && response.data.organic_results.length > 0) {
            const results = response.data.organic_results.slice(0, 3);
            
            // Simple analysis of company info from search results
            const allText = results.map(r => `${r.title} ${r.snippet}`).join(' ').toLowerCase();
            
            // Try to identify industry/sector
            if (allText.includes('healthcare') || allText.includes('saúde') || allText.includes('medical') || allText.includes('hospital')) {
              companyInfo.industry = 'Healthcare';
            } else if (allText.includes('technology') || allText.includes('software') || allText.includes('tech') || allText.includes('development')) {
              companyInfo.industry = 'Technology';
            } else if (allText.includes('finance') || allText.includes('bank') || allText.includes('financial')) {
              companyInfo.industry = 'Finance';
            } else if (allText.includes('education') || allText.includes('school') || allText.includes('university')) {
              companyInfo.industry = 'Education';
            } else if (allText.includes('retail') || allText.includes('ecommerce') || allText.includes('store')) {
              companyInfo.industry = 'Retail';
            } else if (allText.includes('consulting') || allText.includes('advisory')) {
              companyInfo.industry = 'Consulting';
            } else if (allText.includes('manufacturing') || allText.includes('factory')) {
              companyInfo.industry = 'Manufacturing';
            }
            
            // Try to identify company size
            if (allText.includes('startup') || allText.includes('small')) {
              companyInfo.size = 'Small (1-50)';
            } else if (allText.includes('medium') || allText.includes('mid-size')) {
              companyInfo.size = 'Medium (51-200)';
            } else if (allText.includes('large') || allText.includes('enterprise') || allText.includes('corporation')) {
              companyInfo.size = 'Large (200+)';
            }
            
            // Update description with first snippet
            if (results[0] && results[0].snippet) {
              companyInfo.description = results[0].snippet.substring(0, 150) + '...';
            }
            
            console.log(`✅ Found company info for ${companyName}: ${companyInfo.industry} - ${companyInfo.size}`);
          }
        } catch (error) {
          console.error('❌ Quick company search failed:', error.message);
        }
      }

      return companyInfo;

    } catch (error) {
      console.error('❌ Company info extraction failed:', error.message);
      return {
        name: this.extractCompanyName(domain),
        description: 'Company information',
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown'
      };
    }
  }

  async analyzeAndCombineResults(email, emailResults, nameResults, companyInfo) {
    if (!this.openaiApiKey) {
      console.log('⚠️ OpenAI not configured, using basic analysis');
      return this.basicAnalysis(email, emailResults, nameResults, companyInfo);
    }

    try {
      console.log(`🤖 Analyzing enrichment data with OpenAI for: ${email}`);

      const prompt = this.createEnrichmentPrompt(email, emailResults, nameResults, companyInfo);
      
      const response = await axios.post(this.openaiUrl, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de informações profissionais. Sua função é combinar dados de diferentes fontes para criar um perfil completo de um profissional baseado no e-mail fornecido.

REGRAS CRÍTICAS:
- APENAS use informações que estão EXPLICITAMENTE mencionadas nos resultados
- NUNCA invente informações que não existem nos dados fornecidos
- Se não encontrar informações suficientes, seja honesto sobre as limitações
- Foque em dados verificáveis e consistentes entre as fontes
- Priorize informações de fontes confiáveis como LinkedIn

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
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

      // Format the enriched lead
      const enrichedLead = {
        id: `email-enriched-${Date.now()}`,
        nome: result.nome || this.extractNameFromEmail(email).join(' '),
        empresa: result.empresa || companyInfo.name,
        titulo: result.titulo || '',
        telefone: result.telefone || '',
        email: email,
        especialidade: result.especialidade || 'General',
        grau: result.grau || 'Professional',
        dataSource: 'email-enrichment',
        enrichmentMethod: 'email',
        processedAt: new Date().toISOString()
      };

      // Update company info with OpenAI findings if available
      const updatedCompanyInfo = {
        ...companyInfo,
        industry: result.empresa_setor && result.empresa_setor !== 'Unknown' ? result.empresa_setor : companyInfo.industry,
        size: result.empresa_tamanho && result.empresa_tamanho !== 'Unknown' ? result.empresa_tamanho : companyInfo.size
      };

      console.log(`✅ Email enrichment completed for: ${email}`);

      return {
        success: true,
        email: email,
        lead: enrichedLead,
        companyInfo: updatedCompanyInfo,
        confidence: result.confidence || 'medium',
        sources: result.sources || [],
        source: 'email-enrichment + OpenAI'
      };

    } catch (error) {
      console.error('❌ OpenAI enrichment failed:', error.message);
      return this.basicAnalysis(email, emailResults, nameResults, companyInfo);
    }
  }

  basicAnalysis(email, emailResults, nameResults, companyInfo) {
    console.log(`📊 Using basic analysis for email: ${email}`);
    
    const nameParts = this.extractNameFromEmail(email);
    const domain = email.split('@')[1];
    
    // Try to extract information from search results
    let title = '';
    let phone = '';
    
    // Look for job titles in results
    const allResults = [...emailResults, ...nameResults];
    const titleKeywords = ['CEO', 'CTO', 'CFO', 'President', 'Director', 'Manager', 'Developer', 'Engineer', 'Founder'];
    
    for (const result of allResults) {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      for (const keyword of titleKeywords) {
        if (text.includes(keyword.toLowerCase())) {
          title = keyword;
          break;
        }
      }
      if (title) break;
    }

    // Extract phone numbers from results
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    for (const result of allResults) {
      const match = `${result.title} ${result.snippet}`.match(phoneRegex);
      if (match) {
        phone = match[0];
        break;
      }
    }

    const enrichedLead = {
      id: `email-basic-${Date.now()}`,
      nome: nameParts.join(' ') || 'Professional',
      empresa: companyInfo.name,
      titulo: title || 'Professional',
      telefone: phone || '',
      email: email,
      especialidade: this.mapTitleToSpecialty(title),
      grau: this.mapTitleToGrade(title),
      dataSource: 'email-enrichment',
      enrichmentMethod: 'email',
      processedAt: new Date().toISOString()
    };

    return {
      success: true,
      email: email,
      lead: enrichedLead,
      companyInfo: companyInfo,
      confidence: 'low',
      sources: ['email-parsing', 'domain-extraction'],
      source: 'email-enrichment (basic)'
    };
  }

  createEnrichmentPrompt(email, emailResults, nameResults, companyInfo) {
    const emailResultsText = emailResults
      .map((result, index) => `
RESULTADO EMAIL ${index + 1}:
Título: ${result.title}
URL: ${result.link}
Descrição: ${result.snippet}
---`)
      .join('\n');

    const nameResultsText = nameResults
      .map((result, index) => `
RESULTADO NOME ${index + 1}:
Título: ${result.title}
URL: ${result.link}
Descrição: ${result.snippet}
---`)
      .join('\n');

    return `
INSTRUÇÃO: Analise os resultados de busca para o e-mail "${email}" e crie um perfil profissional completo baseado nas informações encontradas.

INFORMAÇÕES DA EMPRESA:
Nome: ${companyInfo.name}
Descrição: ${companyInfo.description}
Setor: ${companyInfo.industry}
Tamanho: ${companyInfo.size}
Localização: ${companyInfo.location}

RESULTADOS DE BUSCA POR E-MAIL:
${emailResultsText || 'Nenhum resultado encontrado'}

RESULTADOS DE BUSCA POR NOME/EMPRESA:
${nameResultsText || 'Nenhum resultado encontrado'}

FOCO DA ANÁLISE:
1. NOME COMPLETO - Identifique o nome real da pessoa
2. CARGO/TÍTULO - Função atual na empresa
3. TELEFONE - Número de contato se mencionado
4. ESPECIALIDADE - Área de atuação profissional
5. NÍVEL HIERÁRQUICO - Posição na empresa
6. INFORMAÇÕES DA EMPRESA - Tente identificar setor e tamanho nos resultados
7. CONFIABILIDADE - Quão confiáveis são as informações

IMPORTANTE PARA INFORMAÇÕES DA EMPRESA:
- Analise os resultados de busca para identificar o setor da empresa
- Procure por palavras-chave como: healthcare, technology, finance, consulting, etc.
- Tente determinar o tamanho da empresa: startup, small, medium, large, enterprise
- Se encontrar informações da empresa nos resultados, use-as para sobrescrever "Unknown"

IMPORTANTE:
- Se não encontrar informações suficientes, use confidence: "low"
- Priorize informações de LinkedIn e sites oficiais
- Seja conservador - prefira confidence baixa a inventar dados
- Use apenas informações que aparecem consistentemente nas fontes

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "nome": "Nome completo da pessoa (baseado nas fontes)",
  "empresa": "Nome da empresa confirmado",
  "titulo": "Cargo/função atual",
  "telefone": "Telefone se encontrado nos resultados",
  "especialidade": "Área de especialidade profissional",
  "grau": "Nível hierárquico (C-Level, Director, Manager, Senior, Professional)",
  "empresa_setor": "Setor da empresa se identificado nos resultados ou Unknown",
  "empresa_tamanho": "Tamanho da empresa se identificado nos resultados ou Unknown", 
  "confidence": "high/medium/low - baseado na qualidade das informações",
  "sources": ["lista de fontes que confirmam as informações"]
}
`;
  }

  mapTitleToSpecialty(title) {
    if (!title) return 'General';
    
    const titleLower = title.toLowerCase();
    if (titleLower.includes('ceo') || titleLower.includes('president') || titleLower.includes('founder')) {
      return 'Executive Leadership';
    }
    if (titleLower.includes('cto') || titleLower.includes('technology') || titleLower.includes('engineer')) {
      return 'Technology';
    }
    if (titleLower.includes('cfo') || titleLower.includes('financial')) {
      return 'Finance';
    }
    if (titleLower.includes('coo') || titleLower.includes('operations')) {
      return 'Operations';
    }
    if (titleLower.includes('marketing')) {
      return 'Marketing';
    }
    if (titleLower.includes('sales')) {
      return 'Sales';
    }
    if (titleLower.includes('hr') || titleLower.includes('human')) {
      return 'Human Resources';
    }
    return 'General';
  }

  mapTitleToGrade(title) {
    if (!title) return 'Professional';
    
    const titleLower = title.toLowerCase();
    if (titleLower.includes('ceo') || titleLower.includes('president') || titleLower.includes('founder')) {
      return 'C-Level';
    }
    if (titleLower.includes('director') || titleLower.includes('vp') || titleLower.includes('vice president')) {
      return 'Director';
    }
    if (titleLower.includes('manager') || titleLower.includes('head')) {
      return 'Manager';
    }
    if (titleLower.includes('senior') || titleLower.includes('lead')) {
      return 'Senior';
    }
    return 'Professional';
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

module.exports = new EmailEnrichmentService(); 
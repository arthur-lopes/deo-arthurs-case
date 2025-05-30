const serpApiService = require('./serpApiService');
const webScrapingService = require('./webScrapingService');
const openaiService = require('./openaiService');
const axios = require('axios');

class HybridEnrichmentService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async enrichDomain(domain) {
    console.log(`🔄 Starting hybrid enrichment for: ${domain}`);

    try {
      // OPTIMIZED: Try SerpAPI first and return immediately if successful
      console.log(`🔍 Getting SerpAPI data for: ${domain}`);
      const serpResult = await this.getSerpData(domain);
      
      // If SerpAPI has good data, proceed immediately without waiting for web scraping
      if (serpResult?.success && serpResult?.leads?.length > 0) {
        console.log(`🚀 SerpAPI has ${serpResult.leads.length} leads, proceeding immediately without web scraping delay`);
        
        const allData = {
          serpData: serpResult,
          scrapingData: null // Skip scraping when SerpAPI is successful
        };

        // Enhance with OpenAI if available
        if (this.openaiApiKey) {
          console.log(`🤖 Enhancing SerpAPI data with OpenAI for: ${domain}`);
          return await this.enhanceWithOpenAI(domain, allData);
        } else {
          console.log(`📋 Using SerpAPI data directly for: ${domain}`);
          return await this.combineDataSources(domain, allData);
        }
      }

      // FALLBACK: Only if SerpAPI failed, try web scraping as fallback
      console.log(`⚠️ SerpAPI found no data, trying web scraping as fallback for: ${domain}`);
      const scrapingResult = await this.getScrapingData(domain);
      
      const allData = {
        serpData: null,
        scrapingData: scrapingResult
      };

      if (scrapingResult?.success && scrapingResult?.leads?.length > 0) {
        console.log(`📋 Using scraping data as fallback for: ${domain}`);
        return await this.combineDataSources(domain, allData);
      }

      // No real data found from either source
      console.log(`❌ No real data found in hybrid enrichment for: ${domain}`);
      return {
        success: false,
        leads: [],
        error: `No enrichment data found for domain: ${domain}`
      };

    } catch (error) {
      console.error(`❌ Hybrid enrichment failed for ${domain}:`, error.message);
      return {
        success: false,
        leads: [],
        error: `Hybrid enrichment failed: ${error.message}`
      };
    }
  }

  async getSerpData(domain) {
    try {
      console.log(`🔍 Getting SerpAPI data for: ${domain}`);
      const result = await serpApiService.searchDomain(domain);
      console.log(`✅ SerpAPI returned ${result.leads?.length || 0} leads for: ${domain}`);
      return result;
    } catch (error) {
      console.log(`❌ SerpAPI failed for ${domain}:`, error.message);
      return null;
    }
  }

  async getScrapingData(domain) {
    try {
      console.log(`🕷️ Getting web scraping data for: ${domain}`);
      const result = await webScrapingService.scrapeDomain(domain);
      console.log(`✅ Web scraping returned ${result.leads?.length || 0} leads for: ${domain}`);
      return result;
    } catch (error) {
      console.log(`❌ Web scraping failed for ${domain}:`, error.message);
      return null;
    }
  }

  async enhanceWithOpenAI(domain, allData) {
    try {
      const prompt = this.createHybridAnalysisPrompt(domain, allData);
      
      const response = await axios.post(this.openaiUrl, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise e consolidação de dados de empresas americanas. Sua função é combinar informações de múltiplas fontes (SerpAPI e Web Scraping) para criar um perfil completo e preciso da empresa.

REGRAS CRÍTICAS:
- Combine e deduplicar informações das diferentes fontes
- Priorize informações mais específicas e detalhadas
- NUNCA invente dados que não estão nas fontes
- Se houver conflitos entre fontes, use a informação mais completa
- Mantenha apenas leads únicos (sem duplicatas)
- Foque em empresas dos Estados Unidos
- Seja conservador - prefira qualidade à quantidade

PROCESSO:
1. Analise dados do SerpAPI (pesquisas Google)
2. Analise dados do Web Scraping (conteúdo do site)
3. Combine e deduplicar informações
4. Crie um perfil consolidado da empresa
5. Retorne leads únicos e verificados

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
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
        console.error('❌ Error parsing OpenAI hybrid response:', parseError);
        return await this.combineDataSources(domain, allData);
      }

      // Format leads with proper structure
      const leads = (result.leads || []).map((lead, index) => ({
        id: `hybrid-lead-${index + 1}`,
        nome: lead.nome || '',
        empresa: result.companyInfo?.name || this.extractCompanyName(domain),
        titulo: lead.titulo || '',
        telefone: lead.telefone || '',
        email: lead.email || '',
        especialidade: lead.especialidade || 'General',
        grau: lead.grau || 'Associate',
        dataSource: 'hybrid',
        enrichmentMethod: 'domain',
        processedAt: new Date().toISOString()
      }));

      console.log(`✅ Hybrid OpenAI analysis found ${leads.length} consolidated leads for: ${domain}`);

      return {
        success: true,
        companyInfo: result.companyInfo || {
          name: this.extractCompanyName(domain),
          description: 'Information consolidated from multiple sources',
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        leads,
        metadata: {
          sources: ['serpapi', 'scraping', 'openai'],
          originalSerpLeads: allData.serpData?.leads?.length || 0,
          originalScrapingLeads: allData.scrapingData?.leads?.length || 0,
          consolidatedLeads: leads.length
        }
      };

    } catch (error) {
      console.error('❌ OpenAI hybrid analysis failed:', error.message);
      return await this.combineDataSources(domain, allData);
    }
  }

  async combineDataSources(domain, allData) {
    console.log(`📋 Combining data sources manually for: ${domain}`);

    let combinedLeads = [];
    let companyInfo = null;

    // Combine leads from all sources
    if (allData.serpData?.leads) {
      combinedLeads.push(...allData.serpData.leads.map(lead => ({
        ...lead,
        id: `serp-${lead.id || combinedLeads.length + 1}`,
        dataSource: 'serpapi'
      })));
    }

    if (allData.scrapingData?.leads) {
      combinedLeads.push(...allData.scrapingData.leads.map(lead => ({
        ...lead,
        id: `scrape-${lead.id || combinedLeads.length + 1}`,
        dataSource: 'scraping'
      })));
    }

    // Deduplicate leads by email or name
    const uniqueLeads = this.deduplicateLeads(combinedLeads);

    // Choose best company info
    companyInfo = allData.scrapingData?.companyInfo || 
                  allData.serpData?.companyInfo || {
                    name: this.extractCompanyName(domain),
                    description: 'Information from multiple sources',
                    industry: 'Unknown',
                    size: 'Unknown',
                    location: 'Unknown'
                  };

    // Return success if we found leads from ANY source (more tolerant approach)
    if (uniqueLeads.length === 0) {
      console.log(`❌ No leads found after combining data sources for: ${domain}`);
      return {
        success: false,
        leads: [],
        error: `No enrichment data found for domain: ${domain}`,
        metadata: {
          sources: this.getAvailableSources(allData),
          originalSerpLeads: allData.serpData?.leads?.length || 0,
          originalScrapingLeads: allData.scrapingData?.leads?.length || 0,
          consolidatedLeads: 0,
          note: 'No leads found from any available source'
        }
      };
    }

    const availableSources = this.getAvailableSources(allData);
    console.log(`✅ Manual combination found ${uniqueLeads.length} unique leads for: ${domain} from sources: ${availableSources.join(', ')}`);

    return {
      success: true,
      companyInfo,
      leads: uniqueLeads,
      metadata: {
        sources: availableSources,
        originalSerpLeads: allData.serpData?.leads?.length || 0,
        originalScrapingLeads: allData.scrapingData?.leads?.length || 0,
        consolidatedLeads: uniqueLeads.length,
        note: `Successfully combined data from ${availableSources.length} source(s)`
      }
    };
  }

  getAvailableSources(allData) {
    const sources = [];
    if (allData.serpData?.success) sources.push('serpapi');
    if (allData.scrapingData?.success) sources.push('scraping');
    return sources;
  }

  deduplicateLeads(leads) {
    const seen = new Set();
    const unique = [];

    for (const lead of leads) {
      // Create a key for deduplication
      const key = `${lead.email?.toLowerCase() || ''}-${lead.nome?.toLowerCase() || ''}-${lead.titulo?.toLowerCase() || ''}`;
      
      if (!seen.has(key) && (lead.email || lead.nome)) {
        seen.add(key);
        unique.push({
          ...lead,
          id: `unique-lead-${unique.length + 1}`,
          dataSource: 'hybrid',
          enrichmentMethod: 'domain',
          processedAt: new Date().toISOString()
        });
      }
    }

    return unique;
  }

  createHybridAnalysisPrompt(domain, allData) {
    let prompt = `INSTRUÇÃO: Analise e combine dados de múltiplas fontes sobre a empresa "${domain}" para criar um perfil consolidado e preciso.

DADOS DISPONÍVEIS:

`;

    if (allData.serpData?.success) {
      prompt += `DADOS DO SERPAPI (Pesquisa Google):
Empresa: ${JSON.stringify(allData.serpData.companyInfo, null, 2)}
Leads encontrados: ${allData.serpData.leads?.length || 0}
${allData.serpData.leads?.map(lead => `- ${lead.nome} (${lead.titulo}) - ${lead.email}`).join('\n') || 'Nenhum lead'}

`;
    }

    if (allData.scrapingData?.success) {
      prompt += `DADOS DO WEB SCRAPING (Site da empresa):
Empresa: ${JSON.stringify(allData.scrapingData.companyInfo, null, 2)}
Leads encontrados: ${allData.scrapingData.leads?.length || 0}
${allData.scrapingData.leads?.map(lead => `- ${lead.nome} (${lead.titulo}) - ${lead.email}`).join('\n') || 'Nenhum lead'}

`;
    }

    prompt += `TAREFA:
1. Combine as informações da empresa das diferentes fontes
2. Deduplicar e consolidar a lista de leads
3. Priorize informações mais específicas e completas
4. Mantenha apenas leads únicos (sem duplicatas)

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "companyInfo": {
    "name": "Nome consolidado da empresa",
    "description": "Descrição consolidada dos serviços/produtos",
    "industry": "Setor identificado",
    "size": "Tamanho estimado da empresa",
    "location": "Localização consolidada"
  },
  "leads": [
    {
      "nome": "Nome consolidado do lead",
      "titulo": "Cargo consolidado",
      "telefone": "Telefone se disponível",
      "email": "Email se disponível",
      "especialidade": "Especialidade baseada no cargo/setor",
      "grau": "Nível hierárquico"
    }
  ]
}

IMPORTANTE: 
- Remova duplicatas baseadas em nome, email ou cargo similar
- Priorize leads com mais informações (email, telefone)
- Se não houver dados reais, retorne leads: []
- Combine informações complementares das diferentes fontes`;

    return prompt;
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

module.exports = new HybridEnrichmentService(); 
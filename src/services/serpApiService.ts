import { Lead } from '../types/Lead';

interface SerpApiResult {
  success: boolean;
  companyInfo?: {
    name: string;
    description: string;
    industry: string;
    size: string;
    location: string;
  };
  leads: Lead[];
  error?: string;
  source: string;
}

interface SerpSearchResult {
  title: string;
  link: string;
  snippet: string;
  position?: number;
}

// SerpAPI configuration
const SERPAPI_CONFIG = {
  enabled: false, // Disabled in frontend due to CORS - requires backend implementation
  apiKey: import.meta.env.VITE_SERPAPI_KEY,
  baseUrl: 'https://serpapi.com/search',
  corsIssue: true // Flag to indicate CORS limitation
};

// OpenAI configuration for SERP analysis
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const searchWithSerpApi = async (domain: string): Promise<SerpApiResult> => {
  console.log(`🔍 Starting SerpAPI search for: ${domain}`);
  
  // Debug: Log SerpAPI configuration
  console.log(`🔧 SerpAPI Debug:`, {
    enabled: SERPAPI_CONFIG.enabled,
    hasApiKey: !!SERPAPI_CONFIG.apiKey,
    apiKeyLength: SERPAPI_CONFIG.apiKey?.length || 0,
    apiKeyStart: SERPAPI_CONFIG.apiKey?.substring(0, 10) || 'none'
  });
  
  try {
    // Check if SerpAPI is configured
    if (!SERPAPI_CONFIG.enabled || !SERPAPI_CONFIG.apiKey) {
      console.log(`⚠️ SerpAPI not available in frontend due to CORS restrictions`);
      console.log(`   - API Key configured: ${!!SERPAPI_CONFIG.apiKey}`);
      console.log(`   - CORS Issue: ${SERPAPI_CONFIG.corsIssue}`);
      console.log(`   - Solution: Implement backend proxy for SerpAPI calls`);
      return {
        success: false,
        leads: [],
        error: 'SerpAPI requires backend implementation due to CORS restrictions',
        source: 'SerpAPI'
      };
    }

    console.log(`✅ SerpAPI is configured, proceeding with search`);

    // Step 1: Search Google for company information
    const searchResults = await performSerpSearch(domain);
    
    if (!searchResults || searchResults.length === 0) {
      console.log(`❌ No search results found for: ${domain}`);
      return {
        success: false,
        leads: [],
        error: 'No search results found',
        source: 'SerpAPI'
      };
    }

    // Step 2: Send search results to OpenAI for analysis
    if (!OPENAI_API_KEY || 
        OPENAI_API_KEY === 'sk-your-openai-api-key-here' || 
        OPENAI_API_KEY === 'sk-your-openai-api-key-here-ok' ||
        !OPENAI_API_KEY.startsWith('sk-')) {
      
      console.log(`⚠️ OpenAI not configured for SERP analysis, using basic parsing`);
      return await parseSearchResultsBasic(domain, searchResults);
    }

    console.log(`🤖 Analyzing search results with OpenAI for: ${domain}`);
    const analysisResult = await analyzeSearchResultsWithOpenAI(domain, searchResults);
    
    return analysisResult;
    
  } catch (error) {
    console.error('Error in SerpAPI search:', error);
    return {
      success: false,
      leads: [],
      error: error instanceof Error ? error.message : 'SerpAPI search failed',
      source: 'SerpAPI'
    };
  }
};

// Perform search using SerpAPI
const performSerpSearch = async (domain: string): Promise<SerpSearchResult[]> => {
  try {
    const companyName = extractCompanyFromDomain(domain);
    
    // Multiple search queries to get comprehensive information
    const searchQueries = [
      `"${domain}" company leadership team contact`,
      `"${companyName}" CEO founder executives`,
      `"${domain}" about company information`,
      `site:linkedin.com/company "${companyName}"`,
      `site:crunchbase.com "${companyName}"`
    ];

    let allResults: SerpSearchResult[] = [];

    // Perform searches (limit to 2 queries to avoid rate limits)
    for (const query of searchQueries.slice(0, 2)) {
      try {
        console.log(`🔍 Searching: ${query}`);
        
        const searchParams = new URLSearchParams({
          q: query,
          api_key: SERPAPI_CONFIG.apiKey!,
          engine: 'google',
          num: '10', // Get top 10 results
          gl: 'us', // Focus on US results
          hl: 'en' // English language
        });

        const response = await fetch(`${SERPAPI_CONFIG.baseUrl}?${searchParams}`);
        
        if (!response.ok) {
          throw new Error(`SerpAPI error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.organic_results) {
          const results = data.organic_results.map((result: any) => ({
            title: result.title || '',
            link: result.link || '',
            snippet: result.snippet || '',
            position: result.position
          }));
          
          allResults.push(...results);
        }

        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (searchError) {
        console.error(`Error in search query "${query}":`, searchError);
      }
    }

    // Remove duplicates and limit results
    const uniqueResults = allResults
      .filter((result, index, self) => 
        index === self.findIndex(r => r.link === result.link)
      )
      .slice(0, 15); // Limit to 15 results

    console.log(`✅ Found ${uniqueResults.length} search results for: ${domain}`);
    return uniqueResults;

  } catch (error) {
    console.error('Error performing SerpAPI search:', error);
    throw error;
  }
};

// Analyze search results with OpenAI
const analyzeSearchResultsWithOpenAI = async (
  domain: string, 
  searchResults: SerpSearchResult[]
): Promise<SerpApiResult> => {
  try {
    const prompt = createSearchAnalysisPrompt(domain, searchResults);
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
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

PROCESSO:
1. Analise todos os resultados de busca fornecidos
2. Identifique informações consistentes sobre a empresa
3. Procure por informações de liderança/executivos REAIS
4. Extraia apenas dados que são mencionados explicitamente
5. Valide informações cruzando múltiplas fontes

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Very low temperature for conservative analysis
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let result;
    try {
      let responseContent = data.choices[0].message.content;
      
      // Remove markdown code blocks if present
      if (responseContent.includes('```json')) {
        responseContent = responseContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (responseContent.includes('```')) {
        responseContent = responseContent.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      
      responseContent = responseContent.trim();
      result = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI SERP response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and format the result
    const leads = (result.leads || []).map((lead: any, index: number) => ({
      id: `serp-lead-${index + 1}`,
      nome: lead.nome || '',
      empresa: result.companyInfo?.name || extractCompanyFromDomain(domain),
      titulo: lead.titulo || '',
      telefone: lead.telefone || '',
      email: lead.email || '',
      especialidade: lead.especialidade || '',
      grau: lead.grau || '',
      dataSource: 'scraping' as const, // Mark as scraping since it's from search results
      enrichmentMethod: 'domain' as const,
      processedAt: new Date().toISOString()
    }));

    console.log(`✅ OpenAI SERP analysis found ${leads.length} leads for: ${domain}`);

    return {
      success: true,
      companyInfo: result.companyInfo || {
        name: extractCompanyFromDomain(domain),
        description: 'Information found via Google search',
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown'
      },
      leads,
      source: 'SerpAPI + OpenAI'
    };

  } catch (error) {
    console.error('Error in OpenAI SERP analysis:', error);
    throw error;
  }
};

// Create prompt for search results analysis
const createSearchAnalysisPrompt = (domain: string, searchResults: SerpSearchResult[]): string => {
  const resultsText = searchResults
    .map((result, index) => `
RESULTADO ${index + 1}:
Título: ${result.title}
URL: ${result.link}
Descrição: ${result.snippet}
---`)
    .join('\n');

  return `
INSTRUÇÃO: Analise os resultados de busca do Google sobre "${domain}" e extraia APENAS informações REAIS que são mencionadas explicitamente nos resultados.

REGRAS OBRIGATÓRIAS:
1. APENAS use informações que estão CLARAMENTE mencionadas nos resultados de busca
2. NUNCA invente nomes, cargos, telefones ou emails
3. Se não encontrar informações de contato verificáveis, retorne leads: []
4. Procure por informações de liderança, executivos, fundadores
5. Valide informações que aparecem em múltiplas fontes
6. Foque em empresas americanas

RESULTADOS DE BUSCA:
${resultsText}

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "companyInfo": {
    "name": "Nome da empresa mencionado nos resultados ou null",
    "description": "Descrição encontrada nos resultados ou null", 
    "industry": "Setor identificado nos resultados ou null",
    "size": "Tamanho da empresa se mencionado ou null",
    "location": "Localização se mencionada nos resultados ou null"
  },
  "leads": [
    // APENAS se você encontrar informações REAIS de pessoas nos resultados
    // Caso contrário, deixe array vazio: []
    {
      "nome": "Nome REAL mencionado nos resultados",
      "titulo": "Cargo REAL mencionado nos resultados", 
      "telefone": "Telefone REAL encontrado ou null",
      "email": "Email REAL encontrado ou null",
      "especialidade": "Especialidade baseada no cargo encontrado",
      "grau": "Nível hierárquico baseado no cargo encontrado"
    }
  ]
}

ESPECIALIDADES VÁLIDAS (apenas se identificadas):
- Technology, Healthcare, Finance, Marketing, Sales, Operations, Legal, Real Estate

GRAUS VÁLIDOS (baseados em cargos encontrados):
- C-Level, VP/Director, Manager, Senior, Specialist, Associate

IMPORTANTE: Se você não conseguir encontrar informações REAIS de contato nos resultados de busca do "${domain}", retorne:
{
  "companyInfo": {
    "name": "Nome encontrado nos resultados",
    "description": "Descrição encontrada",
    "industry": null,
    "size": null,
    "location": null
  },
  "leads": []
}

Analise agora os resultados de busca e extraia apenas informações REAIS e verificáveis que são mencionadas explicitamente.
`;
};

// Basic parsing without OpenAI (fallback)
const parseSearchResultsBasic = async (
  domain: string, 
  searchResults: SerpSearchResult[]
): Promise<SerpApiResult> => {
  console.log(`📊 Using basic parsing for search results of: ${domain}`);
  
  // Extract company name from search results
  const companyName = extractCompanyFromDomain(domain);
  
  // Look for common executive titles in search results
  const executiveTitles = ['CEO', 'Chief Executive Officer', 'Founder', 'President', 'CTO', 'CFO'];
  const foundExecutives: any[] = [];
  
  searchResults.forEach((result, index) => {
    const text = `${result.title} ${result.snippet}`.toLowerCase();
    
    executiveTitles.forEach(title => {
      if (text.includes(title.toLowerCase())) {
        // Try to extract name (very basic pattern matching)
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
  const uniqueExecutives = foundExecutives.filter((exec, index, self) =>
    index === self.findIndex(e => e.nome === exec.nome)
  ).slice(0, 3); // Limit to 3

  const leads = uniqueExecutives.map((exec, index) => ({
    id: `serp-basic-lead-${index + 1}`,
    nome: exec.nome,
    empresa: companyName,
    titulo: exec.titulo,
    telefone: exec.telefone,
    email: exec.email,
    especialidade: exec.especialidade,
    grau: exec.grau,
    dataSource: 'scraping' as const,
    enrichmentMethod: 'domain' as const,
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
};

// Helper function to extract company name from domain
const extractCompanyFromDomain = (domain: string): string => {
  const parts = domain.split('.');
  if (parts.length > 0) {
    let companyName = parts[0];
    companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
    return companyName;
  }
  return domain;
}; 
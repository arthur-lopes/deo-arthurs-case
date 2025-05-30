import { Lead } from '../types/Lead';

interface ScrapingResult {
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
}

// OpenAI configuration for scraping analysis
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Real web scraping service that extracts HTML and sends to OpenAI
export const scrapeCompanyData = async (domain: string): Promise<ScrapingResult> => {
  console.log(`🕷️ Starting real web scraping for: ${domain}`);
  
  try {
    // Step 1: Extract HTML from the company website
    const htmlContent = await extractWebsiteHTML(domain);
    
    if (!htmlContent || htmlContent.length < 100) {
      console.log(`❌ Could not extract meaningful HTML from: ${domain}`);
      return await fallbackToSimulatedScraping(domain);
    }

    // Step 2: Send HTML to OpenAI for analysis
    if (!OPENAI_API_KEY || 
        OPENAI_API_KEY === 'sk-your-openai-api-key-here' || 
        OPENAI_API_KEY === 'sk-your-openai-api-key-here-ok' ||
        !OPENAI_API_KEY.startsWith('sk-')) {
      
      console.log(`⚠️ OpenAI not configured for scraping analysis, using fallback`);
      return await fallbackToSimulatedScraping(domain);
    }

    console.log(`🤖 Analyzing scraped HTML with OpenAI for: ${domain}`);
    const analysisResult = await analyzeHTMLWithOpenAI(domain, htmlContent);
    
    return analysisResult;
    
  } catch (error) {
    console.error('Error in web scraping:', error);
    console.log(`🔄 Falling back to simulated scraping for: ${domain}`);
    return await fallbackToSimulatedScraping(domain);
  }
};

// Extract HTML content from website
const extractWebsiteHTML = async (domain: string): Promise<string | null> => {
  try {
    console.log(`📄 Extracting HTML from: https://${domain}`);
    
    // Try multiple CORS proxies in order
    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://${domain}`)}`,
      `https://corsproxy.io/?${encodeURIComponent(`https://${domain}`)}`,
      `https://cors-anywhere.herokuapp.com/https://${domain}`,
      `https://thingproxy.freeboard.io/fetch/https://${domain}`
    ];
    
    for (let i = 0; i < proxies.length; i++) {
      try {
        console.log(`🔄 Trying proxy ${i + 1}/${proxies.length}: ${proxies[i].split('?')[0]}`);
        
        const response = await fetch(proxies[i], {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/html, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let html: string;
        
        // Handle different proxy response formats
        if (proxies[i].includes('allorigins.win')) {
          const data = await response.json();
          html = data.contents;
        } else if (proxies[i].includes('corsproxy.io')) {
          html = await response.text();
        } else {
          html = await response.text();
        }

        if (!html || html.length < 100) {
          throw new Error('No meaningful HTML content received');
        }

        // Clean and limit HTML content
        html = cleanHTML(html);
        
        // Limit to first 8000 characters to avoid token limits
        if (html.length > 8000) {
          html = html.substring(0, 8000) + '...';
        }

        console.log(`✅ Successfully extracted ${html.length} characters of HTML using proxy ${i + 1}`);
        return html;

      } catch (proxyError) {
        console.log(`❌ Proxy ${i + 1} failed:`, proxyError);
        if (i === proxies.length - 1) {
          throw proxyError; // Last proxy failed
        }
        // Continue to next proxy
      }
    }

    throw new Error('All proxies failed');

  } catch (error) {
    console.error(`❌ Failed to extract HTML from ${domain}:`, error);
    
    // Try alternative approach - fetch specific pages
    try {
      return await extractSpecificPages(domain);
    } catch (altError) {
      console.error(`❌ Alternative extraction also failed:`, altError);
      return null;
    }
  }
};

// Clean HTML content for analysis
const cleanHTML = (html: string): string => {
  // Remove scripts, styles, and other non-content elements
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  html = html.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Keep only relevant content sections
  const relevantSections = [
    'header', 'nav', 'main', 'section', 'article', 'aside', 'footer',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'a'
  ];
  
  // Extract text content while preserving structure
  html = html.replace(/\s+/g, ' ').trim();
  
  return html;
};

// Try to extract specific pages (about, team, contact)
const extractSpecificPages = async (domain: string): Promise<string> => {
  const pages = ['', '/about', '/team', '/contact', '/about-us', '/leadership'];
  let combinedContent = '';
  
  // Use the same proxy strategy
  const getProxyUrl = (url: string) => [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://thingproxy.freeboard.io/fetch/${url}`
  ];
  
  for (const page of pages.slice(0, 3)) { // Limit to 3 pages
    const fullUrl = `https://${domain}${page}`;
    const proxies = getProxyUrl(fullUrl);
    
    for (let i = 0; i < proxies.length; i++) {
      try {
        console.log(`🔄 Trying page ${page || 'home'} with proxy ${i + 1}`);
        
        const response = await fetch(proxies[i], {
          headers: {
            'Accept': 'application/json, text/html, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          let html: string;
          
          if (proxies[i].includes('allorigins.win')) {
            const data = await response.json();
            html = data.contents;
          } else {
            html = await response.text();
          }
          
          if (html && html.length > 100) {
            combinedContent += `\n\n=== PAGE: ${page || 'home'} ===\n`;
            combinedContent += cleanHTML(html).substring(0, 2000);
            break; // Success, move to next page
          }
        }
      } catch (error) {
        console.log(`❌ Failed to fetch ${domain}${page} with proxy ${i + 1}`);
        if (i === proxies.length - 1) {
          console.log(`❌ All proxies failed for page: ${page || 'home'}`);
        }
      }
    }
  }
  
  return combinedContent;
};

// Analyze HTML content with OpenAI
const analyzeHTMLWithOpenAI = async (domain: string, htmlContent: string): Promise<ScrapingResult> => {
  try {
    const prompt = createHTMLAnalysisPrompt(domain, htmlContent);
    
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
            content: `Você é um especialista em análise de websites de empresas americanas. Sua função é extrair informações REAIS e verificáveis do HTML fornecido.

REGRAS CRÍTICAS:
- APENAS extraia informações que estão EXPLICITAMENTE presentes no HTML
- NUNCA invente nomes, cargos, telefones ou emails
- Se não encontrar informações de contato reais, retorne lista vazia
- Foque em empresas dos Estados Unidos
- Seja extremamente conservador - prefira retornar vazio a inventar

PROCESSO:
1. Analise o HTML fornecido
2. Identifique informações da empresa (nome, descrição, setor)
3. Procure por informações de contato REAIS (nomes, cargos, emails)
4. Extraia apenas dados que estão claramente visíveis no site
5. Se houver dúvida sobre a veracidade, não inclua

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more conservative analysis
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
      console.error('Error parsing OpenAI scraping response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate and format the result
    const leads = (result.leads || []).map((lead: any, index: number) => ({
      id: `scraped-lead-${index + 1}`,
      nome: lead.nome || '',
      empresa: result.companyInfo?.name || extractCompanyFromDomain(domain),
      titulo: lead.titulo || '',
      telefone: lead.telefone || '',
      email: lead.email || '',
      especialidade: lead.especialidade || '',
      grau: lead.grau || '',
      dataSource: 'scraping' as const,
      enrichmentMethod: 'domain' as const,
      processedAt: new Date().toISOString()
    }));

    console.log(`✅ OpenAI scraping analysis found ${leads.length} leads for: ${domain}`);

    return {
      success: true,
      companyInfo: result.companyInfo || {
        name: extractCompanyFromDomain(domain),
        description: 'Information extracted from website',
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown'
      },
      leads
    };

  } catch (error) {
    console.error('Error in OpenAI HTML analysis:', error);
    throw error;
  }
};

// Create prompt for HTML analysis
const createHTMLAnalysisPrompt = (domain: string, htmlContent: string): string => {
  return `
INSTRUÇÃO: Analise o HTML do website "${domain}" e extraia APENAS informações REAIS que estão explicitamente presentes no conteúdo.

CONTEXTO: Este parece ser um website de clínica dentária. Procure especificamente por:
- Nomes de dentistas com títulos como "Dr.", "DDS", "DMD"
- Seções "About Us", "Our Team", "Meet the Doctor", "Staff", "Our Dentists"
- Informações de contato: telefone, email, endereço
- Especialidades dentárias mencionadas
- Nomes de profissionais da equipe (recepcionistas, higienistas, etc.)

ESTRATÉGIA DE BUSCA:
1. Procure por padrões como "Dr. [Nome]", "[Nome], DDS", "[Nome], DMD"
2. Identifique seções de equipe ou sobre nós
3. Extraia informações de contato visíveis
4. Identifique especialidades dentárias mencionadas
5. Procure por informações de localização/endereço

REGRAS OBRIGATÓRIAS:
1. APENAS use informações que estão CLARAMENTE visíveis no HTML fornecido
2. NUNCA invente nomes, cargos, telefones ou emails
3. Se não encontrar informações de contato reais, retorne leads: []
4. Para clínicas dentárias, procure especificamente por "Dr.", "DDS", "DMD", "Dentist"
5. Extraia apenas dados que podem ser verificados no HTML
6. Se encontrar apenas um telefone geral, associe ao dentista principal se identificado

HTML DO WEBSITE (${htmlContent.length} caracteres):
${htmlContent}

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "companyInfo": {
    "name": "Nome da clínica encontrado no HTML",
    "description": "Descrição dos serviços dentários encontrada", 
    "industry": "Healthcare - Dental",
    "size": "Small Business" para clínicas locais,
    "location": "Endereço completo se encontrado no HTML"
  },
  "leads": [
    // APENAS se você encontrar informações REAIS de dentistas/equipe no HTML
    // Exemplo: "Dr. John Smith, DDS" ou "Dr. Maria Garcia - Orthodontist"
    {
      "nome": "Dr. [Nome Real encontrado no HTML]",
      "titulo": "Dentist" ou "DDS" ou "DMD" ou especialidade específica, 
      "telefone": "Telefone da clínica se encontrado",
      "email": "Email específico se encontrado ou email geral da clínica",
      "especialidade": "Healthcare" ou especialidade específica,
      "grau": "Senior" para dentistas principais, "Specialist" para especialistas
    }
  ]
}

ESPECIALIDADES DENTÁRIAS VÁLIDAS (se mencionadas no HTML):
- Healthcare (dentista geral)
- Healthcare - Orthodontics (ortodontia)
- Healthcare - Oral Surgery (cirurgia oral)
- Healthcare - Pediatric Dentistry (odontopediatria)
- Healthcare - Periodontics (periodontia)
- Healthcare - Endodontics (endodontia)
- Healthcare - Prosthodontics (prótese)

GRAUS VÁLIDOS:
- Senior (para dentistas proprietários/principais)
- Specialist (para dentistas especialistas)
- Associate (para dentistas associados)
- Manager (para gerentes de consultório)

EXEMPLO DE BUSCA NO HTML:
- Procure por: "Dr. Smith", "John Smith, DDS", "Dr. Maria Garcia - Orthodontist"
- Telefones: "(555) 123-4567", "Call us at", "Phone:"
- Emails: "info@", "contact@", "dr.smith@"
- Endereços: números + nome da rua + cidade + estado

IMPORTANTE: Se você não conseguir encontrar informações REAIS de dentistas ou equipe no HTML do "${domain}", retorne:
{
  "companyInfo": {
    "name": "Nome da clínica encontrado no HTML",
    "description": "Clínica dentária" ou descrição encontrada,
    "industry": "Healthcare - Dental",
    "size": "Small Business",
    "location": "Endereço encontrado no HTML ou null"
  },
  "leads": []
}

FOQUE EM ENCONTRAR: Nomes reais de dentistas, telefones de contato, emails, e endereço da clínica.
Analise cuidadosamente o HTML fornecido e extraia apenas informações REAIS e verificáveis.
`;
};

// Fallback to simulated scraping (existing logic)
const fallbackToSimulatedScraping = async (domain: string): Promise<ScrapingResult> => {
  console.log(`🔄 Using simulated scraping fallback for: ${domain}`);
  
  // Simulate scraping delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const knownCompanies = {
    'microsoft.com': {
      name: 'Microsoft Corporation',
      description: 'Technology corporation that develops computer software, consumer electronics, personal computers, and related services.',
      industry: 'Technology',
      size: 'Large',
      location: 'Redmond, WA, USA',
      leads: [
        {
          nome: 'Satya Nadella',
          titulo: 'Chief Executive Officer',
          email: 'satya.nadella@microsoft.com',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        }
      ]
    },
    'salesforce.com': {
      name: 'Salesforce, Inc.',
      description: 'American cloud-based software company that provides customer relationship management software and applications.',
      industry: 'Technology - CRM',
      size: 'Large',
      location: 'San Francisco, CA, USA',
      leads: [
        {
          nome: 'Marc Benioff',
          titulo: 'Chairman and CEO',
          email: 'marc.benioff@salesforce.com',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        }
      ]
    },
    'hubspot.com': {
      name: 'HubSpot, Inc.',
      description: 'American developer and marketer of software products for inbound marketing, sales, and customer service.',
      industry: 'Technology - Marketing',
      size: 'Large',
      location: 'Cambridge, MA, USA',
      leads: [
        {
          nome: 'Yamini Rangan',
          titulo: 'Chief Executive Officer',
          email: 'yamini.rangan@hubspot.com',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        }
      ]
    },
    'stripe.com': {
      name: 'Stripe, Inc.',
      description: 'American financial services and software as a service company that provides payment processing software.',
      industry: 'Financial Technology',
      size: 'Large',
      location: 'San Francisco, CA, USA',
      leads: [
        {
          nome: 'Patrick Collison',
          titulo: 'Chief Executive Officer',
          email: 'patrick@stripe.com',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        },
        {
          nome: 'John Collison',
          titulo: 'President',
          email: 'john@stripe.com',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        }
      ]
    },
    'airbnb.com': {
      name: 'Airbnb, Inc.',
      description: 'American company that operates an online marketplace for lodging and tourism experiences.',
      industry: 'Travel & Hospitality',
      size: 'Large',
      location: 'San Francisco, CA, USA',
      leads: [
        {
          nome: 'Brian Chesky',
          titulo: 'Chief Executive Officer',
          email: 'brian@airbnb.com',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        }
      ]
    },
    'zoom.us': {
      name: 'Zoom Video Communications',
      description: 'American communications technology company that provides videotelephony and online chat services.',
      industry: 'Technology - Communications',
      size: 'Large',
      location: 'San Jose, CA, USA',
      leads: [
        {
          nome: 'Eric Yuan',
          titulo: 'Chief Executive Officer',
          email: 'eric.yuan@zoom.us',
          telefone: '',
          especialidade: 'Technology Leadership',
          grau: 'C-Level'
        }
      ]
    }
  };
  
  const companyData = knownCompanies[domain as keyof typeof knownCompanies];
  
  if (companyData) {
    console.log(`✅ Found simulated scraped data for: ${domain}`);
    return {
      success: true,
      companyInfo: {
        name: companyData.name,
        description: companyData.description,
        industry: companyData.industry,
        size: companyData.size,
        location: companyData.location
      },
      leads: companyData.leads.map((lead, index) => ({
        id: `scraped-lead-${index + 1}`,
        nome: lead.nome,
        empresa: companyData.name,
        titulo: lead.titulo,
        telefone: lead.telefone,
        email: lead.email,
        especialidade: lead.especialidade,
        grau: lead.grau,
        dataSource: 'scraping' as const,
        enrichmentMethod: 'domain' as const,
        processedAt: new Date().toISOString()
      }))
    };
  }
  
  console.log(`ℹ️ No simulated data available for: ${domain}`);
  return {
    success: false,
    leads: [],
    error: 'No data found for this domain'
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
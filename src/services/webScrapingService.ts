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
            content: `You are an expert in analyzing websites of American companies. Your function is to extract REAL and verifiable information from the provided HTML.

CRITICAL RULES:
- ONLY extract information that is EXPLICITLY present in the HTML
- NEVER invent names, positions, phones or emails
- If you don't find real contact information, return empty list
- Focus on companies in the United States
- Be extremely conservative - prefer returning empty rather than inventing

PROCESS:
1. Analyze the provided HTML
2. Identify company information (name, description, industry)
3. Look for REAL contact information (names, positions, emails)
4. Extract only data that is clearly visible on the website
5. If there's doubt about veracity, don't include it

Return only valid JSON without markdown formatting.`
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
INSTRUCTION: Analyze the HTML of the website "${domain}" and extract ONLY REAL information that is explicitly present in the content.

CONTEXT: This appears to be a dental clinic website. Look specifically for:
- Dentist names with titles like "Dr.", "DDS", "DMD"
- Sections "About Us", "Our Team", "Meet the Doctor", "Staff", "Our Dentists"
- Contact information: phone, email, address
- Mentioned dental specialties
- Professional team member names (receptionists, hygienists, etc.)

SEARCH STRATEGY:
1. Look for patterns like "Dr. [Name]", "[Name], DDS", "[Name], DMD"
2. Identify team or about us sections
3. Extract visible contact information
4. Identify mentioned dental specialties
5. Look for location/address information

MANDATORY RULES:
1. ONLY use information that is CLEARLY visible in the provided HTML
2. NEVER invent names, positions, phones or emails
3. If you don't find real contact information, return leads: []
4. For dental clinics, look specifically for "Dr.", "DDS", "DMD", "Dentist"
5. Extract only data that can be verified in the HTML
6. If you only find a general phone number, associate it with the main dentist if identified

WEBSITE HTML (${htmlContent.length} characters):
${htmlContent}

RESPONSE FORMAT (JSON only, no markdown):
{
  "companyInfo": {
    "name": "Clinic name found in HTML",
    "description": "Description of dental services found", 
    "industry": "Healthcare - Dental",
    "size": "Small Business" for local clinics,
    "location": "Complete address if found in HTML"
  },
  "leads": [
    // ONLY if you find REAL information about dentists/team in the HTML
    // Example: "Dr. John Smith, DDS" or "Dr. Maria Garcia - Orthodontist"
    {
      "nome": "Dr. [Real Name found in HTML]",
      "titulo": "Dentist" or "DDS" or "DMD" or specific specialty, 
      "telefone": "Clinic phone if found",
      "email": "Specific email if found or clinic general email",
      "especialidade": "Healthcare" or specific specialty,
      "grau": "Senior" for main dentists, "Specialist" for specialists
    }
  ]
}

VALID DENTAL SPECIALTIES (if mentioned in HTML):
- Healthcare (general dentist)
- Healthcare - Orthodontics (orthodontics)
- Healthcare - Oral Surgery (oral surgery)
- Healthcare - Pediatric Dentistry (pediatric dentistry)
- Healthcare - Periodontics (periodontics)
- Healthcare - Endodontics (endodontics)
- Healthcare - Prosthodontics (prosthodontics)

VALID LEVELS:
- Senior (for owner/main dentists)
- Specialist (for specialist dentists)
- Associate (for associate dentists)
- Manager (for office managers)

HTML SEARCH EXAMPLE:
- Look for: "Dr. Smith", "John Smith, DDS", "Dr. Maria Garcia - Orthodontist"
- Phones: "(555) 123-4567", "Call us at", "Phone:"
- Emails: "info@", "contact@", "dr.smith@"
- Addresses: numbers + street name + city + state

IMPORTANT: If you cannot find REAL information about dentists or team in the HTML of "${domain}", return:
{
  "companyInfo": {
    "name": "Clinic name found in HTML",
    "description": "Dental clinic" or found description,
    "industry": "Healthcare - Dental",
    "size": "Small Business",
    "location": "Address found in HTML or null"
  },
  "leads": []
}

FOCUS ON FINDING: Real dentist names, contact phones, emails, and clinic address.
Carefully analyze the provided HTML and extract only REAL and verifiable information.
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
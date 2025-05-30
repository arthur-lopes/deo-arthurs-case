const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

class WebScrapingService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
    this.useHeadless = process.env.NODE_ENV === 'production' ? 'new' : true;
    this.timeout = 20000; // Reduced from 60s to 20s - faster fallback when SerpAPI has data
    this.puppeteerTimeout = 10000; // Reduced from 30s to 10s for faster response
  }

  async scrapeDomain(domain) {
    console.log(`🕷️ Starting web scraping for: ${domain}`);

    try {
      // Add overall timeout for the entire scraping process
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Web scraping timeout')), this.timeout);
      });

      const scrapingPromise = this.performScraping(domain);
      
      return await Promise.race([scrapingPromise, timeoutPromise]);

    } catch (error) {
      console.error(`❌ Web scraping failed for ${domain}:`, error.message);
      return await this.fallbackScraping(domain);
    }
  }

  async performScraping(domain) {
    // Step 1: Extract HTML from website
    const htmlContent = await this.extractWebsiteHTML(domain);
    
    if (!htmlContent || htmlContent.length < 100) {
      console.log(`❌ Could not extract meaningful HTML from: ${domain}`);
      return await this.fallbackScraping(domain);
    }

    // Step 2: Analyze with OpenAI if available
    if (this.openaiApiKey) {
      console.log(`🤖 Analyzing scraped HTML with OpenAI for: ${domain}`);
      try {
        return await this.analyzeWithOpenAI(domain, htmlContent);
      } catch (error) {
        console.log(`❌ OpenAI analysis failed, using basic parsing: ${error.message}`);
        return await this.basicHtmlParsing(domain, htmlContent);
      }
    } else {
      console.log(`📊 Using basic HTML parsing for: ${domain}`);
      return await this.basicHtmlParsing(domain, htmlContent);
    }
  }

  async extractWebsiteHTML(domain) {
    let browser = null;
    
    try {
      console.log(`📄 Extracting HTML from: https://${domain}`);
      
      // Launch Puppeteer with updated configuration for v24.x
      browser = await puppeteer.launch({
        headless: this.useHeadless,
        timeout: this.puppeteerTimeout,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-features=HttpsFirstBalancedModeAutoEnable', // Fix for Chrome 24.x
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-ipc-flooding-protection'
        ],
        // Improved error handling
        ignoreDefaultArgs: false,
        dumpio: false
      });

      const page = await browser.newPage();
      
      // Set user agent and viewport with updated values
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1366, height: 768 });

      // Set timeouts
      page.setDefaultNavigationTimeout(this.puppeteerTimeout);
      page.setDefaultTimeout(this.puppeteerTimeout);

      // Enhanced error handling for navigation
      try {
        await page.goto(`https://${domain}`, {
          waitUntil: 'domcontentloaded', // Changed from networkidle2 for better performance
          timeout: this.puppeteerTimeout
        });

        // Wait for dynamic content with shorter timeout - FIXED for Puppeteer 24.x
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Try to wait for common content selectors
        try {
          await page.waitForSelector('body', { timeout: 5000 });
        } catch (selectorError) {
          console.log(`⚠️ Body selector timeout for ${domain}, continuing...`);
        }

      } catch (navigationError) {
        console.log(`⚠️ Navigation error for ${domain}, trying HTTP fallback:`, navigationError.message);
        
        // Try HTTP if HTTPS fails
        await page.goto(`http://${domain}`, {
          waitUntil: 'domcontentloaded',
          timeout: this.puppeteerTimeout
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Get page content with error handling
      let html;
      try {
        html = await page.content();
      } catch (contentError) {
        console.log(`⚠️ Content extraction error for ${domain}:`, contentError.message);
        html = await page.evaluate(() => document.documentElement.outerHTML);
      }
      
      // Clean and limit HTML - increased limit for better analysis
      const cleanedHtml = this.cleanHTML(html);
      const limitedHtml = cleanedHtml.length > 20000 
        ? cleanedHtml.substring(0, 20000) + '...'
        : cleanedHtml;

      console.log(`✅ Successfully extracted ${limitedHtml.length} characters of HTML`);
      return limitedHtml;

    } catch (error) {
      console.log(`❌ Puppeteer failed for ${domain}, trying fallback methods:`, error.message);
      
      // Fallback to axios with proxies
      return await this.fallbackHttpRequest(domain);
      
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.log('⚠️ Warning: Error closing browser:', closeError.message);
        }
      }
    }
  }

  async fallbackHttpRequest(domain) {
    // Reduced attempts - only the most reliable methods
    const attempts = [
      // Try simple HTTP requests first
      {
        url: `https://${domain}`,
        method: 'direct-https',
        headers: this.getStandardHeaders()
      },
      {
        url: `http://${domain}`,
        method: 'direct-http',
        headers: this.getStandardHeaders()
      }
    ];

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      try {
        console.log(`🔄 Trying ${attempt.method} (${i + 1}/${attempts.length})`);
        
        const response = await axios.get(attempt.url, {
          timeout: 8000, // Reduced timeout
          headers: {
            ...this.getStandardHeaders(),
            ...attempt.headers
          },
          maxRedirects: 2, // Reduced redirects
          validateStatus: (status) => status < 500, // Accept 4xx but not 5xx
          responseType: 'text'
        });

        let html = response.data;

        // Validate HTML content
        if (html && typeof html === 'string' && html.length > 100) {
          // Check if it looks like actual HTML
          if (html.includes('<html') || html.includes('<body') || html.includes('<head')) {
            const cleanedHtml = this.cleanHTML(html);
            const limitedHtml = cleanedHtml.length > 15000 
              ? cleanedHtml.substring(0, 15000) + '...'
              : cleanedHtml;
            
            console.log(`✅ ${attempt.method} succeeded, extracted ${limitedHtml.length} characters`);
            return limitedHtml;
          } else {
            console.log(`⚠️ ${attempt.method} returned non-HTML content, trying next method`);
          }
        } else {
          console.log(`⚠️ ${attempt.method} returned insufficient content`);
        }

      } catch (error) {
        console.log(`❌ ${attempt.method} failed:`, error.message);
      }
    }

    // SIMPLIFIED: No additional attempts - fail fast when SerpAPI already has data
    throw new Error('Direct HTTP methods failed - skipping additional proxies to prioritize SerpAPI data');
  }

  getStandardHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none'
    };
  }

  cleanHTML(html) {
    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, noscript, iframe, object, embed').remove();
    $('nav, footer, .nav, .footer, .sidebar, .ads, .advertisement').remove();
    
    // Focus on content areas
    const contentSelectors = [
      'main', '.main', '#main',
      '.content', '#content',
      '.about', '#about',
      '.team', '#team',
      '.contact', '#contact',
      'article', '.article',
      'section', '.section'
    ];

    let extractedContent = '';
    
    // Try to extract from specific content areas first
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        extractedContent += element.text() + '\n';
      }
    }

    // If no specific content found, get body text
    if (extractedContent.length < 200) {
      extractedContent = $('body').text();
    }

    // Clean up text
    return extractedContent
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  async analyzeWithOpenAI(domain, htmlContent) {
    try {
      const prompt = this.createAnalysisPrompt(domain, htmlContent);
      
      const response = await axios.post(this.openaiUrl, {
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

Retorne apenas JSON válido sem formatação markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // Add timeout for OpenAI request
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
        id: `scraped-lead-${index + 1}`,
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
          description: 'Information extracted from website',
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        leads
      };

    } catch (error) {
      console.error('❌ OpenAI analysis failed:', error.message);
      throw error;
    }
  }

  async basicHtmlParsing(domain, htmlContent) {
    console.log(`📊 Using basic HTML parsing for: ${domain}`);
    
    const $ = cheerio.load(htmlContent);
    const companyName = this.extractCompanyName(domain);
    
    // Extract all emails from the content
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = htmlContent.match(emailRegex) || [];
    
    // Filter out common placeholder emails
    const validEmails = foundEmails.filter(email => 
      !email.includes('example.com') && 
      !email.includes('placeholder') &&
      !email.includes('noreply') &&
      !email.includes('no-reply') &&
      !email.includes('donotreply')
    );

    console.log(`📧 Found ${validEmails.length} valid emails: ${validEmails.join(', ')}`);

    // Extract phone numbers
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const foundPhones = htmlContent.match(phoneRegex) || [];
    const validPhones = foundPhones.slice(0, 3); // Limit to 3 phones

    // Look for executive names and titles with improved patterns
    const leads = [];
    const executivePatterns = [
      // Pattern: Name + Title
      /([A-Z][a-z]+ [A-Z][a-z]+),?\s*-?\s*(CEO|Chief Executive Officer|President|Founder|Co-Founder|CTO|Chief Technology Officer|CFO|Chief Financial Officer|COO|Chief Operating Officer|VP|Vice President|Director|Managing Director)/gi,
      // Pattern: Title + Name
      /(CEO|Chief Executive Officer|President|Founder|Co-Founder|CTO|CFO|COO|VP|Vice President|Director)[\s:,-]+([A-Z][a-z]+ [A-Z][a-z]+)/gi,
      // Pattern: Dr. Name
      /Dr\.?\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi
    ];

    // Extract names and titles
    const foundExecutives = [];
    
    executivePatterns.forEach(pattern => {
      const matches = [...htmlContent.matchAll(pattern)];
      matches.forEach(match => {
        let name, title;
        
        if (match[0].toLowerCase().startsWith('dr.')) {
          name = match[1];
          title = 'Doctor';
        } else if (['ceo', 'president', 'founder', 'cto', 'cfo', 'coo', 'vp', 'director'].some(t => 
                    match[1].toLowerCase().includes(t))) {
          title = match[1];
          name = match[2];
        } else {
          name = match[1];
          title = match[2];
        }
        
        if (name && title && name.length > 3 && name.includes(' ')) {
          foundExecutives.push({
            nome: name.trim(),
            titulo: title.trim(),
            email: '',
            telefone: ''
          });
        }
      });
    });

    // Try to match emails with executives (look for emails near names)
    foundExecutives.forEach(exec => {
      const firstName = exec.nome.split(' ')[0].toLowerCase();
      const lastName = exec.nome.split(' ').slice(-1)[0].toLowerCase();
      
      // Look for emails that might belong to this person
      const possibleEmails = validEmails.filter(email => {
        const emailPrefix = email.split('@')[0].toLowerCase();
        return emailPrefix.includes(firstName) || 
               emailPrefix.includes(lastName) ||
               emailPrefix.includes(firstName + '.' + lastName) ||
               emailPrefix.includes(firstName + lastName) ||
               emailPrefix.includes(exec.titulo.toLowerCase().substring(0, 3));
      });
      
      if (possibleEmails.length > 0) {
        exec.email = possibleEmails[0];
      }
    });

    // Remove duplicates and assign remaining emails to executives without emails
    const uniqueExecutives = foundExecutives
      .filter((exec, index, self) =>
        index === self.findIndex(e => e.nome.toLowerCase() === exec.nome.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 executives

    // Assign remaining emails to executives without emails
    let emailIndex = 0;
    uniqueExecutives.forEach(exec => {
      if (!exec.email && emailIndex < validEmails.length) {
        // Skip emails already assigned
        const usedEmails = uniqueExecutives.map(e => e.email).filter(e => e);
        while (emailIndex < validEmails.length && usedEmails.includes(validEmails[emailIndex])) {
          emailIndex++;
        }
        if (emailIndex < validEmails.length) {
          exec.email = validEmails[emailIndex];
          emailIndex++;
        }
      }
      
      // Assign phone if not assigned
      if (!exec.telefone && validPhones.length > 0) {
        exec.telefone = validPhones[0];
      }
    });

    // Create formatted leads
    const formattedLeads = uniqueExecutives.map((exec, index) => ({
      id: `basic-lead-${index + 1}`,
      nome: exec.nome,
      empresa: companyName,
      titulo: exec.titulo,
      telefone: exec.telefone || '',
      email: exec.email || '',
      especialidade: this.mapTitleToSpecialty(exec.titulo),
      grau: this.mapTitleToGrade(exec.titulo),
      dataSource: 'scraping',
      enrichmentMethod: 'domain',
      processedAt: new Date().toISOString()
    }));

    // If no executives found but emails exist, create generic leads
    if (formattedLeads.length === 0 && validEmails.length > 0) {
      validEmails.slice(0, 3).forEach((email, index) => {
        formattedLeads.push({
          id: `email-lead-${index + 1}`,
          nome: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          empresa: companyName,
          titulo: 'Contact',
          telefone: validPhones[index] || '',
          email: email,
          especialidade: 'General',
          grau: 'Associate',
          dataSource: 'scraping',
          enrichmentMethod: 'domain',
          processedAt: new Date().toISOString()
        });
      });
    }

    console.log(`✅ Basic parsing found ${formattedLeads.length} leads for: ${domain}`);

    return {
      success: formattedLeads.length > 0,
      companyInfo: {
        name: companyName,
        description: 'Information extracted from website (basic parsing)',
        industry: 'Unknown',
        size: 'Small Business',
        location: 'Unknown'
      },
      leads: formattedLeads
    };
  }

  mapTitleToSpecialty(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('ceo') || titleLower.includes('president') || titleLower.includes('founder')) {
      return 'Executive Leadership';
    }
    if (titleLower.includes('cto') || titleLower.includes('technology')) {
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
    return 'General';
  }

  mapTitleToGrade(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('ceo') || titleLower.includes('president') || titleLower.includes('founder')) {
      return 'C-Level';
    }
    if (titleLower.includes('director') || titleLower.includes('vp') || titleLower.includes('vice president')) {
      return 'Director';
    }
    if (titleLower.includes('manager') || titleLower.includes('lead')) {
      return 'Manager';
    }
    if (titleLower.includes('senior')) {
      return 'Senior';
    }
    return 'Associate';
  }

  async fallbackScraping(domain) {
    console.log(`🔄 Using fallback scraping for: ${domain}`);
    
    // NO MOCK DATA - if we can't scrape real data, return empty
    console.log(`❌ No real data could be extracted for: ${domain}`);
    
    return {
      success: false,
      leads: [],
      companyInfo: null,
      error: 'Web scraping failed - no real data found',
      metadata: {
        source: 'scraping-fallback',
        note: 'All scraping methods failed to extract real data'
      }
    };
  }

  createAnalysisPrompt(domain, htmlContent) {
    return `
INSTRUÇÃO: Analise o conteúdo do website "${domain}" e extraia APENAS informações REAIS de contato que estão explicitamente presentes no HTML.

FOCO PRIORITÁRIO - BUSCAR POR:
1. EMAILS EXPLÍCITOS - Qualquer endereço com @ no conteúdo
2. NOMES + TÍTULOS - Pessoas com cargos executivos (CEO, Founder, CTO, etc)
3. INFORMAÇÕES DE CONTATO - telefones, endereços, emails
4. SEÇÕES ESPECÍFICAS - "About Us", "Our Team", "Contact", "Staff", "Leadership"

CONTEXTO: Este é o HTML completo do website da empresa. Procure especificamente por:
- Endereços de email (qualquer texto com @)
- Nomes de pessoas com títulos profissionais
- Informações de contato empresarial
- Seções de equipe ou liderança

REGRAS OBRIGATÓRIAS:
1. EXTRAIA TODOS os emails encontrados no conteúdo
2. Associe emails com nomes quando possível
3. NUNCA invente emails - apenas use os encontrados
4. Priorize executivos e liderança da empresa
5. Se encontrar email sem nome associado, ainda inclua
6. Procure por padrões como "email:", "contact:", "reach out:"

CONTEÚDO DO WEBSITE (${htmlContent.length} caracteres):
${htmlContent.substring(0, 15000)}${htmlContent.length > 15000 ? '...[truncated]' : ''}

FORMATO DE RESPOSTA (JSON apenas, sem markdown):
{
  "companyInfo": {
    "name": "Nome da empresa encontrado no conteúdo",
    "description": "Descrição dos serviços encontrada", 
    "industry": "Setor identificado",
    "size": "Tamanho estimado da empresa",
    "location": "Localização se mencionada"
  },
  "leads": [
    {
      "nome": "Nome REAL encontrado no conteúdo",
      "titulo": "Cargo REAL encontrado (CEO, Founder, etc)", 
      "telefone": "Telefone encontrado ou deixe vazio",
      "email": "EMAIL REAL encontrado - PRIORIDADE MÁXIMA",
      "especialidade": "Especialidade baseada no cargo",
      "grau": "Nível hierárquico baseado no cargo"
    }
  ]
}

IMPORTANTE: 
- Procure ativamente por qualquer texto que contenha "@"
- Se encontrar emails mas não conseguir associar nomes, crie leads genéricos
- Extraia TODOS os emails válidos encontrados
- Analise seções de contato, sobre nós, equipe
- Priorize qualidade: emails reais > nomes sem email

Se não encontrar informações REAIS de contato, retorne leads: []
Analise cuidadosamente TODO o conteúdo procurando por emails e informações de contato.
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

module.exports = new WebScrapingService(); 
const express = require('express');
const router = express.Router();
const { validateDomain } = require('../middleware/validation');
const { getCachedResult, setCachedResult } = require('../middleware/cache');
const openaiService = require('../services/openaiService');
const serpApiService = require('../services/serpApiService');
const webScrapingService = require('../services/webScrapingService');
const externalApiService = require('../services/externalApiService');
const hybridEnrichmentService = require('../services/hybridEnrichmentService');
const emailEnrichmentService = require('../services/emailEnrichmentService');

// Timeout configuration
const ENRICHMENT_TIMEOUT = 120000; // 120 seconds total timeout - aligned with frontend timeout

// Main domain enrichment endpoint
router.post('/domain', validateDomain, getCachedResult, async (req, res) => {
  try {
    const { domain } = req.body;
    console.log(`🔍 Starting enrichment for domain: ${domain}`);

    // Single timeout with proper error handling
    const result = await Promise.race([
      performEnrichment(domain, req),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Enrichment process timeout - taking too long'));
        }, ENRICHMENT_TIMEOUT);
      })
    ]);

    res.json(result);

  } catch (error) {
    console.error(`❌ Domain enrichment failed for ${req.body.domain}:`, error.message);
    
    // Ensure we don't crash the server - always return a proper HTTP response
    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        leads: [],
        error: error.message.includes('timeout') 
          ? 'Enrichment timeout - unable to process domain within time limit'
          : 'No data found for this domain',
        message: `Unable to find enrichment data for domain: ${req.body.domain}`,
        metadata: {
          domain: req.body.domain,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - (req.startTime || Date.now()),
          attempted_methods: ['hybrid', 'openai', 'external']
        }
      });
    }
  }
});

async function performEnrichment(domain, req) {
  let result = null;
  let source = 'unknown';

  try {
    // 1. Try Hybrid Enrichment first (SerpAPI + Web Scraping + OpenAI)
    try {
      console.log(`🔄 Trying hybrid enrichment (SerpAPI + Web Scraping) for: ${domain}`);
      
      // Give hybrid enrichment 100 seconds
      const hybridPromise = hybridEnrichmentService.enrichDomain(domain);
      const hybridTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Hybrid enrichment timeout')), 100000);
      });
      
      result = await Promise.race([hybridPromise, hybridTimeout]);
      if (result.success && result.leads.length > 0) {
        source = 'hybrid';
        console.log(`✅ Hybrid enrichment found ${result.leads.length} leads for: ${domain}`);
      } else {
        console.log(`ℹ️ Hybrid enrichment found no data for: ${domain}`);
        result = null;
      }
    } catch (hybridError) {
      console.log(`❌ Hybrid enrichment failed for ${domain}: ${hybridError.message}`);
      result = null;
    }

    // 2. Try OpenAI direct analysis if hybrid failed
    if (!result) {
      try {
        console.log(`🤖 Trying OpenAI direct analysis for: ${domain}`);
        const openaiPromise = openaiService.enrichDomain(domain);
        const openaiTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('OpenAI timeout')), 8000);
        });
        
        result = await Promise.race([openaiPromise, openaiTimeout]);
        if (result.success && result.leads.length > 0) {
          source = 'openai';
          console.log(`✅ OpenAI found ${result.leads.length} leads for: ${domain}`);
        } else {
          console.log(`ℹ️ OpenAI found no data for: ${domain}`);
          result = null;
        }
      } catch (error) {
        console.log(`❌ OpenAI failed for ${domain}:`, error.message);
      }
    }

    // 3. Try External APIs if all else failed
    if (!result) {
      try {
        console.log(`🔌 Trying external APIs for: ${domain}`);
        const externalPromise = externalApiService.enrichDomain(domain);
        const externalTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('External APIs timeout')), 8000);
        });
        
        result = await Promise.race([externalPromise, externalTimeout]);
        if (result.success && result.leads.length > 0) {
          source = 'external';
          console.log(`✅ External APIs found ${result.leads.length} leads for: ${domain}`);
        } else {
          console.log(`ℹ️ External APIs found no data for: ${domain}`);
          result = null;
        }
      } catch (error) {
        console.log(`❌ External APIs failed for ${domain}:`, error.message);
      }
    }

    // 4. If no real data found, throw error instead of returning mock data
    if (!result) {
      console.log(`❌ No real data found for: ${domain} - all methods exhausted`);
      throw new Error(`No enrichment data available for domain: ${domain}. All data sources returned empty results.`);
    }

    // Add metadata
    const enrichedResult = {
      ...result,
      metadata: {
        domain,
        source,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - req.startTime,
        ...result.metadata // Preserve any existing metadata from hybrid service
      }
    };

    // Cache the result only if we have real data
    setCachedResult(req, enrichedResult);

    return enrichedResult;
  } catch (error) {
    console.error(`❌ Enrichment process failed for ${domain}:`, error);
    throw error;
  }
}

// Individual service endpoints
router.post('/hybrid', validateDomain, async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await hybridEnrichmentService.enrichDomain(domain);
    
    if (!result.success || result.leads.length === 0) {
      return res.status(404).json({
        success: false,
        leads: [],
        error: 'No data found via hybrid enrichment',
        message: `Hybrid enrichment found no data for domain: ${domain}`
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Hybrid enrichment service error',
      message: error.message
    });
  }
});

router.post('/openai', validateDomain, async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await openaiService.enrichDomain(domain);
    
    if (!result.success || result.leads.length === 0) {
      return res.status(404).json({
        success: false,
        leads: [],
        error: 'No data found via OpenAI',
        message: `OpenAI found no data for domain: ${domain}`
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'OpenAI service error',
      message: error.message
    });
  }
});

router.post('/scrape', validateDomain, async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await webScrapingService.scrapeDomain(domain);
    
    if (!result.success || result.leads.length === 0) {
      return res.status(404).json({
        success: false,
        leads: [],
        error: 'No data found via web scraping',
        message: `Web scraping found no data for domain: ${domain}`
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Web scraping service error',
      message: error.message
    });
  }
});

router.post('/serpapi', validateDomain, async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await serpApiService.searchDomain(domain);
    
    if (!result.success || result.leads.length === 0) {
      return res.status(404).json({
        success: false,
        leads: [],
        error: 'No data found via SerpAPI',
        message: `SerpAPI found no data for domain: ${domain}`
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'SerpAPI service error',
      message: error.message
    });
  }
});

router.post('/external', validateDomain, async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await externalApiService.enrichDomain(domain);
    
    if (!result.success || result.leads.length === 0) {
      return res.status(404).json({
        success: false,
        leads: [],
        error: 'No data found via external APIs',
        message: `External APIs found no data for domain: ${domain}`
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'External API service error',
      message: error.message
    });
  }
});

// Email enrichment endpoint - NEW
router.post('/email', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`📧 Starting email enrichment for: ${email}`);

    // Set timeout for email enrichment
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email enrichment timeout')), 60000); // Increased to 60 seconds
    });

    const enrichmentPromise = emailEnrichmentService.enrichByEmail(email);
    
    const result = await Promise.race([enrichmentPromise, timeoutPromise]);

    if (!result.success || !result.lead) {
      return res.status(404).json({
        success: false,
        email: email,
        lead: null,
        error: 'No data found for this email',
        message: `Unable to find enrichment data for email: ${email}`,
        metadata: {
          email: email,
          timestamp: new Date().toISOString(),
          source: 'email-enrichment'
        }
      });
    }

    res.json(result);

  } catch (error) {
    console.error(`❌ Email enrichment failed for ${req.body.email}:`, error);
    
    res.status(500).json({
      success: false,
      email: req.body.email,
      lead: null,
      error: error.message.includes('timeout') 
        ? 'Email enrichment timeout - taking too long'
        : 'Email enrichment service error',
      message: `Unable to process email enrichment: ${error.message}`,
      metadata: {
        email: req.body.email,
        timestamp: new Date().toISOString(),
        source: 'email-enrichment'
      }
    });
  }
});

// API status endpoint
router.get('/status', (req, res) => {
  const status = {
    apis: {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        status: process.env.OPENAI_API_KEY ? 'ready' : 'not configured'
      },
      serpapi: {
        configured: !!process.env.SERPAPI_KEY,
        status: process.env.SERPAPI_KEY ? 'ready' : 'not configured'
      },
      hunter: {
        configured: !!process.env.HUNTER_API_KEY,
        status: process.env.HUNTER_API_KEY ? 'ready' : 'not configured'
      },
      apollo: {
        configured: !!process.env.APOLLO_API_KEY,
        status: process.env.APOLLO_API_KEY ? 'ready' : 'not configured'
      },
      clearbit: {
        configured: !!process.env.CLEARBIT_API_KEY,
        status: process.env.CLEARBIT_API_KEY ? 'ready' : 'not configured'
      }
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    },
    enrichment: {
      strategy: 'hybrid-first',
      timeout: ENRICHMENT_TIMEOUT,
      methods: ['hybrid', 'openai', 'external'],
      mock_data: false // Explicitly indicate no mock data
    }
  };

  res.json(status);
});

module.exports = router; 
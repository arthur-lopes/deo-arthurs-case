const express = require('express');
const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };

  res.json(healthCheck);
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  const startTime = Date.now();
  
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    
    // System info
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    },
    
    // API configurations
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
    
    // Performance metrics
    performance: {
      responseTime: Date.now() - startTime,
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    }
  };

  res.json(healthCheck);
});

// Readiness probe (for Kubernetes)
router.get('/ready', (req, res) => {
  // Check if essential services are ready
  const isReady = true; // Add actual readiness checks here
  
  if (isReady) {
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness probe (for Kubernetes)
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API connectivity test
router.get('/apis', async (req, res) => {
  const apiTests = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  // Test OpenAI connectivity
  if (process.env.OPENAI_API_KEY) {
    try {
      const axios = require('axios');
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        timeout: 5000
      });
      
      apiTests.tests.openai = {
        status: 'connected',
        responseTime: response.headers['x-response-time'] || 'unknown',
        modelsCount: response.data?.data?.length || 0
      };
    } catch (error) {
      apiTests.tests.openai = {
        status: 'error',
        error: error.message
      };
    }
  } else {
    apiTests.tests.openai = {
      status: 'not configured'
    };
  }

  // Test SerpAPI connectivity
  if (process.env.SERPAPI_KEY) {
    try {
      const axios = require('axios');
      const response = await axios.get('https://serpapi.com/account', {
        params: {
          api_key: process.env.SERPAPI_KEY
        },
        timeout: 5000
      });
      
      apiTests.tests.serpapi = {
        status: 'connected',
        account: response.data?.account_email || 'unknown'
      };
    } catch (error) {
      apiTests.tests.serpapi = {
        status: 'error',
        error: error.message
      };
    }
  } else {
    apiTests.tests.serpapi = {
      status: 'not configured'
    };
  }

  // Add other API tests as needed...

  res.json(apiTests);
});

module.exports = router; 
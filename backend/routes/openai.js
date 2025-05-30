const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');

// Generic OpenAI analysis endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { prompt, maxTokens = 500 } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
        message: 'Please provide a valid prompt string'
      });
    }

    console.log(`🤖 Starting OpenAI analysis...`);

    // Call OpenAI service with custom prompt
    const result = await openaiService.analyzeText(prompt, maxTokens);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI analysis failed',
        message: result.error || 'Unable to process analysis'
      });
    }

    res.json({
      success: true,
      result: result.analysis,
      metadata: {
        timestamp: new Date().toISOString(),
        tokensUsed: result.tokensUsed || 0,
        model: result.model || 'gpt-3.5-turbo'
      }
    });

  } catch (error) {
    console.error(`❌ OpenAI analysis failed:`, error);
    
    res.status(500).json({
      success: false,
      error: 'OpenAI service error',
      message: error.message,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'openai-analysis'
      }
    });
  }
});

// Health check for OpenAI service
router.get('/health', (req, res) => {
  const isConfigured = !!process.env.OPENAI_API_KEY;
  
  res.json({
    service: 'OpenAI',
    configured: isConfigured,
    status: isConfigured ? 'ready' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 
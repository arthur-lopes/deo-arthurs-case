const validateDomain = (req, res, next) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({
      success: false,
      error: 'Domain is required',
      message: 'Please provide a domain in the request body'
    });
  }

  // Enhanced domain validation to support .com.br, .co.uk, etc.
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  
  if (!domainRegex.test(domain)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid domain format',
      message: 'Please provide a valid domain (e.g., example.com)'
    });
  }

  // Remove protocol if present
  req.body.domain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  
  // Add start time for performance tracking
  req.startTime = Date.now();
  
  next();
};

const validateApiKey = (requiredKey) => {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required',
        message: 'Please provide an API key in the X-API-Key header or api_key query parameter'
      });
    }

    if (apiKey !== requiredKey) {
      return res.status(403).json({
        success: false,
        error: 'Invalid API key',
        message: 'The provided API key is invalid'
      });
    }

    next();
  };
};

const validateRequestSize = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return res.status(413).json({
      success: false,
      error: 'Request too large',
      message: 'Request body exceeds 10MB limit'
    });
  }

  next();
};

module.exports = {
  validateDomain,
  validateApiKey,
  validateRequestSize
}; 
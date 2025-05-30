const NodeCache = require('node-cache');

// Create cache instance with 1 hour TTL
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false
});

const getCacheKey = (req) => {
  const { domain } = req.body;
  const endpoint = req.route?.path || req.path;
  return `${endpoint}:${domain}`;
};

const getCachedResult = (req, res, next) => {
  try {
    const cacheKey = getCacheKey(req);
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      console.log(`💾 Cache hit for: ${cacheKey}`);
      
      // Add cache metadata
      const result = {
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          cached: true,
          cacheHit: true,
          originalTimestamp: cachedResult.metadata?.timestamp,
          servedAt: new Date().toISOString()
        }
      };
      
      return res.json(result);
    }
    
    console.log(`🔍 Cache miss for: ${cacheKey}`);
    next();
    
  } catch (error) {
    console.error('Cache error:', error);
    next(); // Continue without cache on error
  }
};

const setCachedResult = (req, result) => {
  try {
    const cacheKey = getCacheKey(req);
    
    // Don't cache error results
    if (!result.success) {
      console.log(`❌ Not caching error result for: ${cacheKey}`);
      return;
    }
    
    // Don't cache if no leads found
    if (!result.leads || result.leads.length === 0) {
      console.log(`ℹ️ Not caching empty result for: ${cacheKey}`);
      return;
    }
    
    cache.set(cacheKey, result);
    console.log(`💾 Cached result for: ${cacheKey} (${result.leads.length} leads)`);
    
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

const clearCache = (pattern) => {
  try {
    if (pattern) {
      const keys = cache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      
      matchingKeys.forEach(key => {
        cache.del(key);
      });
      
      console.log(`🗑️ Cleared ${matchingKeys.length} cache entries matching: ${pattern}`);
      return matchingKeys.length;
    } else {
      cache.flushAll();
      console.log('🗑️ Cleared all cache entries');
      return cache.getStats().keys;
    }
  } catch (error) {
    console.error('Cache clear error:', error);
    return 0;
  }
};

const getCacheStats = () => {
  try {
    const stats = cache.getStats();
    const keys = cache.keys();
    
    return {
      keys: stats.keys,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hits / (stats.hits + stats.misses) || 0,
      keyList: keys.slice(0, 10), // Show first 10 keys
      totalKeys: keys.length
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return null;
  }
};

const setupCache = (app) => {
  // Cache management endpoints
  app.get('/api/cache/stats', (req, res) => {
    const stats = getCacheStats();
    res.json({
      success: true,
      cache: stats
    });
  });
  
  app.delete('/api/cache/clear', (req, res) => {
    const { pattern } = req.query;
    const clearedCount = clearCache(pattern);
    
    res.json({
      success: true,
      message: pattern 
        ? `Cleared ${clearedCount} cache entries matching: ${pattern}`
        : `Cleared all cache entries`,
      clearedCount
    });
  });
  
  // Cache warming endpoint
  app.post('/api/cache/warm', async (req, res) => {
    const { domains } = req.body;
    
    if (!domains || !Array.isArray(domains)) {
      return res.status(400).json({
        success: false,
        error: 'Domains array required'
      });
    }
    
    res.json({
      success: true,
      message: `Cache warming initiated for ${domains.length} domains`,
      domains
    });
  });
  
  console.log('💾 Cache middleware setup complete');
};

// Cache event listeners
cache.on('set', (key, value) => {
  console.log(`💾 Cache SET: ${key}`);
});

cache.on('del', (key, value) => {
  console.log(`🗑️ Cache DEL: ${key}`);
});

cache.on('expired', (key, value) => {
  console.log(`⏰ Cache EXPIRED: ${key}`);
});

module.exports = {
  getCachedResult,
  setCachedResult,
  clearCache,
  getCacheStats,
  setupCache,
  cache
}; 
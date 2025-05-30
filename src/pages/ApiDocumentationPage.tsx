import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Server, 
  Globe, 
  Zap, 
  Database, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Copy, 
  ExternalLink,
  Brain,
  Activity,
  Settings,
  Search,
  Target,
  Clock,
  AlertCircle,
  FileText,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const ApiDocumentationPage = () => {
  const navigate = useNavigate();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      id: 'domain-enrichment',
      method: 'POST',
      path: '/api/enrichment/domain',
      title: 'Domain Enrichment',
      description: 'Enriches company data using domain/website information',
      category: 'enrichment',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      requestBody: {
        domain: 'string (required) - Company domain (e.g., microsoft.com)',
        options: {
          maxResults: 'number (optional) - Maximum results (default: 5)',
          includeEmails: 'boolean (optional) - Include found emails (default: true)',
          priority: 'string (optional) - Priority: "hybrid", "openai", "external" (default: "hybrid")'
        }
      },
      responseExample: {
        success: true,
        data: {
          company: {
            name: 'Microsoft Corporation',
            domain: 'microsoft.com',
            industry: 'Technology',
            size: 'Enterprise',
            description: 'Global technology company'
          },
          leads: [
            {
              nome: 'Satya Nadella',
              empresa: 'Microsoft',
              titulo: 'CEO',
              email: 'satya@microsoft.com',
              especialidade: 'Executive Leadership',
              grau: 'C-Level',
              telefone: '',
              dataSource: 'hybrid',
              enrichmentMethod: 'domain-search',
              processedAt: '2024-01-01T12:00:00Z'
            }
          ],
          metadata: {
            source: 'hybrid',
            processingTime: 45000,
            totalFound: 5,
            cached: false
          }
        }
      },
      errorCodes: [
        { code: 400, message: 'Invalid or empty domain' },
        { code: 429, message: 'Rate limit exceeded' },
        { code: 500, message: 'Internal server error' }
      ]
    },
    {
      id: 'hybrid-enrichment',
      method: 'POST',
      path: '/api/enrichment/hybrid',
      title: 'Hybrid Enrichment',
      description: 'Combines multiple sources (SerpAPI + Web Scraping + OpenAI) for maximum accuracy',
      category: 'enrichment',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      requestBody: {
        domain: 'string (required) - Company domain',
        companyName: 'string (optional) - Company name for better context',
        industry: 'string (optional) - Company industry',
        maxResults: 'number (optional) - Maximum results (default: 5)'
      },
      responseExample: {
        success: true,
        data: {
          leads: [
            {
              nome: 'John Smith',
              empresa: 'TechCorp',
              titulo: 'VP of Engineering',
              email: 'john.smith@techcorp.com',
              especialidade: 'Technology Leadership',
              grau: 'Senior',
              telefone: '+1-555-0123',
              dataSource: 'hybrid',
              enrichmentMethod: 'serpapi+scraping+openai',
              processedAt: '2024-01-01T12:00:00Z'
            }
          ],
          metadata: {
            sources: ['serpapi', 'web-scraping', 'openai'],
            processingTime: 62000,
            deduplicatedResults: 3,
            totalProcessed: 8
          }
        }
      },
      errorCodes: [
        { code: 400, message: 'Invalid parameters' },
        { code: 408, message: 'Processing timeout' },
        { code: 503, message: 'External services unavailable' }
      ]
    },
    {
      id: 'openai-enrichment',
      method: 'POST',
      path: '/api/enrichment/openai',
      title: 'OpenAI Enrichment',
      description: 'Direct analysis using GPT-4 for specialty and seniority identification',
      category: 'enrichment',
      icon: Brain,
      color: 'from-green-500 to-green-600',
      requestBody: {
        leads: [
          {
            nome: 'string (required) - Full name',
            empresa: 'string (required) - Company name',
            titulo: 'string (required) - Job title/position',
            email: 'string (optional) - Lead email'
          }
        ],
        options: {
          includeAnalysis: 'boolean (optional) - Include detailed analysis (default: true)',
          temperature: 'number (optional) - AI creativity (0.0-1.0, default: 0.2)'
        }
      },
      responseExample: {
        success: true,
        data: [
          {
            nome: 'Sarah Johnson',
            empresa: 'Marketing Plus',
            titulo: 'Digital Marketing Manager',
            especialidade: 'Digital Marketing',
            grau: 'Mid-level',
            confidence: 0.95,
            analysis: 'Digital marketing professional focused on campaign management',
            dataSource: 'openai',
            enrichmentMethod: 'gpt-4-analysis',
            processedAt: '2024-01-01T12:00:00Z'
          }
        ],
        metadata: {
          totalProcessed: 1,
          averageConfidence: 0.95,
          processingTime: 8500
        }
      },
      errorCodes: [
        { code: 400, message: 'Invalid lead data' },
        { code: 401, message: 'Invalid OpenAI API key' },
        { code: 429, message: 'OpenAI quota exceeded' }
      ]
    },
    {
      id: 'web-scraping',
      method: 'POST',
      path: '/api/enrichment/scrape',
      title: 'Web Scraping',
      description: 'Website data extraction using Puppeteer with proxy system',
      category: 'enrichment',
      icon: Search,
      color: 'from-orange-500 to-orange-600',
      requestBody: {
        url: 'string (required) - URL to scrape',
        searchQuery: 'string (optional) - Specific search terms',
        maxRetries: 'number (optional) - Maximum retries (default: 3)',
        useProxy: 'boolean (optional) - Use proxy system (default: true)'
      },
      responseExample: {
        success: true,
        data: {
          url: 'https://company.com/about',
          title: 'About Us - Company Name',
          content: 'Extracted page content...',
          leads: [
            {
              nome: 'Executive Name',
              titulo: 'Chief Technology Officer',
              empresa: 'Company Name',
              email: 'cto@company.com'
            }
          ],
          metadata: {
            scrapedAt: '2024-01-01T12:00:00Z',
            contentLength: 15000,
            processingTime: 12000,
            proxyUsed: 'proxy-1'
          }
        }
      },
      errorCodes: [
        { code: 400, message: 'Invalid URL' },
        { code: 408, message: 'Scraping timeout' },
        { code: 403, message: 'Access denied by website' }
      ]
    },
    {
      id: 'serpapi-search',
      method: 'POST',
      path: '/api/enrichment/serpapi',
      title: 'SerpAPI Search',
      description: 'Advanced Google search using SerpAPI with AI analysis of results',
      category: 'enrichment',
      icon: Target,
      color: 'from-teal-500 to-teal-600',
      requestBody: {
        query: 'string (required) - Search term',
        domain: 'string (optional) - Filter by specific domain',
        location: 'string (optional) - Geographic location',
        num: 'number (optional) - Number of results (default: 10)'
      },
      responseExample: {
        success: true,
        data: {
          query: 'microsoft executives linkedin',
          results: [
            {
              title: 'Satya Nadella - CEO at Microsoft',
              snippet: 'Chief Executive Officer at Microsoft Corporation...',
              link: 'https://linkedin.com/in/satya-nadella',
              position: 1
            }
          ],
          analyzedLeads: [
            {
              nome: 'Satya Nadella',
              empresa: 'Microsoft',
              titulo: 'CEO',
              especialidade: 'Executive Leadership',
              grau: 'C-Level',
              source: 'linkedin'
            }
          ],
          metadata: {
            totalResults: 10,
            analyzedResults: 8,
            processingTime: 15000
          }
        }
      },
      errorCodes: [
        { code: 400, message: 'Invalid search query' },
        { code: 401, message: 'Invalid SerpAPI key' },
        { code: 429, message: 'SerpAPI limit exceeded' }
      ]
    },
    {
      id: 'external-apis',
      method: 'POST',
      path: '/api/enrichment/external',
      title: 'External APIs',
      description: 'Integration with Hunter.io, Apollo.io, Clearbit and other enrichment APIs',
      category: 'enrichment',
      icon: ExternalLink,
      color: 'from-indigo-500 to-indigo-600',
      requestBody: {
        email: 'string (conditional) - Email for enrichment',
        domain: 'string (conditional) - Company domain',
        company: 'string (optional) - Company name',
        apis: 'array (optional) - Specific APIs to use ["hunter", "apollo", "clearbit"]'
      },
      responseExample: {
        success: true,
        data: {
          profile: {
            nome: 'Professional Name',
            empresa: 'Company Inc',
            titulo: 'Senior Developer',
            email: 'prof@company.com',
            telefone: '+1-555-0123',
            linkedinUrl: 'https://linkedin.com/in/profile'
          },
          companyData: {
            name: 'Company Inc',
            domain: 'company.com',
            employees: '51-200',
            industry: 'Technology',
            founded: 2015
          },
          sources: ['hunter', 'clearbit'],
          metadata: {
            confidence: 0.88,
            lastUpdated: '2024-01-01T12:00:00Z'
          }
        }
      },
      errorCodes: [
        { code: 400, message: 'Email or domain required' },
        { code: 401, message: 'Invalid API credentials' },
        { code: 402, message: 'External API quota exceeded' }
      ]
    },
    {
      id: 'api-status',
      method: 'GET',
      path: '/api/enrichment/status',
      title: 'API Status',
      description: 'Checks availability and status of all integrated external APIs',
      category: 'monitoring',
      icon: Activity,
      color: 'from-green-400 to-green-500',
      requestBody: null,
      responseExample: {
        success: true,
        data: {
          openai: {
            status: 'operational',
            responseTime: 1200,
            lastCheck: '2024-01-01T12:00:00Z',
            quotaUsed: '45%'
          },
          serpapi: {
            status: 'operational',
            responseTime: 800,
            lastCheck: '2024-01-01T12:00:00Z',
            quotaUsed: '23%'
          },
          hunter: {
            status: 'degraded',
            responseTime: 3200,
            lastCheck: '2024-01-01T12:00:00Z',
            quotaUsed: '89%'
          },
          clearbit: {
            status: 'operational',
            responseTime: 950,
            lastCheck: '2024-01-01T12:00:00Z',
            quotaUsed: '12%'
          }
        },
        overall: 'degraded',
        lastUpdated: '2024-01-01T12:00:00Z'
      },
      errorCodes: [
        { code: 503, message: 'Monitoring unavailable' }
      ]
    },
    {
      id: 'health-check',
      method: 'GET',
      path: '/api/health',
      title: 'Health Check',
      description: 'Checks overall system health and internal components',
      category: 'monitoring',
      icon: Shield,
      color: 'from-blue-400 to-blue-500',
      requestBody: null,
      responseExample: {
        status: 'healthy',
        timestamp: '2024-01-01T12:00:00Z',
        version: '1.0.0',
        uptime: 86400,
        checks: {
          database: 'healthy',
          cache: 'healthy',
          memory: 'healthy',
          disk: 'healthy'
        },
        metrics: {
          memoryUsage: '45%',
          diskSpace: '23%',
          activeConnections: 12,
          requestsPerMinute: 150
        }
      },
      errorCodes: [
        { code: 503, message: 'System unavailable' }
      ]
    },
    {
      id: 'cache-status',
      method: 'GET',
      path: '/api/cache/status',
      title: 'Cache Status',
      description: 'Information about enrichment cache and usage statistics',
      category: 'monitoring',
      icon: Database,
      color: 'from-purple-400 to-purple-500',
      requestBody: null,
      responseExample: {
        success: true,
        data: {
          totalEntries: 1250,
          memoryUsage: '128MB',
          hitRate: 0.85,
          missRate: 0.15,
          averageTTL: 3400,
          topDomains: [
            { domain: 'microsoft.com', hits: 45 },
            { domain: 'google.com', hits: 32 }
          ],
          statistics: {
            totalHits: 8520,
            totalMisses: 1380,
            evictions: 25,
            lastCleared: '2024-01-01T00:00:00Z'
          }
        }
      },
      errorCodes: [
        { code: 503, message: 'Cache unavailable' }
      ]
    },
    {
      id: 'cache-clear',
      method: 'DELETE',
      path: '/api/cache/clear',
      title: 'Clear Cache',
      description: 'Remove specific entries or entire enrichment cache',
      category: 'management',
      icon: Settings,
      color: 'from-red-400 to-red-500',
      requestBody: {
        domain: 'string (optional) - Clear cache for specific domain',
        pattern: 'string (optional) - Pattern for selective clearing',
        all: 'boolean (optional) - Clear entire cache (default: false)'
      },
      responseExample: {
        success: true,
        data: {
          entriesRemoved: 15,
          spacesFreed: '2.5MB',
          domainsAffected: ['microsoft.com', 'google.com'],
          timestamp: '2024-01-01T12:00:00Z'
        }
      },
      errorCodes: [
        { code: 400, message: 'Invalid clearing parameters' },
        { code: 403, message: 'Operation not authorized' }
      ]
    }
  ];

  const categories = [
    { id: 'enrichment', name: 'Enrichment', icon: Zap, color: 'from-blue-500 to-blue-600' },
    { id: 'monitoring', name: 'Monitoring', icon: Activity, color: 'from-green-500 to-green-600' },
    { id: 'management', name: 'Management', icon: Settings, color: 'from-purple-500 to-purple-600' }
  ];

  const authExample = `const response = await fetch('${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/enrichment/domain', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY', // If required
    'X-API-Version': '1.0'
  },
  body: JSON.stringify({
    domain: 'microsoft.com',
    options: {
      maxResults: 5,
      includeEmails: true,
      priority: 'hybrid'
    }
  })
});

const data = await response.json();
console.log(data);`;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">API Documentation</h1>
                <p className="text-blue-100">Complete reference for DEO enrichment APIs</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/hubspot-integration')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-xl px-6 py-3 rounded-2xl transition-all duration-200 border border-white/20"
            >
              <ExternalLink className="h-5 w-5" />
              HubSpot Integration
            </button>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl leading-relaxed">
            Powerful REST APIs for intelligent data enrichment and lead processing.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Server, label: 'Endpoints', value: '10+', color: 'from-blue-500 to-blue-600' },
          { icon: Globe, label: 'Data Sources', value: '6+', color: 'from-green-500 to-green-600' },
          { icon: Zap, label: 'Avg Response', value: '<2s', color: 'from-purple-500 to-purple-600' },
          { icon: Shield, label: 'Uptime', value: '99.9%', color: 'from-orange-500 to-orange-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Base URL and Authentication */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mr-4">
            <Server className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
            <p className="text-gray-600">Base URL and authentication information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">🌐 Base URL</h3>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm border">
              <div className="flex items-center justify-between">
                <span className="text-blue-600">http://localhost:3001</span>
                <button
                  onClick={() => copyToClipboard('http://localhost:3001', 'base-url')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedCode === 'base-url' ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4 text-gray-500" />
                  }
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              For production, replace with your deployed server URL
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔐 Authentication</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700">No authentication required currently</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-700">Rate limiting active: 100 req/min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Example Request</h3>
          <div className="bg-gray-900 rounded-xl p-6 relative">
            <button
              onClick={() => copyToClipboard(authExample, 'auth-example')}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {copiedCode === 'auth-example' ? 
                <CheckCircle className="h-4 w-4 text-green-400" /> : 
                <Copy className="h-4 w-4 text-gray-400" />
              }
            </button>
            <pre className="text-gray-300 text-sm overflow-x-auto">
              <code>{authExample}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">API Categories</h2>
            <p className="text-gray-600">Organized by functionality</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const categoryEndpoints = endpoints.filter(e => e.category === category.id);
            return (
              <div key={category.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{categoryEndpoints.length} endpoints available</p>
                <div className="space-y-2">
                  {categoryEndpoints.slice(0, 3).map((endpoint) => (
                    <div key={endpoint.id} className="text-sm text-gray-700 flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        endpoint.method === 'GET' ? 'bg-green-500' : 
                        endpoint.method === 'POST' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></span>
                      {endpoint.title}
                    </div>
                  ))}
                  {categoryEndpoints.length > 3 && (
                    <div className="text-sm text-gray-500">+{categoryEndpoints.length - 3} more...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Endpoints Documentation */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">API Endpoints</h2>
          <p className="text-gray-600">Complete documentation for all available endpoints</p>
        </div>

        {endpoints.map((endpoint) => {
          const Icon = endpoint.icon;
          const isSelected = selectedEndpoint === endpoint.id;
          
          return (
            <div key={endpoint.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Endpoint Header */}
              <div 
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'bg-gradient-to-r from-gray-50 to-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedEndpoint(isSelected ? null : endpoint.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${endpoint.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                          {endpoint.path}
                        </code>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{endpoint.title}</h3>
                      <p className="text-gray-600">{endpoint.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isSelected ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>

              {/* Endpoint Details */}
              {isSelected && (
                <div className="border-t border-gray-200 p-6 space-y-8">
                  {/* Request Body */}
                  {endpoint.requestBody && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Request Body
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <pre className="text-sm text-gray-700 overflow-x-auto">
                          <code>{JSON.stringify(endpoint.requestBody, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Response Example */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Response Example (200 OK)
                      </h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(endpoint.responseExample, null, 2), `response-${endpoint.id}`)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {copiedCode === `response-${endpoint.id}` ? 
                          <CheckCircle className="h-4 w-4" /> : 
                          <Copy className="h-4 w-4" />
                        }
                        Copy
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4">
                      <pre className="text-gray-300 text-sm overflow-x-auto">
                        <code>{JSON.stringify(endpoint.responseExample, null, 2)}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Error Codes */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                      Error Codes
                    </h4>
                    <div className="space-y-3">
                      {endpoint.errorCodes.map((error, index) => (
                        <div key={index} className="flex items-center p-3 bg-red-50 rounded-xl border border-red-200">
                          <span className="font-mono text-sm font-bold text-red-700 mr-4 bg-red-100 px-3 py-1 rounded-lg">
                            {error.code}
                          </span>
                          <span className="text-gray-700">{error.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* cURL Example */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center">
                        <Code className="h-5 w-5 mr-2 text-purple-600" />
                        cURL Example
                      </h4>
                      <button
                        onClick={() => {
                          const curlCommand = `curl -X ${endpoint.method} \\
  '${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}${endpoint.path}' \\
  -H 'Content-Type: application/json' \\${endpoint.requestBody ? `
  -d '${JSON.stringify(endpoint.requestBody, null, 2)}'` : ''}`;
                          copyToClipboard(curlCommand, `curl-${endpoint.id}`);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        {copiedCode === `curl-${endpoint.id}` ? 
                          <CheckCircle className="h-4 w-4" /> : 
                          <Copy className="h-4 w-4" />
                        }
                        Copy cURL
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4">
                      <pre className="text-gray-300 text-sm overflow-x-auto">
                        <code>{`curl -X ${endpoint.method} \\
  '${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}${endpoint.path}' \\
  -H 'Content-Type: application/json' \\${endpoint.requestBody ? `
  -d '${JSON.stringify(endpoint.requestBody, null, 2)}'` : ''}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rate Limiting */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rate Limiting & Best Practices</h2>
            <p className="text-gray-600">Important information for API usage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Rate Limits</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-gray-700">Requests per minute</span>
                <span className="font-bold text-blue-600">100</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-gray-700">Concurrent requests</span>
                <span className="font-bold text-green-600">10</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <span className="text-gray-700">Timeout per request</span>
                <span className="font-bold text-orange-600">60s</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">✅ Best Practices</h3>
            <div className="space-y-3">
              {[
                'Implement retry logic with exponential backoff',
                'Cache results when possible (TTL: 1 hour)',
                'Use appropriate timeouts in your requests',
                'Monitor response headers for rate limiting',
                'Process requests in batches for better performance'
              ].map((practice, index) => (
                <div key={index} className="flex items-start p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HubSpot Integration CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 shadow-lg border border-orange-200 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for HubSpot Integration?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Learn how to integrate these powerful APIs with HubSpot using webhooks, 
            Operations Hub workflows, and automated enrichment processes.
          </p>
          <button
            onClick={() => navigate('/hubspot-integration')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View HubSpot Integration Guide
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentationPage;
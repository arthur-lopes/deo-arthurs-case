import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Search, AlertCircle, CheckCircle, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { enrichFromDomain } from '../services/domainEnrichmentService';
import { useLeadContext } from '../context/LeadContext';
import ProgressIndicator from '../components/ProgressIndicator';
import ApiStatusIndicator from '../components/ApiStatusIndicator';

const DomainEnrichmentPage = () => {
  const [domain, setDomain] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  
  const { setLeads, setOriginalLeads, setFileName } = useLeadContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setError('Please enter a valid domain.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCompanyInfo(null);
    setProcessingProgress(0);
    setProcessingStatus('Analyzing domain...');

    try {
      // Realistic progress steps based on actual backend processing
      setProcessingProgress(10);
      setProcessingStatus('🔍 Starting SerpAPI search...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingProgress(25);
      setProcessingStatus('🕷️ Collecting website data...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingProgress(50);
      setProcessingStatus('🤖 Analyzing data with OpenAI...');
      
      // Start the actual enrichment process
      const enrichmentStartTime = Date.now();
      
      // Update progress periodically during long operation
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - enrichmentStartTime;
        if (elapsed > 15000 && processingProgress < 70) { // After 15 seconds
          setProcessingProgress(70);
          setProcessingStatus('⏳ Advanced processing - please wait...');
        }
        if (elapsed > 30000 && processingProgress < 80) { // After 30 seconds  
          setProcessingProgress(80);
          setProcessingStatus('🔄 Consolidating results...');
        }
        if (elapsed > 60000 && processingProgress < 90) { // After 60 seconds
          setProcessingProgress(90);
          setProcessingStatus('🎯 Finalizing analysis...');
        }
      }, 5000);
      
      const result = await enrichFromDomain(domain);
      
      clearInterval(progressInterval);
      setProcessingProgress(95);
      setProcessingStatus('✅ Processing found data...');
      
      if (!result.success) {
        throw new Error(result.error || 'Error processing domain');
      }

      if (result.leads.length === 0) {
        // Show info message instead of error for no leads found
        setCompanyInfo(result.companyInfo);
        setProcessingProgress(100);
        setProcessingStatus('Analysis complete - No verifiable data found');
        setIsProcessing(false);
        
        toast('No verifiable leads found for this domain', {
          icon: 'ℹ️',
          duration: 4000,
        });
        return;
      }

      // Set the leads data
      setLeads(result.leads);
      setOriginalLeads(result.leads);
      setFileName(`leads_${domain.replace(/\./g, '_')}.csv`);
      setCompanyInfo(result.companyInfo);
      
      setProcessingProgress(100);
      setProcessingStatus('Processing complete!');
      
      toast.success(`${result.leads.length} leads found for ${domain}!`);
      
      // Navigate to results after a brief delay
      setTimeout(() => {
        navigate('/results');
      }, 1500);
      
    } catch (err) {
      console.error('Error processing domain:', err);
      setError(err instanceof Error ? err.message : 'Error processing domain.');
      setIsProcessing(false);
      setProcessingProgress(0);
      toast.error('Error processing domain.');
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    setError(null);
  };

  const exampleDomains = [
    { domain: 'microsoft.com', type: 'Technology', flag: '🇺🇸' },
    { domain: 'salesforce.com', type: 'CRM/SaaS', flag: '🇺🇸' },
    { domain: 'magazineluiza.com.br', type: 'E-commerce', flag: '🇧🇷' },
    { domain: 'mercadolivre.com.br', type: 'Marketplace', flag: '🇧🇷' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Domain Search</h1>
                <p className="text-green-100">AI discovers leads automatically</p>
              </div>
            </div>
            <ApiStatusIndicator />
          </div>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl leading-relaxed">
            Enter any company website and our AI will find verified real leads using multiple data sources.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Sparkles,
            title: 'Advanced AI',
            description: 'Smart analysis with OpenAI for accurate data',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: Zap,
            title: 'Multiple Sources',
            description: 'SerpAPI, web scraping and specialized databases',
            color: 'from-yellow-500 to-orange-500'
          },
          {
            icon: Target,
            title: 'Verified Data',
            description: 'Only real information, nothing is made up',
            color: 'from-purple-500 to-pink-500'
          }
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-start shadow-lg">
          <AlertCircle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Processing error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Main Search Form */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discover Leads</h2>
            <p className="text-gray-600">Enter the target company domain</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-3">
              Company Website or Domain
            </label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={handleDomainChange}
                placeholder="example: company.com or https://www.company.com"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-lg"
                disabled={isProcessing}
              />
            </div>
            <p className="mt-3 text-sm text-gray-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Supports formats: company.com, www.company.com, https://company.com
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing || !domain.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Discovering Leads...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="mr-3 h-6 w-6" />
                Search Leads Automatically
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Example Domains */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Example Companies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {exampleDomains.map((example, index) => (
            <button
              key={index}
              onClick={() => !isProcessing && setDomain(example.domain)}
              disabled={isProcessing}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-green-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{example.flag}</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {example.type}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {example.domain}
              </p>
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Click any example to test it quickly
        </p>
      </div>

      {isProcessing && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 animate-pulse">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Processing in Progress</h2>
              <p className="text-gray-600">Our AI is discovering leads for you</p>
            </div>
          </div>
          <ProgressIndicator
            progress={processingProgress}
            status={processingStatus}
          />
        </div>
      )}

      {companyInfo && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg border border-green-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Company Identified</h2>
              <p className="text-green-600">Information collected successfully</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Company Data</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name</span>
                  <p className="text-lg font-semibold text-gray-900">{companyInfo.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Industry</span>
                  <p className="text-gray-900">{companyInfo.industry}</p>
                </div>
                {companyInfo.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <p className="text-gray-900">{companyInfo.location}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{companyInfo.description}</p>
              
              {companyInfo.description?.includes('No verified information') && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm font-medium text-yellow-800">Limited Information</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    No verifiable information was found for this domain. 
                    AI could not access real company data.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Verified Data</span>
              </div>
              <ApiStatusIndicator />
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Lead Discovery Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Smart Analysis',
              description: 'OpenAI GPT-4 analyzes the domain and extracts real information about the company',
              icon: Sparkles,
              color: 'from-blue-500 to-blue-600'
            },
            {
              step: '2',
              title: 'Data Collection',
              description: 'SerpAPI and web scraping collect data from "About", "Team" and "Contact" pages',
              icon: Search,
              color: 'from-green-500 to-green-600'
            },
            {
              step: '3',
              title: 'Final Verification',
              description: 'Specialized APIs (Hunter.io, Apollo.io) verify and validate the found data',
              icon: CheckCircle,
              color: 'from-purple-500 to-purple-600'
            }
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold text-gray-600 mb-2">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DomainEnrichmentPage; 
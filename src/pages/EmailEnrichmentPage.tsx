import React, { useState } from 'react';
import { Mail, FileText, Sparkles, User, Building2, Target, TrendingUp, Zap } from 'lucide-react';
import EmailEnrichmentForm from '../components/EmailEnrichmentForm';
import DataTable from '../components/DataTable';
import ApiStatusIndicator from '../components/ApiStatusIndicator';
import { Lead } from '../types/Lead';

const EmailEnrichmentPage = () => {
  const [enrichedLeads, setEnrichedLeads] = useState<Lead[]>([]);

  const handleLeadFound = (lead: Lead) => {
    // Add new lead to the beginning of the array
    setEnrichedLeads(prev => [lead, ...prev]);
  };

  const handleClearResults = () => {
    setEnrichedLeads([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Email Enrichment</h1>
                <p className="text-purple-100">Complete professional profiles in seconds</p>
              </div>
            </div>
            <ApiStatusIndicator />
          </div>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl leading-relaxed">
            Transform any email into a detailed professional profile with work history, current company and social data.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: User,
            title: 'Professional Profile',
            description: 'Name, position, seniority level and professional specialization',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: Building2,
            title: 'Company Information',
            description: 'Current company, industry, location and corporate details',
            color: 'from-green-500 to-green-600'
          },
          {
            icon: Target,
            title: 'Work History',
            description: 'Professional experience and social media presence',
            color: 'from-purple-500 to-purple-600'
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

      {/* How It Works */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-purple-200">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-600">Automated process in 3 simple steps</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Enter Email',
              description: 'Input the email address you want to enrich with data',
              icon: Mail,
              color: 'from-blue-500 to-blue-600'
            },
            {
              step: '2',
              title: 'AI Data Search',
              description: 'System finds professional and business information automatically',
              icon: Zap,
              color: 'from-yellow-500 to-orange-500'
            },
            {
              step: '3',
              title: 'Complete Profile',
              description: 'Receive detailed name, position, company and work history',
              icon: TrendingUp,
              color: 'from-green-500 to-green-600'
            }
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full text-sm font-bold text-purple-600 border-2 border-purple-200">
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

      {/* Email Enrichment Form */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discover Professional Profile</h2>
            <p className="text-gray-600">Enter an email address to start enrichment</p>
          </div>
        </div>
        
        <EmailEnrichmentForm onLeadFound={handleLeadFound} />
      </div>

      {/* Results Section */}
      {enrichedLeads.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Leads Found ({enrichedLeads.length})
                  </h2>
                  <p className="text-green-600">Data collected successfully</p>
                </div>
              </div>
              <button
                onClick={handleClearResults}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-2xl transition-all duration-200"
              >
                Clear Results
              </button>
            </div>

            <DataTable 
              data={enrichedLeads} 
              fileName="email_enrichment_results.csv"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrichedLeads.length === 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-dashed border-purple-200">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No leads found yet
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            Use the form above to start enriching emails and discover complete professional profiles
          </p>
          <div className="inline-flex items-center text-purple-600 font-semibold">
            <Sparkles className="h-5 w-5 mr-2" />
            Start by entering a corporate email address
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tips for Better Results</h2>
            <p className="text-gray-600">Maximize the quality of enriched data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            '✅ Use corporate emails for higher accuracy (e.g. name@company.com)',
            '🎯 Executive emails typically return more detailed information',
            '🌐 System works best with companies that have strong online presence',
            '🔒 Data is collected only from public and verified sources'
          ].map((tip, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-2xl">
              <div className="text-lg mr-3">{tip.split(' ')[0]}</div>
              <p className="text-gray-700 font-medium">{tip.substring(tip.indexOf(' ') + 1)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailEnrichmentPage; 
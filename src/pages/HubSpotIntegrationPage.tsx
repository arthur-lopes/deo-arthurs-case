import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Webhook, 
  Clock, 
  Zap, 
  Database, 
  CheckCircle, 
  ArrowRight, 
  Copy, 
  ExternalLink,
  Settings,
  Activity,
  Code,
  AlertCircle,
  FileText,
  Play,
  Pause,
  RefreshCw,
  Target,
  Globe,
  Users,
  BarChart3,
  Shield,
  Layers,
  GitBranch,
  Server,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

const HubSpotIntegrationPage = () => {
  const navigate = useNavigate();
  const [selectedIntegration, setSelectedIntegration] = useState<'breeze' | 'webhook' | 'cronjob' | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const webhookExample = `// Webhook endpoint to receive data from HubSpot Operations Hub
app.post('/api/hubspot/webhook', async (req, res) => {
  try {
    const { objectId, propertyName, propertyValue, subscriptionType } = req.body;
    
    // Check if it's a new contact creation or relevant property change
    if (subscriptionType === 'contact.creation' || 
        subscriptionType === 'contact.propertyChange') {
      
      // Fetch complete contact data from HubSpot API
      const contactData = await hubspotClient.crm.contacts.basicApi.getById(objectId, 
        ['email', 'firstname', 'lastname', 'company', 'website', 'company_domain']
      );
      
      // Extract company domain from contact data
      const companyDomain = contactData.properties.company_domain || 
                           contactData.properties.website ||
                           extractDomainFromEmail(contactData.properties.email);
      
      if (companyDomain) {
        console.log(\`Enriching contact \${objectId} for domain: \${companyDomain}\`);
        
        // Call our enrichment API
        const enrichmentResponse = await fetch(\`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/enrichment/domain\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: companyDomain,
            options: {
              maxResults: 5,
              includeEmails: true,
              priority: 'hybrid'
            }
          })
        });
        
        const enrichedData = await enrichmentResponse.json();
        
        if (enrichedData.success && enrichedData.data) {
          // Prepare enriched data for HubSpot
          const updateProperties = {
            enrichment_status: 'completed',
            last_enrichment_date: new Date().toISOString(),
            data_source: enrichedData.data.metadata?.source || 'hybrid'
          };

          // Add company information if available
          if (enrichedData.data.company) {
            updateProperties.company_size = enrichedData.data.company.size;
            updateProperties.company_industry = enrichedData.data.company.industry;
            updateProperties.company_description = enrichedData.data.company.description;
          }

          // Calculate lead score based on enriched data
          if (enrichedData.data.leads && enrichedData.data.leads.length > 0) {
            const leadScore = calculateLeadScore(enrichedData.data.leads[0]);
            updateProperties.lead_score = leadScore;
            updateProperties.enrichment_confidence = enrichedData.data.leads[0].confidence || 0.8;
          }
          
          // Update contact in HubSpot using HubSpot API
          await hubspotClient.crm.contacts.basicApi.update(objectId, {
            properties: updateProperties
          });
          
          console.log(\`Contact \${objectId} successfully enriched and updated in HubSpot\`);
          
          // Optionally create associated contacts/leads if found
          if (enrichedData.data.leads && enrichedData.data.leads.length > 1) {
            for (let i = 1; i < enrichedData.data.leads.length; i++) {
              const lead = enrichedData.data.leads[i];
              await createAdditionalContact(lead, objectId);
            }
          }
        } else {
          // Mark as failed enrichment
          await hubspotClient.crm.contacts.basicApi.update(objectId, {
            properties: {
              enrichment_status: 'failed',
              last_enrichment_date: new Date().toISOString()
            }
          });
        }
      } else {
        // No domain found, mark as no domain available
        await hubspotClient.crm.contacts.basicApi.update(objectId, {
          properties: {
            enrichment_status: 'no_domain',
            last_enrichment_date: new Date().toISOString()
          }
        });
      }
    }
    
    // Respond to HubSpot that webhook was processed successfully
    res.status(200).json({ 
      success: true, 
      message: 'Contact enrichment process initiated',
      contactId: objectId 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Optionally update contact with error status
    if (req.body.objectId) {
      try {
        await hubspotClient.crm.contacts.basicApi.update(req.body.objectId, {
          properties: {
            enrichment_status: 'error',
            last_enrichment_date: new Date().toISOString()
          }
        });
      } catch (updateError) {
        console.error('Failed to update contact with error status:', updateError);
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to calculate lead score
function calculateLeadScore(lead) {
  let score = 0;
  
  // Base score for having data
  score += 20;
  
  // Score based on seniority
  if (lead.grau === 'C-Level') score += 40;
  else if (lead.grau === 'Senior') score += 30;
  else if (lead.grau === 'Mid-level') score += 20;
  else score += 10;
  
  // Score based on email availability
  if (lead.email) score += 20;
  
  // Score based on phone availability
  if (lead.telefone) score += 10;
  
  // Score based on confidence
  if (lead.confidence) score += Math.round(lead.confidence * 10);
  
  return Math.min(score, 100); // Cap at 100
}

// Helper function to create additional contacts
async function createAdditionalContact(lead, originalContactId) {
  try {
    const newContact = await hubspotClient.crm.contacts.basicApi.create({
      properties: {
        firstname: lead.nome?.split(' ')[0] || '',
        lastname: lead.nome?.split(' ').slice(1).join(' ') || '',
        email: lead.email || '',
        jobtitle: lead.titulo || '',
        company: lead.empresa || '',
        phone: lead.telefone || '',
        enrichment_status: 'completed',
        data_source: lead.dataSource || 'enrichment',
        lead_score: calculateLeadScore(lead),
        enrichment_confidence: lead.confidence || 0.8,
        original_contact_id: originalContactId // Link to original contact
      }
    });
    
    console.log(\`Created additional contact: \${newContact.id}\`);
    return newContact.id;
  } catch (error) {
    console.error('Error creating additional contact:', error);
    return null;
  }
}`;

  const cronjobExample = `// Cronjob for batch enrichment
const cron = require('node-cron');

// Run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Starting enrichment process...');
  
  try {
    // 1. Find contacts that need enrichment
    const contactsToEnrich = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'enrichment_status',
          operator: 'EQ',
          value: 'pending'
        }]
      }],
      limit: 50 // Process 50 contacts at a time
    });
    
    for (const contact of contactsToEnrich.results) {
      const companyDomain = contact.properties.company_domain || 
                           extractDomainFromEmail(contact.properties.email);
      
      if (companyDomain) {
        // Enrich data
        const enrichmentResponse = await fetch(\`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/enrichment/domain\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: companyDomain,
            options: {
              maxResults: 3,
              includeEmails: true,
              priority: 'hybrid'
            }
          })
        });
        
        const enrichedData = await enrichmentResponse.json();
        
        if (enrichedData.success) {
          // Update contact in HubSpot
          await hubspotClient.crm.contacts.basicApi.update(contact.id, {
            properties: {
              enrichment_status: 'completed',
              company_size: enrichedData.data.company?.size,
              company_industry: enrichedData.data.company?.industry,
              lead_score: calculateLeadScore(enrichedData.data),
              last_enrichment_date: new Date().toISOString()
            }
          });
          
          console.log(\`Contact \${contact.id} enriched successfully\`);
        }
      }
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Enrichment process completed');
  } catch (error) {
    console.error('Cronjob error:', error);
  }
});`;

  const operationsHubWorkflow = `// Operations Hub Workflow Configuration
{
  "name": "Automatic Contact Enrichment via API",
  "type": "CONTACT_BASED",
  "enabled": true,
  "enrollmentTriggers": [
    {
      "type": "CONTACT_CREATED",
      "description": "Trigger when a new contact is created"
    },
    {
      "type": "PROPERTY_CHANGE",
      "propertyName": "email",
      "operator": "HAS_PROPERTY",
      "description": "Trigger when email is added to existing contact"
    },
    {
      "type": "PROPERTY_CHANGE", 
      "propertyName": "company_domain",
      "operator": "HAS_PROPERTY",
      "description": "Trigger when company domain is added"
    }
  ],
  "enrollmentCriteria": [
    {
      "propertyName": "enrichment_status",
      "operator": "NOT_EQUAL_TO",
      "value": "completed"
    }
  ],
  "actions": [
    {
      "type": "DELAY",
      "delayType": "DURATION", 
      "duration": "PT30S",
      "description": "Wait 30 seconds to ensure all contact data is saved"
    },
    {
      "type": "PROPERTY_UPDATE",
      "properties": {
        "enrichment_status": "processing"
      },
      "description": "Mark contact as being processed"
    },
    {
      "type": "WEBHOOK",
      "url": "https://your-api.com/api/hubspot/webhook",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY",
        "X-HubSpot-Signature": "{{webhook_signature}}"
      },
      "body": {
        "objectId": "{{contact.id}}",
        "subscriptionType": "contact.creation",
        "propertyName": "contact_created", 
        "contactData": {
          "email": "{{contact.email}}",
          "firstName": "{{contact.firstname}}",
          "lastName": "{{contact.lastname}}",
          "company": "{{contact.company}}",
          "website": "{{contact.website}}",
          "companyDomain": "{{contact.company_domain}}",
          "jobTitle": "{{contact.jobtitle}}"
        }
      },
      "description": "Send contact data to enrichment API"
    },
    {
      "type": "BRANCH",
      "condition": {
        "propertyName": "enrichment_status", 
        "operator": "NOT_EQUAL_TO",
        "value": "completed"
      },
      "ifTrue": [
        {
          "type": "DELAY",
          "delayType": "DURATION",
          "duration": "PT2M",
          "description": "Wait 2 minutes for API processing"
        },
        {
          "type": "PROPERTY_UPDATE",
          "properties": {
            "enrichment_status": "timeout"
          },
          "description": "Mark as timeout if not completed"
        }
      ]
    }
  ]
}`;

  const integrationOptions = [
    {
      id: 'breeze',
      title: 'HubSpot Breeze Intelligence',
      subtitle: 'Native AI enrichment',
      description: 'Built-in HubSpot AI that automatically enriches contact and company data using multiple sources',
      icon: Brain,
      color: 'from-indigo-400 to-purple-500',
      isNative: true,
      features: [
        'Automatic data enrichment',
        'Multiple data sources',
        'Buyer intent identification',
        'Form shortening capabilities',
        'Built into HubSpot platform'
      ],
      requirements: [
        'HubSpot premium subscription',
        'Breeze Intelligence add-on',
        'Account opt-in to beta features',
        'No custom development needed'
      ],
      pros: [
        'No technical setup required',
        'Native HubSpot integration',
        'Automatic and continuous',
        'Multiple data sources'
      ],
      cons: [
        'Additional cost for add-on',
        'Limited to HubSpot data sources',
        'Less customization options',
        'No email/phone for contacts'
      ]
    },
    {
      id: 'webhook',
      title: 'Webhook + Operations Hub',
      subtitle: 'Real-time enrichment',
      description: 'HubSpot sends webhook when contact is created/updated, API processes and returns enriched data',
      icon: Webhook,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Real-time processing',
        'Uses Operations Hub workflows',
        'Complete automation',
        'Immediate response',
        'Ideal for active sales'
      ],
      requirements: [
        'HubSpot Operations Hub (paid)',
        'Webhook endpoint configured',
        'SSL certificate required',
        'Rate limiting considered'
      ],
      pros: [
        'Always up-to-date data',
        'No processing delay',
        'Native HubSpot integration',
        'Automatically scalable'
      ],
      cons: [
        'Requires Operations Hub (cost)',
        'More complex to setup',
        'Dependent on webhooks',
        'Can generate many requests'
      ]
    },
    {
      id: 'cronjob',
      title: 'Cronjob + Batch Processing',
      subtitle: 'Batch enrichment',
      description: 'Script runs periodically, finds pending contacts, enriches and updates in HubSpot',
      icon: Clock,
      color: 'from-green-500 to-green-600',
      features: [
        'Batch processing',
        'Full timing control',
        'Resource optimization',
        'Automatic retry',
        'Ideal for large volumes'
      ],
      requirements: [
        'HubSpot Free/Starter (any plan)',
        'Server to run cronjob',
        'HubSpot API key',
        'Rate limiting control'
      ],
      pros: [
        'Works with any HubSpot plan',
        'More economical',
        'Full process control',
        'Optimized for large volumes'
      ],
      cons: [
        'Processing delay',
        'Not real-time data',
        'Requires own infrastructure',
        'Manual monitoring'
      ]
    }
  ];

  const hubspotFields = [
    { name: 'enrichment_status', type: 'single_line_text', label: 'Enrichment Status' },
    { name: 'company_size', type: 'single_line_text', label: 'Company Size' },
    { name: 'company_industry', type: 'single_line_text', label: 'Company Industry' },
    { name: 'lead_score', type: 'number', label: 'Lead Score' },
    { name: 'last_enrichment_date', type: 'datetime', label: 'Last Enrichment Date' },
    { name: 'data_source', type: 'single_line_text', label: 'Data Source' },
    { name: 'enrichment_confidence', type: 'number', label: 'Enrichment Confidence' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/api-documentation')}
                className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all duration-200"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">HubSpot Integration</h1>
                <p className="text-orange-100">Connect DEO APIs with HubSpot CRM</p>
              </div>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl leading-relaxed">
            Automate data enrichment directly in your HubSpot with two integration options.
          </p>
        </div>
      </div>

      {/* Integration Options */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Integration</h2>
          <p className="text-gray-600 text-lg">Two different approaches for different needs</p>
        </div>

        {/* Native HubSpot Option (smaller) */}
        <div className="mb-6">
          {integrationOptions.filter(option => option.isNative).map((option) => {
            const Icon = option.icon;
            const isSelected = selectedIntegration === option.id;
            
            return (
              <div 
                key={option.id}
                className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected ? 'border-indigo-400 shadow-lg' : 'border-indigo-200 hover:border-indigo-300'
                }`}
                onClick={() => setSelectedIntegration(option.id as 'breeze' | 'webhook' | 'cronjob')}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mr-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {option.title}
                          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">Native</span>
                        </h3>
                        <p className="text-gray-600 text-sm">{option.subtitle}</p>
                        <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Learn More'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Integration Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {integrationOptions.filter(option => !option.isNative).map((option) => {
            const Icon = option.icon;
            const isSelected = selectedIntegration === option.id;
            
            return (
              <div 
                key={option.id}
                className={`bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIntegration(option.id as 'webhook' | 'cronjob')}
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mr-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{option.title}</h3>
                      <p className="text-gray-600">{option.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">{option.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-blue-600" />
                        Features
                      </h4>
                      <div className="space-y-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-700 mb-2">✅ Advantages</h5>
                        <div className="space-y-1">
                          {option.pros.map((pro, index) => (
                            <div key={index} className="text-xs text-gray-600">• {pro}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-700 mb-2">⚠️ Limitations</h5>
                        <div className="space-y-1">
                          {option.cons.map((con, index) => (
                            <div key={index} className="text-xs text-gray-600">• {con}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-orange-600" />
                        Requirements
                      </h4>
                      <div className="space-y-2">
                        {option.requirements.map((req, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <AlertCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-6 py-3 px-6 rounded-2xl font-bold transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Implementation Details */}
      {selectedIntegration && (
        <div className="space-y-8">
          {/* Breeze Intelligence Implementation */}
          {selectedIntegration === 'breeze' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mr-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">HubSpot Breeze Intelligence Setup</h2>
                  <p className="text-gray-600">Native AI-powered data enrichment with minimal setup</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* What is Breeze Intelligence */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-indigo-600" />
                    What is Breeze Intelligence?
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    HubSpot Breeze Intelligence is an AI-powered feature that automatically enriches contact and company data records 
                    while identifying buyer intent to help you effectively target the right leads and shorten forms to convert them quickly.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Data Sources</h4>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• Publicly-available sources and websites</li>
                        <li>• Third-party data providers</li>
                        <li>• HubSpot's comprehensive database</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Key Capabilities</h4>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• Contact and company enrichment</li>
                        <li>• Buyer intent identification</li>
                        <li>• Form shortening automation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Setup Steps */}
                <div className="border-l-4 border-indigo-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Setup Steps</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Upgrade to Premium Subscription</h4>
                        <p className="text-gray-700 text-sm">Breeze Intelligence requires a HubSpot premium subscription as the base requirement.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Purchase Breeze Intelligence Add-on</h4>
                        <p className="text-gray-700 text-sm">Add Breeze Intelligence to your premium HubSpot subscription for an additional charge.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Opt into Beta Features</h4>
                        <p className="text-gray-700 text-sm">Navigate to Settings → General → Beta features and enable Breeze Intelligence functionality.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">4</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Configure Enrichment Settings</h4>
                        <p className="text-gray-700 text-sm">Set up automatic enrichment rules and data preferences in your HubSpot portal.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Limitations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      What Breeze Intelligence Provides
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Company business phone numbers',
                        'Company size and industry data',
                        'Company descriptions and details',
                        'Buyer intent signals',
                        'Form shortening capabilities',
                        'Automatic contact enrichment'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <h3 className="font-bold text-orange-900 mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Limitations to Consider
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Does not provide contact phone numbers',
                        'Does not provide contact email addresses',
                        'Limited to HubSpot-approved data sources',
                        'Additional cost for the add-on feature',
                        'Beta features may have limitations',
                        'Less customization vs custom APIs'
                      ].map((limitation, index) => (
                        <div key={index} className="flex items-center text-sm text-orange-800">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          {limitation}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comparison with Custom Solutions */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">When to Choose Breeze Intelligence vs Custom Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-3">Choose Breeze Intelligence if:</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• You want zero technical setup</li>
                        <li>• You're satisfied with HubSpot's data sources</li>
                        <li>• You don't need contact emails/phones</li>
                        <li>• You prefer native, seamless integration</li>
                        <li>• Budget allows for the add-on cost</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-3">Choose Custom Integration if:</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• You need specific data sources</li>
                        <li>• You want contact emails and phone numbers</li>
                        <li>• You need more control over enrichment</li>
                        <li>• You have technical resources available</li>
                        <li>• You want to optimize costs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* External Link */}
                <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Learn More About HubSpot Breeze</h3>
                  <p className="text-gray-600 mb-4">Get detailed information about Breeze Intelligence and other AI features</p>
                  <a
                    href="https://www.hubspot.com/products/artificial-intelligence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit HubSpot AI Page
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Webhook Implementation */}
          {selectedIntegration === 'webhook' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mr-4">
                  <Webhook className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Webhook Implementation</h2>
                  <p className="text-gray-600">Step-by-step configuration for real-time integration</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">1. Configure Operations Hub Workflow</h3>
                  <p className="text-gray-700 mb-4">
                    Set up a workflow in HubSpot Operations Hub that triggers when a contact is created. 
                    The workflow will send a webhook to your API, which will enrich the data and then 
                    call back HubSpot's API to update the contact with enriched information.
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Workflow Configuration</h4>
                      <button
                        onClick={() => copyToClipboard(operationsHubWorkflow, 'workflow-config')}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        {copiedCode === 'workflow-config' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm text-gray-700 overflow-x-auto">
                      <code>{operationsHubWorkflow}</code>
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h5 className="font-semibold text-blue-900 mb-2">Trigger</h5>
                      <p className="text-sm text-blue-700">Contact created or key properties added</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h5 className="font-semibold text-green-900 mb-2">Webhook</h5>
                      <p className="text-sm text-green-700">Sends data to your API</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h5 className="font-semibold text-purple-900 mb-2">API Process</h5>
                      <p className="text-sm text-purple-700">Enriches contact data</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <h5 className="font-semibold text-orange-900 mb-2">Update</h5>
                      <p className="text-sm text-orange-700">API calls HubSpot to update contact</p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. Implement Webhook Endpoint + HubSpot API Integration</h3>
                  <p className="text-gray-700 mb-4">
                    Create an endpoint that receives the webhook from HubSpot, enriches the data using your APIs, 
                    and then calls HubSpot's API to update the contact with the enriched information.
                  </p>
                  
                  <div className="bg-gray-900 rounded-xl p-6 relative">
                    <button
                      onClick={() => copyToClipboard(webhookExample, 'webhook-code')}
                      className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copiedCode === 'webhook-code' ? 
                        <CheckCircle className="h-4 w-4 text-green-400" /> : 
                        <Copy className="h-4 w-4 text-gray-400" />
                      }
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{webhookExample}</code>
                    </pre>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2">Key Features of this Implementation</h5>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                          <li>Receives webhook from HubSpot Operations Hub workflow</li>
                          <li>Fetches complete contact data from HubSpot API</li>
                          <li>Calls your enrichment API to process domain data</li>
                          <li>Updates the original contact in HubSpot with enriched data</li>
                          <li>Optionally creates additional contacts for other leads found</li>
                          <li>Handles errors and updates enrichment status accordingly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3. Complete Data Flow</h3>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {[
                      { icon: Users, title: 'Contact', desc: 'Created in HubSpot' },
                      { icon: Zap, title: 'Workflow', desc: 'Operations Hub triggers' },
                      { icon: Webhook, title: 'Webhook', desc: 'Sent to your API' },
                      { icon: Database, title: 'Enrichment', desc: 'API processes data' },
                      { icon: RefreshCw, title: 'API Call', desc: 'Updates HubSpot contact' },
                      { icon: CheckCircle, title: 'Complete', desc: 'Enriched data in HubSpot' }
                    ].map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.desc}</p>
                          {index < 5 && (
                            <ArrowRight className="h-5 w-5 text-gray-400 mx-auto mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cronjob Implementation */}
          {selectedIntegration === 'cronjob' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Cronjob Implementation</h2>
                  <p className="text-gray-600">Batch processing for large volumes</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">1. Configure Custom Fields</h3>
                  <p className="text-gray-700 mb-4">
                    First, create custom fields in HubSpot to control enrichment status.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hubspotFields.slice(0, 4).map((field, index) => (
                      <div key={index} className="bg-green-50 rounded-xl p-4">
                        <h5 className="font-semibold text-green-900 mb-1">{field.label}</h5>
                        <p className="text-sm text-green-700">Type: {field.type}</p>
                        <code className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{field.name}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. Implement Cronjob</h3>
                  <p className="text-gray-700 mb-4">
                    Set up a script that runs periodically to find and enrich contacts.
                  </p>
                  
                  <div className="bg-gray-900 rounded-xl p-6 relative">
                    <button
                      onClick={() => copyToClipboard(cronjobExample, 'cronjob-code')}
                      className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copiedCode === 'cronjob-code' ? 
                        <CheckCircle className="h-4 w-4 text-green-400" /> : 
                        <Copy className="h-4 w-4 text-gray-400" />
                      }
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{cronjobExample}</code>
                    </pre>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3. Recommended Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-orange-50 rounded-xl p-6">
                      <Clock className="h-8 w-8 text-orange-600 mb-3" />
                      <h4 className="font-semibold text-orange-900 mb-2">Frequency</h4>
                      <p className="text-sm text-orange-700 mb-3">Run every 30 minutes to balance performance and updates</p>
                      <code className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">*/30 * * * *</code>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-6">
                      <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
                      <h4 className="font-semibold text-blue-900 mb-2">Batch Size</h4>
                      <p className="text-sm text-blue-700 mb-3">Process 50 contacts at a time to avoid timeouts</p>
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">limit: 50</code>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-6">
                      <Shield className="h-8 w-8 text-purple-600 mb-3" />
                      <h4 className="font-semibold text-purple-900 mb-2">Rate Limiting</h4>
                      <p className="text-sm text-purple-700 mb-3">1s delay between requests to respect limits</p>
                      <code className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">1000ms delay</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HubSpot Fields Configuration */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Custom Fields in HubSpot</h2>
                <p className="text-gray-600">Configure these fields to store enriched data</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hubspotFields.map((field, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FileText className="h-6 w-6 text-indigo-600 mr-3" />
                    <h3 className="font-bold text-gray-900">{field.label}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Internal name:</span>
                      <code className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{field.name}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{field.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">How to create custom fields in HubSpot</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Go to Settings → Properties → Contact properties</li>
                    <li>Click "Create property"</li>
                    <li>Configure name, type and permissions</li>
                    <li>Save and test the integration</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring & Analytics */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Monitoring & Analytics</h2>
                <p className="text-gray-600">Track your integration performance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, title: 'Success Rate', value: '95%', color: 'from-green-500 to-green-600' },
                { icon: Clock, title: 'Average Time', value: '2.3s', color: 'from-blue-500 to-blue-600' },
                { icon: Database, title: 'Contacts Processed', value: '1,247', color: 'from-purple-500 to-purple-600' },
                { icon: Zap, title: 'API Calls/day', value: '3,891', color: 'from-orange-500 to-orange-600' }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.title}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="font-bold text-green-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Success Metrics
                </h3>
                <div className="space-y-3">
                  {[
                    'Successfully enriched contacts',
                    'Average processing time',
                    'Data found rate',
                    'Quality of returned data'
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center text-sm text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {metric}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Alerts & Errors
                </h3>
                <div className="space-y-3">
                  {[
                    'Rate limiting reached',
                    'External APIs unavailable',
                    'Processing timeouts',
                    'Invalid data received'
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center text-sm text-orange-800">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg border border-blue-200 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Choose your approach and start enriching your HubSpot data automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/api-documentation')}
                  className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                >
                  <Code className="h-5 w-5" />
                  View API Documentation
                </button>
                <button
                  onClick={() => navigate('/domain-enrichment')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Zap className="h-5 w-5" />
                  Test Enrichment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HubSpotIntegrationPage; 
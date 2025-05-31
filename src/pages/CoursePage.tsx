import React, { useState } from 'react';
import { ExternalLink, Clock, Users, Award, CheckCircle, Star, GraduationCap, Target, TrendingUp, Sparkles, BookOpen, Brain, Zap, BarChart2, Settings, Database, MessageSquare, LineChart, Cog, ChevronDown, ChevronRight, Monitor, Code, Globe, Layers, Bot, Shield } from 'lucide-react';

const CoursePage = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const modules = [
    {
      month: 1,
      title: 'CRM Foundation & Advanced Administration',
      subtitle: 'Advanced CRM Fundamentals and HubSpot Platform Administration',
      description: 'Build a solid foundation with comprehensive CRM audit, user management, and data governance. Establish naming conventions and best practices for scalability.',
      duration: '4 weeks',
      color: 'from-blue-500 to-blue-600',
      icon: Database,
      topics: [
        'Complete CRM audit and duplicate data cleanup',
        'Custom properties and field configuration',
        'User management, teams, and permission setup',
        'Naming conventions and organizational standards',
        'Basic integrations and tracking setup',
        'Data quality tools and standardization',
        'Global settings and lifecycle configuration'
      ],
      objectives: 'By month-end, I will have an optimized, controlled CRM with custom properties, clean user management, and standardized data structure ready for advanced functionality.',
      practicalProjects: [
        'Complete CRM audit with duplicate identification and cleanup',
        'Implement naming conventions across 5+ assets',
        'Create test user with custom permissions',
        'Establish configuration checklist and documentation'
      ]
    },
    {
      month: 2,
      title: 'Marketing Hub Mastery',
      subtitle: 'Marketing Automation and Personalization',
      description: 'Master the Marketing Hub with advanced campaigns, automation workflows, and AI-powered content personalization for high-performance marketing.',
      duration: '4 weeks',
      color: 'from-green-500 to-green-600',
      icon: Zap,
      topics: [
        'Advanced campaign creation and asset grouping',
        'Landing pages, forms, and conversion optimization',
        'Email automation and smart content personalization',
        'Lead nurturing workflows with complex logic',
        'Traditional vs. predictive lead scoring',
        'Email deliverability and authentication',
        'AI content generation and optimization',
        'Social media management and advertising integration'
      ],
      objectives: 'I will orchestrate sophisticated marketing automations that attract, engage, and convert leads measurably, leveraging AI for content creation and optimization.',
      practicalProjects: [
        'Complete inbound campaign: e-book landing page with nurturing sequence',
        'Multi-branch workflow with personalization and smart content',
        'Lead scoring implementation with qualification handoff',
        'Campaign dashboard with conversion analytics'
      ]
    },
    {
      month: 3,
      title: 'Sales Hub Optimization',
      subtitle: 'Advanced Sales Pipeline and Automation',
      description: 'Optimize sales processes with custom pipelines, prospecting sequences, and predictive AI to maximize conversions and sales velocity.',
      duration: '4 weeks',
      color: 'from-purple-500 to-purple-600',
      icon: Target,
      topics: [
        'Custom pipeline configuration and deal stages',
        'Sales automation workflows and deal triggers',
        'Email sequences and prospecting templates',
        'Predictive lead scoring and AI forecasting',
        'Playbooks and call management',
        'Sales reporting and performance dashboards',
        'Marketing-to-Sales handoff optimization',
        'Quote generation and proposal management'
      ],
      objectives: 'I will deliver a turbocharged Sales Hub where all leads and deals are tracked efficiently, with automations that streamline repetitive tasks and AI-powered prioritization.',
      practicalProjects: [
        'Pipeline reengineering with automated stage actions',
        '4-step prospecting sequence with templates',
        'Lead scoring comparison: manual vs. predictive AI',
        'Sales dashboard with forecasting and activity metrics'
      ]
    },
    {
      month: 4,
      title: 'Service Hub Excellence',
      subtitle: 'Customer Support and Success Automation',
      description: 'Elevate customer service with intelligent ticketing, knowledge base, chatbots, and feedback systems for exceptional customer experience.',
      duration: '4 weeks',
      color: 'from-orange-500 to-orange-600',
      icon: MessageSquare,
      topics: [
        'Ticket pipeline and SLA automation',
        'Knowledge base creation and optimization',
        'Live chat and AI chatbot implementation',
        'Customer feedback and satisfaction surveys',
        'Support analytics and performance tracking',
        'AI-powered sentiment analysis',
        'Cross-team integration (Sales/Service alignment)',
        'Proactive customer success workflows'
      ],
      objectives: 'I will establish a robust, intelligent support system where customers receive quick responses through self-service or structured human interaction, with no tickets lost.',
      practicalProjects: [
        'Automated support flow with email and form integration',
        'Knowledge base with AI-powered chatbot',
        'NPS survey automation with proactive follow-up',
        'Support dashboard with satisfaction metrics'
      ]
    },
    {
      month: 5,
      title: 'Operations Hub & Advanced Integrations',
      subtitle: 'Data Unification and System Expansion',
      description: 'Master integrations and operations, making HubSpot the central nervous system of your tech stack with custom code and advanced data management.',
      duration: '4 weeks',
      color: 'from-indigo-500 to-indigo-600',
      icon: Cog,
      topics: [
        'Native integrations and Data Sync configuration',
        'No-code automation with Zapier/Make',
        'Custom coded actions and webhook implementation',
        'Data quality automation and validation',
        'BI integration and external reporting',
        'Custom objects and advanced data modeling',
        'API integration and custom development',
        'Governance and monitoring systems'
      ],
      objectives: 'I will integrate HubSpot deeply into my business ecosystem, with unified data across systems, automated quality control, and custom solutions for unique challenges.',
      practicalProjects: [
        'Bidirectional Google Sheets integration via Zapier',
        'Custom code action for external API enrichment',
        'Custom objects implementation with relationships',
        'Multi-source reporting consolidation'
      ]
    },
    {
      month: 6,
      title: 'AI Strategy & Advanced Analytics',
      subtitle: 'Strategic Intelligence and Predictive Analysis',
      description: 'Unite all fronts with emphasis on AI, predictive analytics, and strategic platform use. Become a data-driven decision maker and innovation leader.',
      duration: '4 weeks',
      color: 'from-red-500 to-red-600',
      icon: Brain,
      topics: [
        'Latest HubSpot AI features and updates',
        'Predictive analytics and custom ML models',
        'Executive dashboards and strategic reporting',
        'Advanced personalization and behavioral analysis',
        'Platform governance and scaling strategies',
        'Team training and community leadership',
        'Strategic vision and business alignment',
        'Innovation projects and future roadmapping'
      ],
      objectives: 'I will become an internal HubSpot leader who not only maintains the system but continuously adapts and improves it to drive measurable business results.',
      practicalProjects: [
        'AI-powered sales forecasting with action plans',
        'Customer 360 view with AI insights',
        'Innovation hackathon project',
        'Strategic presentation with 6-12 month roadmap'
      ]
    },
    {
      month: 'BONUS',
      title: 'English Proficiency Enhancement',
      subtitle: 'Technical English & Global Communication Skills',
      description: 'Master technical English communication to access global HubSpot resources, participate in international communities, and advance my career.',
      duration: '4 weeks',
      color: 'from-emerald-500 via-teal-500 to-cyan-600',
      icon: Globe,
      isBonus: true,
      topics: [
        'Technical vocabulary for CRM, marketing automation, and sales processes',
        'HubSpot Academy content consumption in English',
        'International community participation and networking',
        'Technical documentation reading and writing skills',
        'Presentation skills for global audience',
        'Email communication with international teams',
        'Professional LinkedIn content creation in English',
        'Attending global HubSpot events and webinars'
      ],
      objectives: 'I will develop fluent technical English skills to unlock global opportunities, access premium content, and position myself as an international HubSpot expert.',
      practicalProjects: [
        'Complete HubSpot Academy course entirely in English',
        'Write technical blog post about HubSpot best practices',
        'Participate in HubSpot Community discussions',
        'Create English presentation about your 6-month journey',
        'Network with 5 international HubSpot professionals'
      ],
      resources: [
        'HubSpot Academy (English-only courses)',
        'Grammarly for technical writing improvement',
        'Cambly or iTalki for conversation practice',
        'HubSpot Community & User Groups',
        'Technical English vocabulary apps',
        'International HubSpot events and conferences'
      ]
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI & Machine Learning',
      description: 'Master predictive lead scoring, AI forecasting, and intelligent automation throughout the platform'
    },
    {
      icon: Database,
      title: 'Data Governance',
      description: 'Learn advanced data management, quality control, and integration strategies for enterprise-level operations'
    },
    {
      icon: Code,
      title: 'Custom Development',
      description: 'Implement custom coded actions, API integrations, and advanced workflow logic for unique business needs'
    },
    {
      icon: LineChart,
      title: 'Strategic Analytics',
      description: 'Build executive dashboards, predictive models, and data-driven decision frameworks'
    },
    {
      icon: Layers,
      title: 'Platform Integration',
      description: 'Connect HubSpot with your entire tech stack using native apps, APIs, and no-code automation tools'
    },
    {
      icon: Shield,
      title: 'Enterprise Governance',
      description: 'Establish security, compliance, and scaling strategies for growing organizations'
    }
  ];

  const certifications = [
    'HubSpot Marketing Software Certification',
    'HubSpot Sales Software Certification',
    'HubSpot Service Hub Certification',
    'HubSpot Operations Hub Certification',
    'Inbound Marketing Certification',
    'Revenue Operations (RevOps) Certification'
  ];

  const resources = [
    {
      category: 'Core Learning',
      items: [
        'HubSpot Academy (Portuguese & English)',
        'Official Documentation & Knowledge Base',
        'Product Updates Blog & Release Notes',
        'Community Forums & Expert Networks'
      ]
    },
    {
      category: 'Advanced Resources',
      items: [
        'API Documentation & Developer Guides',
        'Integration Marketplace & Apps',
        'Custom Code Examples & Libraries',
        'Partner Resources & Case Studies'
      ]
    },
    {
      category: 'Practical Tools',
      items: [
        'Workflow Templates & Best Practices',
        'Dashboard Templates & KPI Frameworks',
        'Data Quality Checklists',
        'Integration Planning Worksheets'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">My development plan</h1>
              <p className="text-xl text-purple-100">Individual Development Plan - 6 Months + Bonus</p>
            </div>
          </div>
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              My Journey to Become a HubSpot Super Admin
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed mb-6">
              I will master all HubSpot modules (Marketing, Sales, Service, Operations) with advanced automations, 
              complex integrations, applied AI, predictive analytics, and strategic governance. 
              I will evolve from technical operator to strategic decision-maker.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">6 Months Intensive</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2">
              <Target className="h-5 w-5 mr-2" />
              <span className="font-medium">Advanced to Expert Level</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-2">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-medium">Multiple Certifications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Plan Overview</h2>
            <p className="text-gray-600">Comprehensive 6-month development journey</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">My Objective</h3>
            <p className="text-gray-700 leading-relaxed">
              Transform myself from an advanced user into a HubSpot super admin with world-class mastery of all modules. 
              This intensive plan is structured month-by-month, covering advanced topics, monthly objectives, 
              recommended resources in Portuguese and English, practical tips, and real-world projects.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">My Current Profile</h3>
            <p className="text-gray-700 leading-relaxed">
              I am an advanced HubSpot user ready to become a strategic administrator who can extract maximum value 
              from the platform, implement complex automations, and lead innovation initiatives within my organization.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start">
            <Sparkles className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">My Development Focus</h4>
              <p className="text-blue-800 leading-relaxed">
                I will follow each step to evolve from technical operator to strategist who extracts maximum value 
                from the HubSpot platform. Each month builds upon the previous, creating a comprehensive 
                foundation for enterprise-level CRM administration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Curriculum */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <Monitor className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My 6-Month Curriculum + Bonus</h2>
            <p className="text-gray-600">Detailed month-by-month progression with English enhancement bonus</p>
          </div>
        </div>

        <div className="space-y-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const isExpanded = expandedModule === index;
            
            return (
              <div key={index} className={`border ${module.isBonus ? 'border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50' : 'border-gray-200'} rounded-2xl overflow-hidden ${module.isBonus ? 'shadow-lg' : ''}`}>
                {module.isBonus && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 px-4">
                    <span className="font-bold text-sm">🎉 BONUS MODULE - English Enhancement</span>
                  </div>
                )}
                <div 
                  className={`p-6 cursor-pointer ${module.isBonus ? 'hover:bg-emerald-50' : 'hover:bg-gray-50'} transition-colors`}
                  onClick={() => toggleModule(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center mr-6 ${module.isBonus ? 'shadow-lg' : ''}`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`${module.isBonus ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'} text-sm font-bold py-1 px-3 rounded-full`}>
                            {module.isBonus ? 'BONUS' : `Month ${module.month}`}
                          </span>
                          <span className="text-gray-500 text-sm">{module.duration}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{module.title}</h3>
                        <p className={`text-lg font-medium ${module.isBonus ? 'text-emerald-600' : 'text-blue-600'} mb-2`}>{module.subtitle}</p>
                        <p className="text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className={`border-t ${module.isBonus ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50'} p-6`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                          <Target className={`h-5 w-5 mr-2 ${module.isBonus ? 'text-emerald-600' : 'text-blue-600'}`} />
                          Key Topics
                        </h4>
                        <div className="space-y-2">
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                                                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Star className="h-5 w-5 mr-2 text-yellow-500" />
                             {module.isBonus ? 'My Bonus Objectives' : 'My Monthly Objectives'}
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{module.objectives}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Cog className={`h-5 w-5 mr-2 ${module.isBonus ? 'text-emerald-600' : 'text-purple-600'}`} />
                            Practical Projects
                          </h4>
                          <div className="space-y-2">
                            {module.practicalProjects.map((project, projectIndex) => (
                              <div key={projectIndex} className="flex items-start">
                                <div className={`w-2 h-2 ${module.isBonus ? 'bg-emerald-500' : 'bg-purple-500'} rounded-full mr-2 mt-2 flex-shrink-0`}></div>
                                <span className="text-gray-700 text-sm">{project}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bonus Resources Section */}
                        {module.isBonus && module.resources && (
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <Globe className="h-5 w-5 mr-2 text-emerald-600" />
                              Recommended Resources
                            </h4>
                            <div className="space-y-2">
                              {module.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="flex items-start">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700 text-sm">{resource}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certifications & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Certifications */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Target Certifications</h2>
              <p className="text-gray-600">Professional recognition I will achieve</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Learning Resources</h2>
              <p className="text-gray-600">Portuguese & English materials I will use</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {resources.map((section, index) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900 mb-3">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Philosophy */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-indigo-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">My Development Philosophy</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            My intensive development plan combines theoretical knowledge with hands-on practical experience. 
            Each month builds systematically upon previous learning, ensuring I develop both 
            technical expertise and strategic thinking capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-indigo-900 mb-2">I Learn by Doing</h3>
              <p className="text-gray-600 text-sm">Every concept I learn is reinforced with practical projects and real-world applications</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-indigo-900 mb-2">My Progressive Complexity</h3>
              <p className="text-gray-600 text-sm">I start with foundations and gradually master advanced integrations and AI</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-indigo-900 mb-2">My Strategic Focus</h3>
              <p className="text-gray-600 text-sm">I will transform from operator to strategic leader who drives business results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 
import React, { useState } from 'react';
import { ExternalLink, ChevronRight, BookOpen, Target, TrendingUp, Sparkles, Users, BarChart2, Database, Lightbulb, CheckCircle, ArrowRight, X, Settings, Filter, PieChart } from 'lucide-react';

const TutorialPage = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<number | null>(null);

  const steps = [
    {
      number: '1',
      title: 'Access Datasets Area',
      description: 'In HubSpot main menu, navigate to:',
      path: 'Reports → Data Management → Datasets',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '2', 
      title: 'Start a New Dataset',
      description: 'Click "Create dataset" button in the top right corner of the page.',
      color: 'from-green-500 to-green-600'
    },
    {
      number: '3',
      title: 'Select Data Sources',
      description: 'Choose up to 5 CRM objects as sources for your dataset:',
      items: [
        'Choose Contacts as primary source to analyze your enriched leads',
        'Add Companies if you want to correlate leads with their companies',
        'Include Deals for conversion and revenue analysis',
        'Optionally add Tickets or Products if relevant'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '4',
      title: 'Add Properties',
      description: 'Select the properties you want to include in the dataset:',
      items: [
        'For enriched contacts, include Name, Company, Job Title and custom properties Specialty and Seniority',
        'From Companies source, include Company Name, Industry, Company Size, etc.',
        'From Deals, add Amount, Stage, Close Date, etc.'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      number: '5',
      title: 'Save and Name Your Dataset',
      description: 'Give a descriptive name to your dataset, like "Enriched Leads - Conversion Analysis" and click "Save".',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const useCases = [
    {
      title: 'Conversion Analysis by Specialty',
      description: 'Create a report showing lead-to-customer conversion rate, segmented by professional specialty identified by AI.',
      color: 'from-blue-500 to-blue-600',
      icon: TrendingUp,
      details: {
        objective: 'Identify which professional specialties convert better to customers to optimize marketing campaigns.',
        chartType: 'Bar Chart or Funnel',
        dimensions: [
          { name: 'Specialty', description: 'Custom field created by AI (Marketing, Sales, IT, HR, etc.)', source: 'Contacts' },
          { name: 'Month/Year', description: 'Lead creation date', source: 'Contacts' }
        ],
        metrics: [
          { name: 'Conversion Rate', description: 'Formula: (Closed Deals / Total Leads) * 100', calculation: 'Calculated Field' },
          { name: 'Total Leads', description: 'Count of contacts by specialty', calculation: 'COUNT(Contacts)' },
          { name: 'Deals Created', description: 'Number of opportunities opened', calculation: 'COUNT(Deals)' },
          { name: 'Average Deal Value', description: 'Average revenue by specialty', calculation: 'AVG(Deal Amount)' }
        ],
        filters: [
          'Lifecycle Stage = "Lead" or "Customer"',
          'Created date in last 12 months',
          'Specialty is not empty'
        ],
        insights: [
          'Specialties with highest conversion rates',
          'Average deal value by professional area',
          'Seasonal conversion trends',
          'ROI by specialty for budget optimization'
        ]
      }
    },
    {
      title: 'Lead Distribution by Seniority Level',
      description: 'Visualize how your leads are distributed across different hierarchical levels (Junior, Senior, C-Level) to optimize approaches.',
      color: 'from-green-500 to-green-600',
      icon: Users,
      details: {
        objective: 'Understand hierarchical distribution of leads to personalize approach and pricing strategies.',
        chartType: 'Pie Chart or Donut Chart',
        dimensions: [
          { name: 'Seniority Level', description: 'Field created by AI (Junior, Mid-level, Senior, Manager, Director, C-Level)', source: 'Contacts' },
          { name: 'Company Industry', description: 'Industry category', source: 'Companies' }
        ],
        metrics: [
          { name: 'Lead Count', description: 'Total contacts by hierarchical level', calculation: 'COUNT(Contacts)' },
          { name: 'Percentage by Level', description: 'Percentage distribution', calculation: '(COUNT by level / COUNT total) * 100' },
          { name: 'Average Lead Score', description: 'Average score by seniority', calculation: 'AVG(Lead Score)' },
          { name: 'Average Conversion Time', description: 'Days to first purchase', calculation: 'AVG(First purchase date - Creation date)' }
        ],
        filters: [
          'Seniority Level is not empty',
          'Lifecycle Stage = "Lead", "MQL", "SQL"',
          'Created date in last 6 months'
        ],
        insights: [
          'Predominant hierarchical profile of leads',
          'Levels with highest purchase propensity',
          'Pricing strategies by seniority',
          'Most effective acquisition channels by level'
        ]
      }
    },
    {
      title: 'Campaign Performance by Segment',
      description: 'Compare performance of different marketing campaigns based on specialty and seniority of captured leads.',
      color: 'from-purple-500 to-purple-600',
      icon: BarChart2,
      details: {
        objective: 'Optimize marketing campaigns by identifying which generate highest quality leads by professional segment.',
        chartType: 'Grouped Bar Chart or Matrix',
        dimensions: [
          { name: 'Original Campaign', description: 'Source of first interaction', source: 'Contacts' },
          { name: 'Specialty + Seniority', description: 'Combination of AI fields', source: 'Contacts' },
          { name: 'Campaign Month', description: 'Execution period', source: 'Contacts' }
        ],
        metrics: [
          { name: 'Cost per Qualified Lead', description: 'CPL segmented by profile', calculation: 'Campaign Spend / COUNT(MQLs)' },
          { name: 'ROI by Segment', description: 'Return on investment', calculation: '(Revenue - Cost) / Cost * 100' },
          { name: 'Qualification Rate', description: 'Lead to MQL', calculation: '(MQLs / Total Leads) * 100' },
          { name: 'Average Lifetime Value', description: 'Customer value by profile', calculation: 'AVG(LTV by segment)' }
        ],
        filters: [
          'Original Campaign is not empty',
          'Created date in last 12 months',
          'Specialty and Seniority are filled'
        ],
        insights: [
          'Most effective campaigns by segment',
          'Cost per Acquisition (CPA) by professional profile',
          'Channels that generate highest value leads',
          'Most profitable segments to invest in'
        ]
      }
    }
  ];

  const tips = [
    {
      icon: '💡',
      title: 'Use Descriptive Names',
      description: 'Use descriptive names for both the dataset and calculated fields, making it easier for the entire team to understand.'
    },
    {
      icon: '🔐',
      title: 'Check Permissions',
      description: 'Dataset creation requires an Operations Hub Professional or Enterprise subscription. Verify your account has the necessary permissions.'
    },
    {
      icon: '🔄',
      title: 'Automatic Updates',
      description: 'Remember that dataset changes reflect in all reports based on it. This is useful for keeping everything updated.'
    },
    {
      icon: '📊',
      title: 'Monitor Limits',
      description: 'There are limits to the number of datasets that can be created, depending on your HubSpot subscription. Manage your datasets carefully.'
    }
  ];

  const closeModal = () => setSelectedUseCase(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">HubSpot Tutorial</h1>
              <p className="text-purple-100">Create powerful datasets with enriched data</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-purple-100 max-w-4xl leading-relaxed">
            Learn how to create and use datasets in HubSpot to maximize your enriched leads.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Database,
            title: 'Smart Datasets',
            description: 'Combine multiple data sources in unified analyses',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: Target,
            title: 'Advanced Segmentation',
            description: 'Use specialties and seniority for precise analysis',
            color: 'from-green-500 to-green-600'
          },
          {
            icon: BarChart2,
            title: 'Custom Reports',
            description: 'Create visualizations that reveal unique insights',
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

      {/* What is a Dataset */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">What is a Dataset in HubSpot?</h2>
            <p className="text-gray-600">Fundamental concepts you need to know</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              A dataset in HubSpot is a collection of properties and calculations
              prepared to facilitate the creation of custom reports. With datasets,
              you can combine different CRM objects (contacts, companies, deals) into a
              single data source for analysis.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Datasets are especially useful when you want to analyze your enriched leads
              in relation to other entities in HubSpot, such as business opportunities or
              marketing activities.
            </p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Dataset Benefits</h3>
            <div className="space-y-3">
              {[
                'Combine multiple data sources',
                'Create advanced custom reports',
                'Automated cross-object analyses',
                'Custom calculated fields'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <ArrowRight className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Step by Step: Creating a Dataset</h2>
            <p className="text-gray-600">Complete guide to set up your first dataset</p>
          </div>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex">
              <div className="mr-6 flex-shrink-0">
                <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-700 mb-3">{step.description}</p>
                
                {step.path && (
                  <div className="flex items-center text-sm text-indigo-600 mb-3 bg-indigo-50 px-3 py-2 rounded-xl">
                    <span className="font-medium">{step.path}</span>
                  </div>
                )}
                
                {step.items && (
                  <ul className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Using Dataset for Reports */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Using Dataset for Reports</h2>
            <p className="text-gray-600">How to create powerful reports with your data</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
          <p className="text-blue-800 font-medium mb-4">
            After creating your dataset, you can use it to create custom reports:
          </p>
          <ol className="space-y-3 text-blue-700">
            {[
              'In Reports menu, click "Create custom report"',
              'Select your dataset as data source',
              'Choose visualization type (table, bar chart, pie chart, etc.)',
              'Configure dimensions and metrics based on available properties',
              'Apply filters, such as filtering by specific specialty or seniority',
              'Save the report to a dashboard for regular access'
            ].map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full text-xs font-bold text-blue-800 mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Use Cases with Enriched Leads</h2>
            <p className="text-gray-600">Practical cases to maximize your data value</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{useCase.description}</p>
                <button
                  onClick={() => setSelectedUseCase(index)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  View Detailed Configuration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips and Best Practices */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tips and Best Practices</h2>
            <p className="text-gray-600">Recommendations to maximize your results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
              <div className="text-2xl mr-4 flex-shrink-0">{tip.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-700 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Link */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 text-center border border-indigo-200">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ExternalLink className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Official HubSpot Documentation</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          For more detailed and updated information about datasets in HubSpot, check the official documentation.
        </p>
        <a
          href="https://knowledge.hubspot.com/data-management/create-and-use-datasets"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Access Documentation
          <ExternalLink className="ml-3 h-5 w-5" />
        </a>
      </div>

      {/* Modal for Use Case Details */}
      {selectedUseCase !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${useCases[selectedUseCase].color} rounded-xl flex items-center justify-center mr-4`}>
                      {React.createElement(useCases[selectedUseCase].icon, { className: "h-6 w-6 text-white" })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{useCases[selectedUseCase].title}</h2>
                      <p className="text-gray-600">Detailed HubSpot Configuration</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Objective */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Report Objective</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{useCases[selectedUseCase].details.objective}</p>
                </div>

                {/* Chart Type */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <PieChart className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Recommended Visualization Type</h3>
                  </div>
                  <p className="text-gray-700 font-medium">{useCases[selectedUseCase].details.chartType}</p>
                </div>

                {/* Dimensions */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center">
                      <BarChart2 className="h-6 w-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Dimensions (Axes/Categories)</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {useCases[selectedUseCase].details.dimensions.map((dimension, index) => (
                        <div key={index} className="flex items-start p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{dimension.name}</h4>
                            <p className="text-gray-700 text-sm mb-2">{dimension.description}</p>
                            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                              Source: {dimension.source}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Metrics (Values/KPIs)</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {useCases[selectedUseCase].details.metrics.map((metric, index) => (
                        <div key={index} className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{metric.name}</h4>
                            <p className="text-gray-700 text-sm mb-2">{metric.description}</p>
                            <div className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded-lg font-mono">
                              {metric.calculation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                    <div className="flex items-center">
                      <Filter className="h-6 w-6 text-white mr-3" />
                      <h3 className="text-xl font-bold text-white">Recommended Filters</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {useCases[selectedUseCase].details.filters.map((filter, index) => (
                        <div key={index} className="flex items-center p-3 bg-teal-50 rounded-xl border border-teal-200">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span className="text-gray-700 font-medium font-mono text-sm">{filter}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-6 w-6 text-yellow-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">Insights You'll Get</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {useCases[selectedUseCase].details.insights.map((insight, index) => (
                      <div key={index} className="flex items-start p-3 bg-white rounded-xl border border-yellow-200">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={closeModal}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Got it, I'll implement this!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;
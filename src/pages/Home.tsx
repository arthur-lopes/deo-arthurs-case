import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, BarChart2, GraduationCap, Globe, Mail, BookOpen, TrendingUp, Users, Database, Sparkles, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Leads Processed', value: '12.5K+', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Companies Analyzed', value: '1.2K+', icon: Database, color: 'from-green-500 to-green-600' },
    { label: 'Accuracy Rate', value: '94.5%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Time Saved', value: '850h', icon: Zap, color: 'from-orange-500 to-orange-600' },
  ];

  const features = [
    {
      to: '/upload',
      title: 'Process CSV',
      description: 'Intelligent data upload and processing with advanced AI',
      icon: FileUp,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'Most Popular',
      features: ['Automatic cleaning', 'Duplicate detection', 'AI consolidation']
    },
    {
      to: '/domain',
      title: 'Domain Search',
      description: 'Find leads automatically from company website domains',
      icon: Globe,
      gradient: 'from-green-600 to-emerald-600',
      badge: 'Advanced AI',
      features: ['Smart search', 'Real-time data', 'Multiple sources']
    },
    {
      to: '/email',
      title: 'Email Enrichment',
      description: 'Get complete professional profile using specific email address',
      icon: Mail,
      gradient: 'from-purple-600 to-pink-600',
      badge: 'Full Profile',
      features: ['Social data', 'Professional history', 'Current company']
    }
  ];

  const tools = [
    {
      to: '/results',
      title: 'Results Center',
      description: 'Visualize, analyze and export your processed data',
      icon: BarChart2,
      color: 'text-indigo-600'
    },
    {
      to: '/tutorial',
      title: 'HubSpot Tutorial',
      description: 'Learn to create datasets and lists in HubSpot',
      icon: GraduationCap,
      color: 'text-blue-600'
    },
    {
      to: '/course',
      title: 'DEO Academy',
      description: 'Complete course on lead automation and analysis',
      icon: BookOpen,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">DEO - Arthur's Case</h1>
              <p className="text-blue-100">Intelligent Data Enrichment Platform</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed">
            Transform raw data into valuable insights with our advanced AI. 
            Clean, standardize and enrich your leads automatically.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div> */}

      {/* Main Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Main Tools</h2>
          <p className="text-gray-600">Choose the best approach for your data</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.to}
                className="group relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full">
                    {feature.badge}
                  </span>
                </div>
                
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-2 mb-6">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  Get started now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Tools</h2>
          <p className="text-gray-600">Maximize your results with these features</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                to={tool.to}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors`}>
                    <Icon className={`h-6 w-6 ${tool.color} transition-colors`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Process Overview */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three different approaches to meet your data enrichment needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CSV Method</h3>
              <p className="text-blue-600 font-medium">Upload & Processing</p>
            </div>
            
            {[
              { step: '1', title: 'Data Upload', desc: 'Upload your CSV file with leads' },
              { step: '2', title: 'Automatic Cleaning', desc: 'AI cleans and standardizes data' },
              { step: '3', title: 'Enrichment', desc: 'Adds specialties and seniority levels' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Domain Method</h3>
              <p className="text-green-600 font-medium">AI Discovers Leads</p>
            </div>
            
            {[
              { step: '1', title: 'Enter Domain', desc: 'Input company website' },
              { step: '2', title: 'AI Search', desc: 'AI identifies leads automatically' },
              { step: '3', title: 'Complete Data', desc: 'Receive complete professional profiles' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Method</h3>
              <p className="text-purple-600 font-medium">Individual Profile</p>
            </div>
            
            {[
              { step: '1', title: 'Specific Email', desc: 'Enter a professional email' },
              { step: '2', title: 'Advanced Search', desc: 'AI collects data from multiple sources' },
              { step: '3', title: 'Rich Profile', desc: 'Detailed professional history' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">{item.step}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Settings, Zap, FileText, Brain, Sparkles, Target, TrendingUp, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUploader from '../components/FileUploader';
import ProgressIndicator from '../components/ProgressIndicator';
import ApiStatusIndicator from '../components/ApiStatusIndicator';
import { parseCSV, processLeads, processLeadsCleanOnly, processLeadsAdvanced } from '../services/csvService';
import { useLeadContext } from '../context/LeadContext';

const UploadPage = () => {
  const {
    setLeads,
    setOriginalLeads,
    isProcessing,
    setIsProcessing,
    processingStatus,
    setProcessingStatus,
    processingProgress,
    setProcessingProgress,
    fileName,
    setFileName,
  } = useLeadContext();
  
  const [error, setError] = useState<string | null>(null);
  const [processingMode, setProcessingMode] = useState<'clean' | 'enrich' | 'advanced'>('enrich');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Reset state when component mounts
    setProcessingProgress(0);
    setProcessingStatus('');
    setError(null);
    
    // No need to reset isProcessing if we want to maintain processing state
    // across navigation (e.g., if user goes back while processing)
    
    return () => {
      // Clean up if needed
    };
  }, [setProcessingProgress, setProcessingStatus]);

  const handleFileSelected = async (file: File) => {
    try {
      setFileName(file.name);
      setIsProcessing(true);
      setProcessingStatus('Analyzing CSV file...');
      setProcessingProgress(10);
      setError(null);
      
      // Parse CSV file
      const { data } = await parseCSV(file);
      
      if (data.length === 0) {
        throw new Error('The file does not contain valid data.');
      }
      
      setOriginalLeads(data);
      setProcessingProgress(20);
      
      // Process leads based on selected mode
      let processedLeads;
      if (processingMode === 'clean') {
        processedLeads = await processLeadsCleanOnly(
          data,
          (progress) => setProcessingProgress(progress),
          (status) => setProcessingStatus(status)
        );
      } else if (processingMode === 'advanced') {
        processedLeads = await processLeadsAdvanced(
          data,
          (progress) => setProcessingProgress(progress),
          (status) => setProcessingStatus(status)
        );
      } else {
        processedLeads = await processLeads(
          data,
          (progress) => setProcessingProgress(progress),
          (status) => setProcessingStatus(status)
        );
      }
      
      setLeads(processedLeads);
      
      // Complete
      setProcessingStatus('Processing completed!');
      setProcessingProgress(100);
      
      toast.success('Data processed successfully!');
      
      // Navigate to results page after a brief delay
      setTimeout(() => {
        navigate('/results');
      }, 1000);
      
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Error processing file.');
      setIsProcessing(false);
      setProcessingProgress(0);
      toast.error('Error processing file.');
    }
  };

  const handleFileRemoved = () => {
    // Clear all file-related states
    setFileName('');
    setLeads([]);
    setOriginalLeads([]);
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingStatus('');
    setError(null);
    toast.success('File removed successfully!');
  };

  const processingOptions = [
    {
      id: 'clean',
      title: 'Clean Only',
      subtitle: 'Basic Processing',
      description: 'Normalizes names, formats phones and standardizes data without using AI',
      features: ['⚡ Fast processing (~50ms/lead)', '💰 No AI costs', '📊 Basic standardization'],
      icon: FileText,
      color: 'from-green-500 to-green-600',
      time: '~30s for 1000 leads',
      cost: 'Free'
    },
    {
      id: 'enrich',
      title: 'Clean + Enrichment',
      subtitle: 'Standard Processing (Recommended)',
      description: 'Adds specialty and seniority using AI, keeping original data',
      features: ['🤖 OpenAI analysis', '🎯 Professional specialty', '📈 Seniority level'],
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      time: '~5min for 1000 leads',
      cost: 'Low AI cost'
    },
    {
      id: 'advanced',
      title: 'Advanced Deduplication',
      subtitle: 'Complete Processing',
      description: 'Removes duplicates with AI, consolidates information and optimizes database',
      features: ['🧠 Advanced AI (full analysis)', '🔄 Duplicate detection', '⚙️ Smart consolidation'],
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      time: '~15min for 1000 leads',
      cost: 'High AI cost'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 rounded-3xl p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Process CSV</h1>
                <p className="text-orange-100">AI transforms your data into valuable insights</p>
              </div>
            </div>
            <ApiStatusIndicator />
          </div>
          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl leading-relaxed">
            Upload your data and choose the ideal processing level. Our AI cleans, enriches and deduplicates automatically.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Sparkles,
            title: 'Smart AI',
            description: 'OpenAI GPT-4 analyzes and enriches each lead with precision',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: Target,
            title: 'Accurate Data',
            description: 'Specialties and seniority based on real analysis',
            color: 'from-green-500 to-green-600'
          },
          {
            icon: TrendingUp,
            title: 'Fast Results',
            description: 'Optimized processing with real-time feedback',
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-start shadow-lg">
          <AlertCircle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Processing Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Processing Mode Selection */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mr-4">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Processing Options</h2>
            <p className="text-gray-600">Choose the ideal method for your data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {processingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = processingMode === option.id;
            return (
              <div
                key={option.id}
                className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setProcessingMode(option.id as any)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-sm font-medium text-blue-600 mb-2">{option.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {option.features.map((feature, index) => (
                    <div key={index} className="text-sm text-gray-700">{feature}</div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {option.time}
                    </div>
                    <div className="font-medium text-gray-700">{option.cost}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mr-4">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
            <p className="text-gray-600">Upload your CSV file to get started</p>
          </div>
        </div>

        <FileUploader
          onFileSelected={handleFileSelected}
          onFileRemoved={handleFileRemoved}
          isProcessing={isProcessing}
          fileName={fileName}
        />

        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Sample File</span>
            </div>
            <a
              href="/exemplo_leads.csv"
              download="sample_leads.csv"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              📥 Download sample file
            </a>
          </div>
        </div>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 animate-pulse">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Processing in Progress</h2>
              <p className="text-gray-600">Our AI is analyzing your data</p>
            </div>
          </div>
          <ProgressIndicator
            progress={processingProgress}
            status={processingStatus}
          />
        </div>
      )}

      {/* Instructions and Tips */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Instructions and Requirements</h2>
            <p className="text-gray-600">Prepare your file for best results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Requirements */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 File Requirements</h3>
            <div className="space-y-3">
              {[
                'CSV format (comma-separated values)',
                'Maximum file size of 5MB',
                'UTF-8 encoding for special characters',
                'First row must contain headers'
              ].map((requirement, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column Requirements */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Required Columns</h3>
            <div className="space-y-3">
              {[
                { name: 'Full Name', desc: 'Complete lead name', required: true },
                { name: 'Company', desc: 'Company name', required: true },
                { name: 'Job Title', desc: 'Current position', required: true },
                { name: 'Email', desc: 'Email address', required: true }
              ].map((column, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-900">{column.name}</span>
                    <p className="text-sm text-gray-600">{column.desc}</p>
                  </div>
                  {column.required && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      Required
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Columns */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Optional Columns (Recommended)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Phone Number', benefit: 'Better contact and validation' },
              { name: 'Source', benefit: 'Acquisition channel analysis' },
              { name: 'Lifecycle Stage', benefit: 'Stage-based segmentation' },
              { name: 'ZIP Code', benefit: 'Geographic analysis' },
              { name: 'Sales Status', benefit: 'Pipeline control' },
              { name: 'Lead Score', benefit: 'Lead prioritization' }
            ].map((column, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <span className="font-medium text-gray-900">{column.name}</span>
                  <p className="text-sm text-gray-600">{column.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Mode Benefits */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">✨ Selected Mode Benefits</h3>
          <div className="text-sm text-blue-700">
            {processingMode === 'clean' && (
              <div className="space-y-2">
                <p className="font-medium">Mode: Clean Only</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Automatic standardization of names and companies</li>
                  <li>Consistent phone number formatting</li>
                  <li>Removal of extra spaces and special characters</li>
                  <li>Fast processing without AI costs</li>
                </ul>
              </div>
            )}
            {processingMode === 'enrich' && (
              <div className="space-y-2">
                <p className="font-medium">Mode: Clean + Enrichment (Recommended)</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All benefits of basic cleaning</li>
                  <li>Automatic identification of professional specialties</li>
                  <li>Seniority classification (Junior, Senior, C-Level, etc.)</li>
                  <li>Smart analysis based on position and company</li>
                </ul>
              </div>
            )}
            {processingMode === 'advanced' && (
              <div className="space-y-2">
                <p className="font-medium">Mode: Advanced Deduplication</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All enrichment benefits</li>
                  <li>AI-powered duplicate detection</li>
                  <li>Automatic information consolidation</li>
                  <li>Database optimization for campaigns</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Getting Started Tips */}
      {!isProcessing && !fileName && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 shadow-lg border border-orange-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mr-4">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
              <p className="text-orange-600">Follow these simple steps</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Prepare File',
                description: 'Download the sample and organize your data in the correct CSV format',
                icon: FileText,
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '2',
                title: 'Choose Mode',
                description: 'Select the type of processing ideal for your needs',
                icon: Settings,
                color: 'from-green-500 to-green-600'
              },
              {
                step: '3',
                title: 'Upload',
                description: 'Drag the file and wait for automatic processing',
                icon: Upload,
                color: 'from-purple-500 to-purple-600'
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full text-sm font-bold text-orange-600 border-2 border-orange-200">
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
      )}
    </div>
  );
};

export default UploadPage;
import Papa from 'papaparse';
import { Lead } from '../types/Lead';
import { cleanLeadData } from './dataCleaningService';
import { enrichLead } from './enrichmentService';
import { advancedDeduplicationService } from './advancedDeduplicationService';

export interface CSVParseResult {
  data: Lead[];
  errors: string[];
}

export const parseCSV = (file: File): Promise<CSVParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize header names to match our Lead interface
        const normalizedHeader = header.toLowerCase().trim();
        
        // Map specific headers from the provided format
        if (normalizedHeader === 'full name') {
          return 'nome';
        }
        if (normalizedHeader === 'company') {
          return 'empresa';
        }
        if (normalizedHeader === 'job title') {
          return 'titulo';
        }
        if (normalizedHeader === 'phone number') {
          return 'telefone';
        }
        if (normalizedHeader === 'email') {
          return 'email';
        }
        if (normalizedHeader === 'specialty') {
          return 'especialidade';
        }
        if (normalizedHeader === 'source') {
          return 'source';
        }
        if (normalizedHeader === 'lifecycle stage') {
          return 'lifecycleStage';
        }
        if (normalizedHeader === 'zip code') {
          return 'zipCode';
        }
        if (normalizedHeader === 'sales status') {
          return 'salesStatus';
        }
        
        // Fallback to generic matching for other possible variations
        if (normalizedHeader.includes('nome') || normalizedHeader.includes('name')) {
          return 'nome';
        }
        if (normalizedHeader.includes('empresa') || normalizedHeader.includes('company')) {
          return 'empresa';
        }
        if (normalizedHeader.includes('titulo') || normalizedHeader.includes('cargo') || 
            normalizedHeader.includes('title') || normalizedHeader.includes('position')) {
          return 'titulo';
        }
        if (normalizedHeader.includes('telefone') || normalizedHeader.includes('phone')) {
          return 'telefone';
        }
        if (normalizedHeader.includes('email') || normalizedHeader.includes('e-mail')) {
          return 'email';
        }
        if (normalizedHeader.includes('especialidade') || normalizedHeader.includes('specialty')) {
          return 'especialidade';
        }
        if (normalizedHeader.includes('grau') || normalizedHeader.includes('level') || 
            normalizedHeader.includes('seniority')) {
          return 'grau';
        }
        
        return header;
      },
      complete: (results) => {
        try {
          const leads: Lead[] = results.data
            .filter((row: any) => row.nome && row.nome.trim() !== '')
            .map((row: any, index: number) => ({
              id: `lead-${index + 1}`,
              nome: row.nome || '',
              empresa: row.empresa || '',
              titulo: row.titulo || '',
              telefone: row.telefone || '',
              email: row.email || '',
              especialidade: row.especialidade || '',
              grau: row.grau || '',
              source: row.source || '',
              lifecycleStage: row.lifecycleStage || '',
              zipCode: row.zipCode || '',
              salesStatus: row.salesStatus || '',
              dataSource: 'original' as const,
              enrichmentMethod: 'csv' as const,
              processedAt: new Date().toISOString()
            }));

          const errors: string[] = [];
          
          if (leads.length === 0) {
            errors.push('No valid leads found in the file.');
          }
          
          if (results.errors.length > 0) {
            results.errors.forEach(error => {
              errors.push(`Row ${error.row}: ${error.message}`);
            });
          }

          resolve({ data: leads, errors });
        } catch (error) {
          reject(new Error('Error processing CSV file.'));
        }
      },
      error: (error) => {
        reject(new Error(`Error reading file: ${error.message}`));
      },
    });
  });
};

export const processLeadsCleanOnly = async (
  leads: Lead[],
  onProgress: (progress: number) => void,
  onStatus: (status: string) => void
): Promise<Lead[]> => {
  const totalSteps = leads.length;
  let currentStep = 0;
  
  const processedLeads: Lead[] = [];
  
  onStatus('Starting data cleaning...');
  onProgress(20);
  
  // Clean all leads without enrichment
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    onStatus(`Cleaning lead ${i + 1} of ${leads.length}...`);
    
    const cleanedLead = cleanLeadData(lead);
    // Mark as clean-only processing
    cleanedLead.enrichmentMethod = 'csv-clean-only';
    processedLeads.push(cleanedLead);
    
    currentStep++;
    const progress = 20 + (currentStep / totalSteps) * 70; // 20-90% for cleaning
    onProgress(Math.round(progress));
    
    // Small delay to show progress
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  
  onStatus('Finalizing processing...');
  onProgress(95);
  
  // Final delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  onStatus('Processing completed!');
  onProgress(100);
  
  return processedLeads;
};

export const processLeads = async (
  leads: Lead[],
  onProgress: (progress: number) => void,
  onStatus: (status: string) => void
): Promise<Lead[]> => {
  const totalSteps = leads.length * 2; // Clean + Enrich for each lead
  let currentStep = 0;
  
  const processedLeads: Lead[] = [];
  
  onStatus('Starting data cleaning...');
  onProgress(20);
  
  // Step 1: Clean all leads
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    onStatus(`Cleaning lead ${i + 1} of ${leads.length}...`);
    
    const cleanedLead = cleanLeadData(lead);
    processedLeads.push(cleanedLead);
    
    currentStep++;
    const progress = 20 + (currentStep / totalSteps) * 30; // 20-50% for cleaning
    onProgress(Math.round(progress));
    
    // Small delay to show progress
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  onStatus('Starting AI enrichment...');
  onProgress(50);
  
  // Step 2: Enrich all leads
  for (let i = 0; i < processedLeads.length; i++) {
    const lead = processedLeads[i];
    onStatus(`Enriching lead ${i + 1} of ${processedLeads.length} with AI...`);
    
    try {
      const enrichedLead = await enrichLead(lead);
      processedLeads[i] = enrichedLead;
    } catch (error) {
      console.error(`Error enriching lead ${lead.nome}:`, error);
      // Continue with the cleaned lead if enrichment fails
    }
    
    currentStep++;
    const progress = 50 + (currentStep / totalSteps) * 40; // 50-90% for enrichment
    onProgress(Math.round(progress));
    
    // Small delay to show progress
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  onStatus('Finalizing processing...');
  onProgress(95);
  
  // Final delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  onStatus('Processing completed!');
  onProgress(100);
  
  return processedLeads;
};

export const processLeadsAdvanced = async (
  leads: Lead[],
  onProgress: (progress: number) => void,
  onStatus: (status: string) => void
): Promise<Lead[]> => {
  return await advancedDeduplicationService.processAdvancedDeduplication(leads, onProgress, onStatus);
};

export const exportToCSV = (leads: Lead[], filename: string = 'processed_leads.csv'): void => {
  const csv = Papa.unparse(leads, {
    header: true,
    columns: ['nome', 'empresa', 'titulo', 'telefone', 'email', 'especialidade', 'grau'],
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
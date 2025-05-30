import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead } from '../types/Lead';

interface LeadContextType {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  originalLeads: Lead[];
  setOriginalLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  processingStatus: string;
  setProcessingStatus: React.Dispatch<React.SetStateAction<string>>;
  processingProgress: number;
  setProcessingProgress: React.Dispatch<React.SetStateAction<number>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [originalLeads, setOriginalLeads] = useState<Lead[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  return (
    <LeadContext.Provider
      value={{
        leads,
        setLeads,
        originalLeads,
        setOriginalLeads,
        isProcessing,
        setIsProcessing,
        processingStatus,
        setProcessingStatus,
        processingProgress,
        setProcessingProgress,
        fileName,
        setFileName,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeadContext = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeadContext must be used within a LeadProvider');
  }
  return context;
};
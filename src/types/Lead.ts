export interface Lead {
  id?: string;
  nome: string;
  empresa: string;
  titulo: string;
  telefone: string;
  especialidade?: string;
  grau?: string;
  email?: string;
  // New fields for deduplication and consolidation
  emailSecundario?: string;
  source?: string; // Marketing source (FB Ad, Google, LinkedIn, etc.)
  lifecycleStage?: string; // Lead, Customer, Prospect
  zipCode?: string;
  salesStatus?: string; // Won, Lost
  // Fields for consolidation tracking
  duplicatesFound?: number; // How many duplicates were found
  consolidatedFrom?: string[]; // IDs of records that were consolidated
  // Fields for data source tracking
  dataSource?: 'openai' | 'mock' | 'rules' | 'original' | 'scraping' | 'consolidated';
  enrichmentMethod?: 'domain' | 'csv' | 'csv-clean-only' | 'csv-advanced' | 'manual';
  processedAt?: string;
  [key: string]: string | undefined | number | string[];
}
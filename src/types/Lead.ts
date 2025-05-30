export interface Lead {
  id?: string;
  nome: string;
  empresa: string;
  titulo: string;
  telefone: string;
  especialidade?: string;
  grau?: string;
  email?: string;
  // Novos campos para deduplicação e consolidação
  emailSecundario?: string;
  source?: string; // Fonte de marketing (FB Ad, Google, LinkedIn, etc.)
  lifecycleStage?: string; // Lead, Customer, Prospect
  zipCode?: string;
  salesStatus?: string; // Won, Lost
  // Campos para rastreamento de consolidação
  duplicatesFound?: number; // Quantos duplicados foram encontrados
  consolidatedFrom?: string[]; // IDs dos registros que foram consolidados
  // Campos para rastreamento da fonte dos dados
  dataSource?: 'openai' | 'mock' | 'rules' | 'original' | 'scraping' | 'consolidated';
  enrichmentMethod?: 'domain' | 'csv' | 'csv-clean-only' | 'csv-advanced' | 'manual';
  processedAt?: string;
  [key: string]: string | undefined | number | string[];
}
import { Lead } from '../types/Lead';
import { cleanLeadData } from './dataCleaningService';

interface DuplicateGroup {
  leads: Lead[];
  similarity: number;
}

interface ConsolidationResult {
  consolidated: Lead;
  duplicatesFound: number;
  originalIds: string[];
}

export class AdvancedDeduplicationService {
  /**
   * Identifica e consolida leads duplicados usando fuzzy matching e IA
   */
  async processAdvancedDeduplication(
    leads: Lead[],
    onProgress: (progress: number) => void,
    onStatus: (status: string) => void
  ): Promise<Lead[]> {
    const totalSteps = leads.length + 100; // Estimativa para progress
    let currentStep = 0;

    onStatus('Starting advanced duplicate analysis...');
    onProgress(10);

    // 1. Identify duplicate groups
    onStatus('Identifying possible duplicates...');
    const duplicateGroups = this.findDuplicateGroups(leads);
    
    currentStep += 30;
    onProgress(Math.round((currentStep / totalSteps) * 100));

    // 2. Consolidate each group using AI
    const consolidatedLeads: Lead[] = [];
    const processedIds = new Set<string>();

    onStatus('Consolidating duplicate data with AI...');
    
    for (let i = 0; i < duplicateGroups.length; i++) {
      const group = duplicateGroups[i];
      
      if (group.leads.length > 1) {
        // Has duplicates - consolidate
        const consolidationResult = await this.consolidateGroup(group);
        consolidatedLeads.push(consolidationResult.consolidated);
        
        // Mark IDs as processed
        group.leads.forEach(lead => {
          if (lead.id) processedIds.add(lead.id);
        });
      } else {
        // No duplicates - apply basic cleaning
        const cleanedLead = cleanLeadData({
          ...group.leads[0],
          enrichmentMethod: 'csv-advanced',
          dataSource: 'original',
          duplicatesFound: 0
        });
        consolidatedLeads.push(cleanedLead);
        if (group.leads[0].id) processedIds.add(group.leads[0].id);
      }

      currentStep += 2;
      onProgress(Math.round((currentStep / totalSteps) * 100));
      onStatus(`Processing group ${i + 1} of ${duplicateGroups.length}...`);
    }

    // 3. Add leads that were not processed
    leads.forEach(lead => {
      if (lead.id && !processedIds.has(lead.id)) {
        // Apply basic cleaning even for unique leads
        const cleanedLead = cleanLeadData({
          ...lead,
          enrichmentMethod: 'csv-advanced',
          dataSource: 'original',
          duplicatesFound: 0
        });
        consolidatedLeads.push(cleanedLead);
      }
    });

    onStatus('Finalizing advanced processing...');
    onProgress(95);

    await new Promise(resolve => setTimeout(resolve, 500));

    onStatus('Advanced processing completed!');
    onProgress(100);

    return consolidatedLeads;
  }

  /**
   * Identifica grupos de leads que são potencialmente duplicatos
   */
  private findDuplicateGroups(leads: Lead[]): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processed = new Set<number>();

    for (let i = 0; i < leads.length; i++) {
      if (processed.has(i)) continue;

      const group: Lead[] = [leads[i]];
      processed.add(i);

      // Find duplicates of this lead
      for (let j = i + 1; j < leads.length; j++) {
        if (processed.has(j)) continue;

        const similarity = this.calculateSimilarity(leads[i], leads[j]);
        
        // If similarity > 70%, consider duplicate (reduced to capture more obvious cases)
        if (similarity > 0.70) {
          group.push(leads[j]);
          processed.add(j);
        }
      }

      groups.push({
        leads: group,
        similarity: group.length > 1 ? 0.9 : 0.0
      });
    }

    return groups;
  }

  /**
   * Calcula similaridade entre dois leads
   */
  private calculateSimilarity(lead1: Lead, lead2: Lead): number {
    let totalScore = 0;
    let factors = 0;

    // 1. Similarity of name (weight 40%)
    const nameSimilarity = this.calculateStringSimilarity(
      this.normalizeName(lead1.nome),
      this.normalizeName(lead2.nome)
    );
    totalScore += nameSimilarity * 0.4;
    factors += 0.4;

    // 2. Similarity of company (weight 30%)
    let companySimilarity = 0;
    if (lead1.empresa && lead2.empresa) {
      companySimilarity = this.calculateStringSimilarity(
        this.normalizeCompany(lead1.empresa),
        this.normalizeCompany(lead2.empresa)
      );
      totalScore += companySimilarity * 0.3;
      factors += 0.3;
    }

    // 3. Similarity of phone (weight 20%)
    let phoneSimilarity = 0;
    if (lead1.telefone && lead2.telefone) {
      phoneSimilarity = this.calculatePhoneSimilarity(lead1.telefone, lead2.telefone);
      totalScore += phoneSimilarity * 0.2;
      factors += 0.2;
    }

    // 4. Similarity of email (weight 10%)
    let emailSimilarity = 0;
    if (lead1.email && lead2.email) {
      emailSimilarity = this.calculateEmailSimilarity(lead1.email, lead2.email);
      totalScore += emailSimilarity * 0.1;
      factors += 0.1;
    }

    let finalSimilarity = factors > 0 ? totalScore / factors : 0;

    // 🚀 BOOST: If name + company are almost identical (>90%), give significant boost
    if (nameSimilarity >= 0.9 && companySimilarity >= 0.9) {
      // Special case: name and company very similar = strong evidence of duplicate
      finalSimilarity = Math.max(finalSimilarity, 0.85); // Ensure at least 85%
      
      // If name + company are 100% identical, even greater boost
      if (nameSimilarity >= 0.99 && companySimilarity >= 0.99) {
        finalSimilarity = Math.max(finalSimilarity, 0.90); // Ensure at least 90%
      }
    }

    // 🎯 ADDITIONAL BOOST: If email has same base domain + similar name
    if (nameSimilarity >= 0.9 && emailSimilarity >= 0.6) {
      finalSimilarity = Math.max(finalSimilarity, 0.82); // Ensure at least 82%
    }

    // Debug log for borderline cases (between 70% and 85%)
    if (finalSimilarity > 0.70 && finalSimilarity < 0.85) {
      console.log(`🔍 Similarity borderline (${(finalSimilarity * 100).toFixed(1)}%):`, {
        lead1: { nome: lead1.nome, empresa: lead1.empresa, telefone: lead1.telefone, email: lead1.email },
        lead2: { nome: lead2.nome, empresa: lead2.empresa, telefone: lead2.telefone, email: lead2.email },
        similarity: {
          name: nameSimilarity,
          company: companySimilarity,
          phone: phoneSimilarity,
          email: emailSimilarity
        },
        boosts: {
          nameCompany: nameSimilarity >= 0.9 && companySimilarity >= 0.9,
          nameEmail: nameSimilarity >= 0.9 && emailSimilarity >= 0.6
        }
      });
    }

    return finalSimilarity;
  }

  /**
   * Consolida um grupo de leads duplicados usando IA
   */
  private async consolidateGroup(group: DuplicateGroup): Promise<ConsolidationResult> {
    try {
      // Prepare data for AI
      const leadsData = group.leads.map((lead, index) => ({
        id: index + 1,
        nome: lead.nome,
        empresa: lead.empresa,
        titulo: lead.titulo,
        telefone: lead.telefone,
        email: lead.email,
        especialidade: lead.especialidade,
        source: (lead as any).source || '',
        lifecycleStage: (lead as any).lifecycleStage || '',
        zipCode: (lead as any).zipCode || '',
        salesStatus: (lead as any).salesStatus || ''
      }));

      const prompt = `
You are a data cleaning expert. I need you to consolidate information from duplicate leads into a single more accurate and complete record.

DUPLICATE LEADS DATA:
${JSON.stringify(leadsData, null, 2)}

INSTRUCTIONS:
1. Analyze all records and identify which information is most reliable for each field
2. For NAME: choose the most appropriate formatting (correct capitalization)
3. For COMPANY: choose the most complete and official name
4. For TITLE: choose the most specific and senior position (CEO > Owner > Manager > Doctor > Dentist)
5. For PHONE: choose the most complete format with parentheses
6. For EMAIL: choose the most complete and professional email
7. For SPECIALTY: choose the most complete and standardized description
8. For SOURCE: consolidate all marketing sources

CONSOLIDATION PRIORITY: More complete information > More recent information > More professional formatting

RETURN ONLY A JSON in the following format:
{
"nome": "Correctly Formatted Name",
"empresa": "Official Company Name",
"titulo": "Most Senior Position",
"telefone": "(555) 123-4567",
"email": "main.email@company.com",
"emailSecundario": "secondary.email@company.com",
"especialidade": "Complete Specialty",
"grau": "Seniority Level",
"source": "Consolidated Marketing Sources"
}
`;

      const response = await fetch('http://localhost:3001/api/openai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Failed to consolidate with AI');
      }

      const aiResult = await response.json();
      let consolidatedData;

      try {
        // Try to parse the JSON returned by AI
        const jsonMatch = aiResult.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          consolidatedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON not found in response');
        }
      } catch (parseError) {
        console.warn('AI parse failed, using manual fallback');
        consolidatedData = this.manualConsolidation(group.leads);
      }

      // Create consolidated lead
      const consolidated: Lead = {
        id: `consolidated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nome: consolidatedData.nome || group.leads[0].nome,
        empresa: consolidatedData.empresa || group.leads[0].empresa,
        titulo: consolidatedData.titulo || group.leads[0].titulo,
        telefone: consolidatedData.telefone || group.leads[0].telefone,
        email: consolidatedData.email || group.leads[0].email,
        emailSecundario: consolidatedData.emailSecundario,
        especialidade: consolidatedData.especialidade || group.leads[0].especialidade,
        source: consolidatedData.source,
        lifecycleStage: consolidatedData.lifecycleStage,
        zipCode: consolidatedData.zipCode,
        salesStatus: consolidatedData.salesStatus,
        duplicatesFound: group.leads.length - 1,
        consolidatedFrom: group.leads.map(lead => lead.id || '').filter(id => id),
        dataSource: 'consolidated',
        enrichmentMethod: 'csv-advanced',
        processedAt: new Date().toISOString()
      };

      return {
        consolidated,
        duplicatesFound: group.leads.length - 1,
        originalIds: group.leads.map(lead => lead.id || '').filter(id => id)
      };

    } catch (error) {
      console.error('AI consolidation error:', error);
      // Fallback for manual consolidation
      return this.manualConsolidationFallback(group);
    }
  }

  /**
   * Manual consolidation as fallback
   */
  private manualConsolidation(leads: Lead[]): any {
    // Choose the best information from each field based on simple rules
    const initialValue = {
      nome: leads[0].nome,
      empresa: leads[0].empresa,
      titulo: leads[0].titulo,
      telefone: leads[0].telefone,
      email: leads[0].email || '',
      especialidade: leads[0].especialidade || ''
    };

    const best = leads.slice(1).reduce((best, current) => {
      return {
        nome: this.chooseBestName(best.nome, current.nome),
        empresa: this.chooseBestCompany(best.empresa, current.empresa),
        titulo: this.chooseBestTitle(best.titulo, current.titulo),
        telefone: this.chooseBestPhone(best.telefone, current.telefone),
        email: this.chooseBestEmail(best.email, current.email || ''),
        especialidade: this.chooseBestSpecialty(best.especialidade, current.especialidade || '')
      };
    }, initialValue);

    return best;
  }

  private manualConsolidationFallback(group: DuplicateGroup): ConsolidationResult {
    const leads = group.leads;
    const best = this.manualConsolidation(leads);

    const consolidated: Lead = {
      id: `consolidated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nome: best.nome,
      empresa: best.empresa,
      titulo: best.titulo,
      telefone: best.telefone,
      email: best.email,
      especialidade: best.especialidade,
      duplicatesFound: leads.length - 1,
      consolidatedFrom: leads.map(lead => lead.id || '').filter(id => id),
      dataSource: 'consolidated',
      enrichmentMethod: 'csv-advanced',
      processedAt: new Date().toISOString()
    };

    return {
      consolidated,
      duplicatesFound: leads.length - 1,
      originalIds: leads.map(lead => lead.id || '').filter(id => id)
    };
  }

  // Helper methods for similarity
  private normalizeName(name: string): string {
    return name.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  }

  private normalizeCompany(company: string): string {
    return company.toLowerCase()
      .replace(/\b(llc|inc|corp|ltd|clinic|group|services|practice|care|dental|plus|solutions|solution|consulting|consultoria|company|co|enterprises|enterprise|associates|associate|partners|partnership|center|centre|medical|health|healthcare|studio|studios|lab|labs|laboratory|laboratories)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    // Levenshtein distance simplified
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private calculatePhoneSimilarity(phone1: string, phone2: string): number {
    const clean1 = phone1.replace(/[^0-9]/g, '');
    const clean2 = phone2.replace(/[^0-9]/g, '');
    
    if (clean1 === clean2) return 1.0;
    
    // If both have at least 7 digits
    if (clean1.length >= 7 && clean2.length >= 7) {
      // Compare last 7 digits (local number)
      const last7_1 = clean1.slice(-7);
      const last7_2 = clean2.slice(-7);
      if (last7_1 === last7_2) return 0.9;
      
      // Compare last 4 digits (suffix of number)
      const last4_1 = clean1.slice(-4);
      const last4_2 = clean2.slice(-4);
      if (last4_1 === last4_2) return 0.7;
      
      // Use string similarity for different but similar numbers
      const stringSimilarity = this.calculateStringSimilarity(clean1, clean2);
      if (stringSimilarity > 0.8) return stringSimilarity * 0.6; // Reduce a bit to be conservative
    }
    
    return 0.0;
  }

  private calculateEmailSimilarity(email1: string, email2: string): number {
    const domain1 = email1.split('@')[1]?.toLowerCase();
    const domain2 = email2.split('@')[1]?.toLowerCase();
    
    if (email1.toLowerCase() === email2.toLowerCase()) return 1.0;
    if (domain1 === domain2) return 0.7;
    
    // Check if domains are similar (same base name, different extensions)
    if (domain1 && domain2) {
      const baseDomain1 = domain1.split('.')[0];
      const baseDomain2 = domain2.split('.')[0];
      if (baseDomain1 === baseDomain2) {
        return 0.6; // High similarity for same base domain (ex: company.com vs company.net)
      }
    }
    
    return 0.0;
  }

  // Methods to choose the best information
  private chooseBestName(name1: string, name2: string): string {
    if (!name1) return name2;
    if (!name2) return name1;
    
    // Prefer name with correct capitalization
    const hasProperCase1 = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(name1);
    const hasProperCase2 = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(name2);
    
    if (hasProperCase1 && !hasProperCase2) return name1;
    if (hasProperCase2 && !hasProperCase1) return name2;
    
    // Prefer longer name (more complete)
    return name1.length >= name2.length ? name1 : name2;
  }

  private chooseBestCompany(company1: string, company2: string): string {
    if (!company1) return company2;
    if (!company2) return company1;
    
    // Prefer longer name (more official)
    return company1.length >= company2.length ? company1 : company2;
  }

  private chooseBestTitle(title1: string, title2: string): string {
    if (!title1) return title2;
    if (!title2) return title1;
    
    // Title hierarchy (more senior first)
    const hierarchy = ['ceo', 'owner', 'founder', 'president', 'director', 'manager', 'lead', 'senior', 'doctor', 'dentist'];
    
    const rank1 = hierarchy.findIndex(h => title1.toLowerCase().includes(h));
    const rank2 = hierarchy.findIndex(h => title2.toLowerCase().includes(h));
    
    if (rank1 !== -1 && rank2 !== -1) {
      return rank1 <= rank2 ? title1 : title2;
    }
    
    return title1.length >= title2.length ? title1 : title2;
  }

  private chooseBestPhone(phone1: string, phone2: string): string {
    if (!phone1) return phone2;
    if (!phone2) return phone1;
    
    // Prefer format with parentheses
    if (phone1.includes('(') && phone1.includes(')') && !phone2.includes('(')) {
      return phone1;
    }
    if (phone2.includes('(') && phone2.includes(')') && !phone1.includes('(')) {
      return phone2;
    }
    
    return phone1.length >= phone2.length ? phone1 : phone2;
  }

  private chooseBestEmail(email1: string, email2: string): string {
    if (!email1) return email2;
    if (!email2) return email1;
    
    // Prefer shorter email (generally more official)
    return email1.length <= email2.length ? email1 : email2;
  }

  private chooseBestSpecialty(specialty1: string, specialty2: string): string {
    if (!specialty1) return specialty2;
    if (!specialty2) return specialty1;
    
    // Prefer longer specialty (more descriptive)
    return specialty1.length >= specialty2.length ? specialty1 : specialty2;
  }
}

export const advancedDeduplicationService = new AdvancedDeduplicationService(); 
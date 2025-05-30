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

    onStatus('Iniciando análise avançada de duplicatas...');
    onProgress(10);

    // 1. Identificar grupos de duplicatas
    onStatus('Identificando possíveis duplicatas...');
    const duplicateGroups = this.findDuplicateGroups(leads);
    
    currentStep += 30;
    onProgress(Math.round((currentStep / totalSteps) * 100));

    // 2. Consolidar cada grupo usando IA
    const consolidatedLeads: Lead[] = [];
    const processedIds = new Set<string>();

    onStatus('Consolidando dados duplicados com IA...');
    
    for (let i = 0; i < duplicateGroups.length; i++) {
      const group = duplicateGroups[i];
      
      if (group.leads.length > 1) {
        // Tem duplicatas - consolidar
        const consolidationResult = await this.consolidateGroup(group);
        consolidatedLeads.push(consolidationResult.consolidated);
        
        // Marcar IDs como processados
        group.leads.forEach(lead => {
          if (lead.id) processedIds.add(lead.id);
        });
      } else {
        // Não tem duplicatas - aplicar limpeza básica
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
      onStatus(`Processando grupo ${i + 1} de ${duplicateGroups.length}...`);
    }

    // 3. Adicionar leads não duplicados que não foram processados
    leads.forEach(lead => {
      if (lead.id && !processedIds.has(lead.id)) {
        // Aplicar limpeza básica mesmo para leads únicos
        const cleanedLead = cleanLeadData({
          ...lead,
          enrichmentMethod: 'csv-advanced',
          dataSource: 'original',
          duplicatesFound: 0
        });
        consolidatedLeads.push(cleanedLead);
      }
    });

    onStatus('Finalizando processamento avançado...');
    onProgress(95);

    await new Promise(resolve => setTimeout(resolve, 500));

    onStatus('Processamento avançado concluído!');
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

      // Encontrar duplicatas deste lead
      for (let j = i + 1; j < leads.length; j++) {
        if (processed.has(j)) continue;

        const similarity = this.calculateSimilarity(leads[i], leads[j]);
        
        // Se similaridade > 70%, considera duplicata (reduzido para capturar mais casos óbvios)
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

    // 1. Similaridade do nome (peso 40%)
    const nameSimilarity = this.calculateStringSimilarity(
      this.normalizeName(lead1.nome),
      this.normalizeName(lead2.nome)
    );
    totalScore += nameSimilarity * 0.4;
    factors += 0.4;

    // 2. Similaridade da empresa (peso 30%)
    let companySimilarity = 0;
    if (lead1.empresa && lead2.empresa) {
      companySimilarity = this.calculateStringSimilarity(
        this.normalizeCompany(lead1.empresa),
        this.normalizeCompany(lead2.empresa)
      );
      totalScore += companySimilarity * 0.3;
      factors += 0.3;
    }

    // 3. Similaridade do telefone (peso 20%)
    let phoneSimilarity = 0;
    if (lead1.telefone && lead2.telefone) {
      phoneSimilarity = this.calculatePhoneSimilarity(lead1.telefone, lead2.telefone);
      totalScore += phoneSimilarity * 0.2;
      factors += 0.2;
    }

    // 4. Similaridade do email (peso 10%)
    let emailSimilarity = 0;
    if (lead1.email && lead2.email) {
      emailSimilarity = this.calculateEmailSimilarity(lead1.email, lead2.email);
      totalScore += emailSimilarity * 0.1;
      factors += 0.1;
    }

    let finalSimilarity = factors > 0 ? totalScore / factors : 0;

    // 🚀 BOOST: Se nome + empresa são quase idênticos (>90%), dar boost significativo
    if (nameSimilarity >= 0.9 && companySimilarity >= 0.9) {
      // Caso especial: nome e empresa muito similares = forte evidência de duplicata
      finalSimilarity = Math.max(finalSimilarity, 0.85); // Garantir pelo menos 85%
      
      // Se nome + empresa são 100% idênticos, boost ainda maior
      if (nameSimilarity >= 0.99 && companySimilarity >= 0.99) {
        finalSimilarity = Math.max(finalSimilarity, 0.90); // Garantir pelo menos 90%
      }
    }

    // 🎯 BOOST adicional: Se email tem mesmo domínio base + nome similar
    if (nameSimilarity >= 0.9 && emailSimilarity >= 0.6) {
      finalSimilarity = Math.max(finalSimilarity, 0.82); // Garantir pelo menos 82%
    }

    // Debug log para casos limítrofes (entre 70% e 85%)
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
      // Preparar dados para IA
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
Você é um especialista em limpeza de dados. Preciso que consolide informações de leads duplicados em um único registro mais preciso e completo.

DADOS DOS LEADS DUPLICADOS:
${JSON.stringify(leadsData, null, 2)}

INSTRUÇÕES:
1. Analise todos os registros e identifique qual informação é mais confiável para cada campo
2. Para NOME: escolha a formatação mais adequada (capitalização correta)
3. Para EMPRESA: escolha o nome mais completo e oficial
4. Para TÍTULO: escolha o cargo mais específico e senior (CEO > Owner > Manager > Doctor > Dentist)
5. Para TELEFONE: escolha o formato mais completo com parênteses
6. Para EMAIL: escolha o email principal (mais oficial) e secundário se houver
7. Para ESPECIALIDADE: escolha a descrição mais completa e padronizada
8. Para SOURCE: consolide todas as fontes de marketing
9. Para LIFECYCLE STAGE: priorize Customer > Lead > Prospect
10. Para SALES STATUS: priorize Won > Lost

RETORNE APENAS UM JSON no seguinte formato:
{
  "nome": "Nome Formatado Corretamente",
  "empresa": "Nome Oficial da Empresa",
  "titulo": "Cargo Mais Senior",
  "telefone": "(555) 123-4567",
  "email": "email.principal@empresa.com",
  "emailSecundario": "email.secundario@empresa.com",
  "especialidade": "Especialidade Completa",
  "source": "FB Ad, Google, LinkedIn",
  "lifecycleStage": "Customer",
  "zipCode": "12345",
  "salesStatus": "Won"
}`;

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
        throw new Error('Falha na consolidação com IA');
      }

      const aiResult = await response.json();
      let consolidatedData;

      try {
        // Tentar fazer parse do JSON retornado pela IA
        const jsonMatch = aiResult.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          consolidatedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        console.warn('Falha no parse da IA, usando fallback manual');
        consolidatedData = this.manualConsolidation(group.leads);
      }

      // Criar lead consolidado
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
      console.error('Erro na consolidação com IA:', error);
      // Fallback para consolidação manual
      return this.manualConsolidationFallback(group);
    }
  }

  /**
   * Consolidação manual como fallback
   */
  private manualConsolidation(leads: Lead[]): any {
    // Escolher a melhor informação de cada campo baseado em regras simples
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

  // Métodos auxiliares de similaridade
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
    // Levenshtein distance simplificado
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
    
    // Se ambos têm pelo menos 7 dígitos
    if (clean1.length >= 7 && clean2.length >= 7) {
      // Comparar últimos 7 dígitos (número local)
      const last7_1 = clean1.slice(-7);
      const last7_2 = clean2.slice(-7);
      if (last7_1 === last7_2) return 0.9;
      
      // Comparar últimos 4 dígitos (sufixo do número)
      const last4_1 = clean1.slice(-4);
      const last4_2 = clean2.slice(-4);
      if (last4_1 === last4_2) return 0.7;
      
      // Usar similaridade de string para números diferentes mas similares
      const stringSimilarity = this.calculateStringSimilarity(clean1, clean2);
      if (stringSimilarity > 0.8) return stringSimilarity * 0.6; // Reduzir um pouco para ser conservador
    }
    
    return 0.0;
  }

  private calculateEmailSimilarity(email1: string, email2: string): number {
    const domain1 = email1.split('@')[1]?.toLowerCase();
    const domain2 = email2.split('@')[1]?.toLowerCase();
    
    if (email1.toLowerCase() === email2.toLowerCase()) return 1.0;
    if (domain1 === domain2) return 0.7;
    
    // Verificar se os domínios são similares (mesmo nome base, diferentes extensões)
    if (domain1 && domain2) {
      const baseDomain1 = domain1.split('.')[0];
      const baseDomain2 = domain2.split('.')[0];
      if (baseDomain1 === baseDomain2) {
        return 0.6; // Similaridade alta para mesmo domínio base (ex: company.com vs company.net)
      }
    }
    
    return 0.0;
  }

  // Métodos para escolher melhor informação
  private chooseBestName(name1: string, name2: string): string {
    if (!name1) return name2;
    if (!name2) return name1;
    
    // Prefere nome com capitalização correta
    const hasProperCase1 = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(name1);
    const hasProperCase2 = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(name2);
    
    if (hasProperCase1 && !hasProperCase2) return name1;
    if (hasProperCase2 && !hasProperCase1) return name2;
    
    // Prefere nome mais longo (mais completo)
    return name1.length >= name2.length ? name1 : name2;
  }

  private chooseBestCompany(company1: string, company2: string): string {
    if (!company1) return company2;
    if (!company2) return company1;
    
    // Prefere nome mais longo (mais oficial)
    return company1.length >= company2.length ? company1 : company2;
  }

  private chooseBestTitle(title1: string, title2: string): string {
    if (!title1) return title2;
    if (!title2) return title1;
    
    // Hierarquia de títulos (mais senior primeiro)
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
    
    // Prefere formato com parênteses
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
    
    // Prefere email mais curto (geralmente mais oficial)
    return email1.length <= email2.length ? email1 : email2;
  }

  private chooseBestSpecialty(specialty1: string, specialty2: string): string {
    if (!specialty1) return specialty2;
    if (!specialty2) return specialty1;
    
    // Prefere especialidade mais longa (mais descritiva)
    return specialty1.length >= specialty2.length ? specialty1 : specialty2;
  }
}

export const advancedDeduplicationService = new AdvancedDeduplicationService(); 
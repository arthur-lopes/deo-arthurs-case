const axios = require('axios');

class ExternalApiService {
  constructor() {
    this.hunterApiKey = process.env.HUNTER_API_KEY;
    this.apolloApiKey = process.env.APOLLO_API_KEY;
    this.clearbitApiKey = process.env.CLEARBIT_API_KEY;
  }

  async enrichDomain(domain) {
    console.log(`🔌 Starting external API enrichment for: ${domain}`);

    let result = null;
    let source = 'unknown';

    // Try Hunter.io first
    if (!result && this.hunterApiKey) {
      try {
        console.log(`🎯 Trying Hunter.io for: ${domain}`);
        result = await this.tryHunterApi(domain);
        if (result.success && result.leads.length > 0) {
          source = 'hunter';
          console.log(`✅ Hunter.io found ${result.leads.length} leads for: ${domain}`);
        } else {
          result = null;
        }
      } catch (error) {
        console.log(`❌ Hunter.io failed for ${domain}:`, error.message);
      }
    }

    // Try Apollo.io if Hunter failed
    if (!result && this.apolloApiKey) {
      try {
        console.log(`🚀 Trying Apollo.io for: ${domain}`);
        result = await this.tryApolloApi(domain);
        if (result.success && result.leads.length > 0) {
          source = 'apollo';
          console.log(`✅ Apollo.io found ${result.leads.length} leads for: ${domain}`);
        } else {
          result = null;
        }
      } catch (error) {
        console.log(`❌ Apollo.io failed for ${domain}:`, error.message);
      }
    }

    // Try Clearbit if others failed
    if (!result && this.clearbitApiKey) {
      try {
        console.log(`🔍 Trying Clearbit for: ${domain}`);
        result = await this.tryClearbitApi(domain);
        if (result.success && result.leads.length > 0) {
          source = 'clearbit';
          console.log(`✅ Clearbit found ${result.leads.length} leads for: ${domain}`);
        } else {
          result = null;
        }
      } catch (error) {
        console.log(`❌ Clearbit failed for ${domain}:`, error.message);
      }
    }

    if (!result) {
      console.log(`ℹ️ No external APIs configured or found data for: ${domain}`);
      return {
        success: false,
        leads: [],
        error: 'No external APIs configured or no data found',
        source: 'external'
      };
    }

    return {
      ...result,
      source: `external-${source}`
    };
  }

  async tryHunterApi(domain) {
    try {
      // Hunter.io Domain Search API
      const response = await axios.get('https://api.hunter.io/v2/domain-search', {
        params: {
          domain: domain,
          api_key: this.hunterApiKey,
          limit: 10
        },
        timeout: 10000
      });

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Hunter.io');
      }

      const data = response.data.data;
      const companyInfo = {
        name: data.organization || this.extractCompanyName(domain),
        description: `Company found via Hunter.io`,
        industry: data.industry || 'Unknown',
        size: this.mapEmployeeCount(data.employee_count),
        location: data.country || 'Unknown'
      };

      const leads = (data.emails || []).map((email, index) => ({
        id: `hunter-lead-${index + 1}`,
        nome: `${email.first_name || ''} ${email.last_name || ''}`.trim() || 'Contact Person',
        empresa: companyInfo.name,
        titulo: email.position || 'Unknown',
        telefone: '',
        email: email.value || '',
        especialidade: this.mapDepartment(email.department),
        grau: this.mapSeniority(email.seniority),
        dataSource: 'external',
        enrichmentMethod: 'domain',
        processedAt: new Date().toISOString()
      }));

      return {
        success: leads.length > 0,
        companyInfo,
        leads
      };

    } catch (error) {
      console.error('Hunter.io API error:', error.message);
      throw error;
    }
  }

  async tryApolloApi(domain) {
    try {
      // Apollo.io Organizations Search
      const response = await axios.post('https://api.apollo.io/v1/organizations/search', {
        q_organization_domains: domain,
        page: 1,
        per_page: 1
      }, {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'X-Api-Key': this.apolloApiKey
        },
        timeout: 10000
      });

      if (!response.data || !response.data.organizations || response.data.organizations.length === 0) {
        throw new Error('No organization found in Apollo.io');
      }

      const org = response.data.organizations[0];
      
      // Get people from the organization
      const peopleResponse = await axios.post('https://api.apollo.io/v1/mixed_people/search', {
        q_organization_domains: domain,
        page: 1,
        per_page: 10,
        person_titles: ['CEO', 'CTO', 'CFO', 'President', 'Founder', 'Director', 'Manager']
      }, {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'X-Api-Key': this.apolloApiKey
        },
        timeout: 10000
      });

      const companyInfo = {
        name: org.name || this.extractCompanyName(domain),
        description: org.short_description || 'Company found via Apollo.io',
        industry: org.industry || 'Unknown',
        size: this.mapEmployeeCount(org.estimated_num_employees),
        location: `${org.city || ''}, ${org.state || ''}, ${org.country || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Unknown'
      };

      const people = peopleResponse.data?.people || [];
      const leads = people
        .filter(person => person.first_name || person.last_name || person.email) // Only real people
        .map((person, index) => ({
          id: `apollo-lead-${index + 1}`,
          nome: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
          empresa: companyInfo.name,
          titulo: person.title || '',
          telefone: person.sanitized_phone || '',
          email: person.email || '',
          especialidade: this.mapIndustryToSpecialty(org.industry),
          grau: this.mapTitleToGrade(person.title),
          dataSource: 'external',
          enrichmentMethod: 'domain',
          processedAt: new Date().toISOString()
        }));

      return {
        success: leads.length > 0,
        companyInfo,
        leads
      };

    } catch (error) {
      console.error('Apollo.io API error:', error.message);
      throw error;
    }
  }

  async tryClearbitApi(domain) {
    try {
      // Clearbit Company API
      const response = await axios.get(`https://company.clearbit.com/v2/companies/find`, {
        params: {
          domain: domain
        },
        headers: {
          'Authorization': `Bearer ${this.clearbitApiKey}`
        },
        timeout: 10000
      });

      if (!response.data) {
        throw new Error('No company found in Clearbit');
      }

      const company = response.data;
      
      const companyInfo = {
        name: company.name || this.extractCompanyName(domain),
        description: company.description || 'Company found via Clearbit',
        industry: company.category?.industry || 'Unknown',
        size: this.mapEmployeeCount(company.metrics?.employees),
        location: `${company.geo?.city || ''}, ${company.geo?.state || ''}, ${company.geo?.country || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Unknown'
      };

      // Clearbit doesn't provide individual contacts in the free tier
      // Return empty leads since we don't have real contact data
      const leads = [];

      return {
        success: false, // No real contact data available
        companyInfo,
        leads,
        error: 'No individual contact data available from Clearbit'
      };

    } catch (error) {
      console.error('Clearbit API error:', error.message);
      throw error;
    }
  }

  // Helper methods
  extractCompanyName(domain) {
    const parts = domain.split('.');
    if (parts.length > 0) {
      let companyName = parts[0];
      companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
      return companyName;
    }
    return domain;
  }

  mapEmployeeCount(count) {
    if (!count) return 'Unknown';
    if (count < 50) return 'Small';
    if (count < 500) return 'Medium';
    return 'Large';
  }

  mapDepartment(department) {
    const mapping = {
      'engineering': 'Technology',
      'sales': 'Sales',
      'marketing': 'Marketing',
      'hr': 'Human Resources',
      'finance': 'Finance',
      'operations': 'Operations'
    };
    return mapping[department?.toLowerCase()] || 'General';
  }

  mapSeniority(seniority) {
    const mapping = {
      'senior': 'Senior',
      'junior': 'Junior',
      'manager': 'Manager',
      'director': 'Director',
      'vp': 'C-Level',
      'c-level': 'C-Level'
    };
    return mapping[seniority?.toLowerCase()] || 'Associate';
  }

  mapIndustryToSpecialty(industry) {
    if (!industry) return 'General';
    
    const mapping = {
      'technology': 'Technology',
      'software': 'Technology',
      'healthcare': 'Healthcare',
      'finance': 'Finance',
      'education': 'Education',
      'retail': 'Retail',
      'manufacturing': 'Manufacturing'
    };
    
    return mapping[industry.toLowerCase()] || 'General';
  }

  mapTitleToGrade(title) {
    if (!title) return 'Associate';
    
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('ceo') || titleLower.includes('president') || titleLower.includes('founder')) {
      return 'C-Level';
    }
    if (titleLower.includes('director') || titleLower.includes('vp')) {
      return 'Director';
    }
    if (titleLower.includes('manager') || titleLower.includes('lead')) {
      return 'Manager';
    }
    if (titleLower.includes('senior')) {
      return 'Senior';
    }
    
    return 'Associate';
  }
}

module.exports = new ExternalApiService(); 
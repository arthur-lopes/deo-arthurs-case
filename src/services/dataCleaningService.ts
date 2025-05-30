import { Lead } from '../types/Lead';

export const cleanLeadData = (lead: Lead): Lead => {
  const cleanedLead = { ...lead };
  
  // Clean Name: Capitalize properly (e.g., "maria da silva" -> "Maria da Silva")
  if (cleanedLead.nome) {
    cleanedLead.nome = capitalizeProperName(cleanedLead.nome.trim());
  }
  
  // Clean Company: Proper capitalization keeping abbreviations
  if (cleanedLead.empresa) {
    cleanedLead.empresa = capitalizeCompanyName(cleanedLead.empresa.trim());
  }
  
  // Clean Title: Properly capitalize title/position
  if (cleanedLead.titulo) {
    cleanedLead.titulo = capitalizeTitle(cleanedLead.titulo.trim());
  }
  
  // Clean Phone: Format to standard format
  if (cleanedLead.telefone) {
    cleanedLead.telefone = formatPhoneNumber(cleanedLead.telefone.trim());
  }
  
  // Clean Specialty: Capitalize properly if it exists
  if (cleanedLead.especialidade) {
    cleanedLead.especialidade = capitalizeFirstLetter(cleanedLead.especialidade.trim());
  }
  
  return cleanedLead;
};

// Helper functions for text processing

function capitalizeProperName(name: string): string {
  // Skip if empty
  if (!name) return name;
  
  // Handle cases like "da", "de", "dos", etc.
  const minorWords = ['da', 'de', 'do', 'das', 'dos', 'e'];
  
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index > 0 && minorWords.includes(word)) {
        return word;
      }
      return capitalizeFirstLetter(word);
    })
    .join(' ');
}

function capitalizeCompanyName(company: string): string {
  // Skip if empty
  if (!company) return company;
  
  // Special case for common abbreviations to keep uppercase
  const abbreviations = ['s/a', 'sa', 's.a.', 's.a', 'ltda', 'me', 'mei', 'eireli'];
  
  return company
    .split(' ')
    .map(word => {
      const lowerWord = word.toLowerCase();
      // If it's a common abbreviation, make it uppercase
      if (abbreviations.includes(lowerWord)) {
        return word.toUpperCase();
      }
      return capitalizeFirstLetter(word);
    })
    .join(' ');
}

function capitalizeTitle(title: string): string {
  // Skip if empty
  if (!title) return title;
  
  // Words that should remain lowercase in titles
  const minorWords = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'para'];
  
  // Normalize common abbreviations
  const titleNormalized = title
    .toLowerCase()
    .replace(/\bjr\b/i, 'Júnior')
    .replace(/\bsr\b/i, 'Sênior')
    .replace(/\bmgr\b/i, 'Gerente');
  
  return titleNormalized
    .split(' ')
    .map((word, index) => {
      if (index > 0 && minorWords.includes(word)) {
        return word;
      }
      return capitalizeFirstLetter(word);
    })
    .join(' ');
}

function formatPhoneNumber(phone: string): string {
  // Remove any non-numeric characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If empty or too short to be valid, return as is
  if (!digitsOnly || digitsOnly.length < 8) return phone;
  
  // Assume Brazilian number if it starts with certain patterns
  if (digitsOnly.startsWith('55') || digitsOnly.length === 11 || digitsOnly.length === 10) {
    // Handle Brazilian format: +55 (XX) XXXXX-XXXX or +55 (XX) XXXX-XXXX
    if (digitsOnly.startsWith('55') && digitsOnly.length >= 12) {
      // Already has country code
      const areaCode = digitsOnly.substring(2, 4);
      const restOfNumber = digitsOnly.substring(4);
      
      if (restOfNumber.length === 9) {
        // Mobile (9 digits)
        return `+55 ${areaCode} ${restOfNumber.substring(0, 5)}-${restOfNumber.substring(5)}`;
      } else {
        // Landline (8 digits)
        return `+55 ${areaCode} ${restOfNumber.substring(0, 4)}-${restOfNumber.substring(4)}`;
      }
    } else if (digitsOnly.length === 11) {
      // Mobile without country code: (XX) XXXXX-XXXX
      const areaCode = digitsOnly.substring(0, 2);
      const restOfNumber = digitsOnly.substring(2);
      return `+55 ${areaCode} ${restOfNumber.substring(0, 5)}-${restOfNumber.substring(5)}`;
    } else if (digitsOnly.length === 10) {
      // Landline without country code: (XX) XXXX-XXXX
      const areaCode = digitsOnly.substring(0, 2);
      const restOfNumber = digitsOnly.substring(2);
      return `+55 ${areaCode} ${restOfNumber.substring(0, 4)}-${restOfNumber.substring(4)}`;
    }
  }
  
  // For international numbers, use E.164 format: +[country code] [number]
  // This is a simple implementation - in a real app, we might want to use a library
  // like libphonenumber-js for more sophisticated phone number parsing
  if (digitsOnly.length > 7) {
    // Try to format as international if it doesn't match Brazilian patterns
    return `+${digitsOnly}`;
  }
  
  // If we can't determine the format, return the original
  return phone;
}

function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
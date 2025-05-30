import React, { useState } from 'react';
import { Lead } from '../types/Lead';
import { Filter, X, ChevronDown } from 'lucide-react';

interface AdvancedFiltersProps {
  leads: Lead[];
  onFilterChange: (filteredLeads: Lead[]) => void;
}

const AdvancedFilters = ({ leads, onFilterChange }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    especialidade: '',
    grau: '',
    empresa: '',
    hasPhone: false,
    hasEmail: false,
  });

  // Get unique values for dropdowns
  const uniqueSpecialties = [...new Set(leads.map(lead => lead.especialidade).filter(Boolean))];
  const uniqueGrades = [...new Set(leads.map(lead => lead.grau).filter(Boolean))];
  const uniqueCompanies = [...new Set(leads.map(lead => lead.empresa).filter(Boolean))];

  const applyFilters = (newFilters: typeof filters) => {
    let filtered = leads;

    if (newFilters.especialidade) {
      filtered = filtered.filter(lead => lead.especialidade === newFilters.especialidade);
    }

    if (newFilters.grau) {
      filtered = filtered.filter(lead => lead.grau === newFilters.grau);
    }

    if (newFilters.empresa) {
      filtered = filtered.filter(lead => lead.empresa === newFilters.empresa);
    }

    if (newFilters.hasPhone) {
      filtered = filtered.filter(lead => lead.telefone && lead.telefone.trim() !== '');
    }

    if (newFilters.hasEmail) {
      filtered = filtered.filter(lead => lead.email && lead.email.trim() !== '');
    }

    onFilterChange(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      especialidade: '',
      grau: '',
      empresa: '',
      hasPhone: false,
      hasEmail: false,
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  );

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span className="font-medium">Filtros Avançados</span>
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Ativo
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidade
            </label>
            <select
              value={filters.especialidade}
              onChange={(e) => handleFilterChange('especialidade', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Todas</option>
              {uniqueSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grau
            </label>
            <select
              value={filters.grau}
              onChange={(e) => handleFilterChange('grau', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Todos</option>
              {uniqueGrades.map(grade => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <select
              value={filters.empresa}
              onChange={(e) => handleFilterChange('empresa', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Todas</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Info Filters */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informações de Contato
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasPhone}
                  onChange={(e) => handleFilterChange('hasPhone', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Tem telefone</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasEmail}
                  onChange={(e) => handleFilterChange('hasEmail', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Tem email</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 
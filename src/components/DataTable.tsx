import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Download } from 'lucide-react';
import { Lead } from '../types/Lead';
import { cn } from '../utils/cn';
import { exportToCSV } from '../services/csvService';
import AdvancedFilters from './AdvancedFilters';
import DataSourceIndicator from './DataSourceIndicator';

interface DataTableProps {
  data: Lead[];
  fileName?: string;
}

const DataTable = ({ data, fileName = 'leads_enriquecidos.csv' }: DataTableProps) => {
  const [sortField, setSortField] = useState<keyof Lead>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<Lead[]>(data);
  const rowsPerPage = 10;

  // Handle column sort
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle filter change from AdvancedFilters
  const handleFilterChange = (newFilteredData: Lead[]) => {
    setFilteredData(newFilteredData);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Apply search to filtered data
  const searchFilteredData = filteredData.filter((lead) => {
    const searchFields = ['nome', 'empresa', 'titulo', 'email', 'especialidade', 'grau'];
    return searchFields.some((field) => {
      const value = lead[field];
      return value && value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...searchFilteredData].sort((a, b) => {
    const valueA = a[sortField] || '';
    const valueB = b[sortField] || '';
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  // Handle download - use original data or filtered data
  const handleDownload = () => {
    exportToCSV(filteredData, fileName);
  };

  // Reset filtered data when original data changes
  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="space-y-4">
      <AdvancedFilters leads={data} onFilterChange={handleFilterChange} />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="input pl-10 w-full sm:w-64"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {searchFilteredData.length} de {data.length} leads
          </span>
          <button
            onClick={handleDownload}
            className="btn btn-primary py-2 px-4"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar CSV
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['nome', 'empresa', 'titulo', 'email', 'telefone', 'especialidade', 'grau', 'fonte'].map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => field !== 'fonte' && handleSort(field as keyof Lead)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {field === 'titulo' ? 'Cargo' : 
                         field === 'fonte' ? 'Fonte' : 
                         field === 'email' ? 'E-mail' :
                         capitalizeFirstLetter(field)}
                      </span>
                      {sortField === field && field !== 'fonte' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((lead, index) => (
                  <tr key={lead.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.empresa}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.email ? (
                        <a 
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Sem e-mail</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.telefone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        lead.especialidade ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      )}>
                        {lead.especialidade || 'Não definido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        lead.grau ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      )}>
                        {lead.grau || 'Não definido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DataSourceIndicator 
                        source={
                          lead.dataSource === 'original' ? 'original' :
                          lead.dataSource === 'openai' ? 'openai' :
                          lead.dataSource === 'mock' ? 'mock' :
                          lead.dataSource === 'scraping' ? 'scraping' :
                          'rules'
                        } 
                        size="sm" 
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum dado disponível'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline py-2 px-4 text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline py-2 px-4 text-sm disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + rowsPerPage, searchFilteredData.length)}
                  </span>{' '}
                  de <span className="font-medium">{searchFilteredData.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline py-2 px-3 text-sm disabled:opacity-50 rounded-l-md"
                  >
                    Anterior
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "relative inline-flex items-center px-4 py-2 text-sm font-medium",
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline py-2 px-3 text-sm disabled:opacity-50 rounded-r-md"
                  >
                    Próximo
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default DataTable;
import React from 'react';
import { Lead } from '../types/Lead';
import { Users, Building, Briefcase, Award } from 'lucide-react';

interface DataSummaryProps {
  leads: Lead[];
}

const DataSummary = ({ leads }: DataSummaryProps) => {
  // Calculate statistics
  const totalLeads = leads.length;
  const uniqueCompanies = new Set(leads.map(lead => lead.empresa.toLowerCase())).size;
  const enrichedLeads = leads.filter(lead => lead.especialidade && lead.grau).length;
  const enrichmentRate = totalLeads > 0 ? Math.round((enrichedLeads / totalLeads) * 100) : 0;

  // Specialty distribution
  const specialtyCount = leads.reduce((acc, lead) => {
    const specialty = lead.especialidade || 'Não definido';
    acc[specialty] = (acc[specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Seniority distribution
  const seniorityCount = leads.reduce((acc, lead) => {
    const seniority = lead.grau || 'Não definido';
    acc[seniority] = (acc[seniority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSpecialties = Object.entries(specialtyCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topSeniorities = Object.entries(seniorityCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Resumo dos Dados</h2>
      
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
              <p className="text-sm text-gray-600">Total de Leads</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-600">{uniqueCompanies}</p>
              <p className="text-sm text-gray-600">Empresas Únicas</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-purple-600">{enrichedLeads}</p>
              <p className="text-sm text-gray-600">Leads Enriquecidos</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-orange-600">{enrichmentRate}%</p>
              <p className="text-sm text-gray-600">Taxa de Enriquecimento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specialty Distribution */}
        <div>
          <h3 className="text-lg font-medium mb-3">Top Especialidades</h3>
          <div className="space-y-2">
            {topSpecialties.map(([specialty, count]) => {
              const percentage = Math.round((count / totalLeads) * 100);
              return (
                <div key={specialty} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex-1 mr-2">
                    {specialty}
                  </span>
                  <div className="flex items-center flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seniority Distribution */}
        <div>
          <h3 className="text-lg font-medium mb-3">Top Níveis de Senioridade</h3>
          <div className="space-y-2">
            {topSeniorities.map(([seniority, count]) => {
              const percentage = Math.round((count / totalLeads) * 100);
              return (
                <div key={seniority} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex-1 mr-2">
                    {seniority}
                  </span>
                  <div className="flex items-center flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSummary; 
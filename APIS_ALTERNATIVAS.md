# 🔌 APIs Alternativas para Enriquecimento de Dados

Este documento descreve as APIs externas disponíveis para enriquecimento de dados quando a OpenAI não consegue encontrar informações suficientes.

## 🔄 Fluxo de Fallback

O sistema utiliza uma estratégia de fallback em cascata:

1. **OpenAI GPT-4** - Análise direta do domínio
2. **Web Scraping Real** - Extração de HTML + análise OpenAI
3. **APIs Externas** - Múltiplas fontes de dados B2B
4. **SerpAPI** - Google Search + análise OpenAI
5. **Dados Mock** - Último recurso

## 📊 APIs Suportadas

### 1. Hunter.io - Email Finder
**Especialidade:** Encontrar emails e informações de contato

- **Preço:** $49-399/mês
- **Tier Gratuito:** 25 buscas/mês
- **Website:** https://hunter.io/api
- **Configuração:** `VITE_HUNTER_API_KEY`

**Funcionalidades:**
- Busca de emails por domínio
- Informações da empresa
- Verificação de emails
- Dados de contato dos funcionários

### 2. Apollo.io - B2B Database
**Especialidade:** Base de dados B2B completa

- **Preço:** $49-399/mês
- **Tier Gratuito:** 50 créditos/mês
- **Website:** https://developer.apollo.io/
- **Configuração:** `VITE_APOLLO_API_KEY`

**Funcionalidades:**
- Busca de empresas por domínio
- Lista de funcionários e cargos
- Informações detalhadas da empresa
- Dados de contato verificados

### 3. Clearbit - Company Enrichment
**Especialidade:** Enriquecimento de dados da empresa

- **Preço:** $99+/mês
- **Tier Gratuito:** 50 requests/mês
- **Website:** https://clearbit.com/docs
- **Configuração:** `VITE_CLEARBIT_API_KEY`

**Funcionalidades:**
- Dados detalhados da empresa
- Informações financeiras
- Tecnologias utilizadas
- Métricas de crescimento

### 4. SerpAPI - Google Search
**Especialidade:** Busca no Google com análise IA

- **Preço:** $50-250/mês
- **Tier Gratuito:** 100 buscas/mês
- **Website:** https://serpapi.com/
- **Configuração:** `VITE_SERPAPI_KEY`

**Funcionalidades:**
- Múltiplas consultas estratégicas
- Busca em LinkedIn e Crunchbase
- Análise dos resultados com OpenAI
- Fallback sem IA usando regex

### 5. ZoomInfo - Premium B2B Data
**Especialidade:** Dados B2B premium (Enterprise)

- **Preço:** Personalizado (Enterprise)
- **Tier Gratuito:** Não disponível
- **Website:** https://www.zoominfo.com/business/api
- **Configuração:** `VITE_ZOOMINFO_API_KEY`

**Status:** Placeholder (implementação específica necessária)

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Adicione as chaves de API no arquivo `.env`:

```env
# APIs Externas (Opcionais)
VITE_HUNTER_API_KEY=your_hunter_api_key_here
VITE_APOLLO_API_KEY=your_apollo_api_key_here
VITE_CLEARBIT_API_KEY=your_clearbit_api_key_here
VITE_SERPAPI_KEY=your_serpapi_key_here
VITE_ZOOMINFO_API_KEY=your_zoominfo_api_key_here
```

### 2. Habilitação das APIs

No arquivo `src/services/externalApiService.ts`, altere `enabled: true` para as APIs que deseja usar:

```typescript
const API_CONFIGS = {
  hunter: {
    enabled: true, // ← Altere para true
    apiKey: import.meta.env.VITE_HUNTER_API_KEY,
    // ...
  },
  // ...
};
```

## 🔍 Estratégias de Busca

### SerpAPI - Consultas Múltiplas

O SerpAPI utiliza diferentes estratégias de busca:

1. **Busca Geral:** `"domain.com" company leadership team contact`
2. **Busca por Executivos:** `"CompanyName" CEO founder executives`
3. **LinkedIn:** `site:linkedin.com/company "CompanyName"`
4. **Crunchbase:** `site:crunchbase.com "CompanyName"`

### Web Scraping - Múltiplas Páginas

O sistema tenta extrair dados de:

1. **Homepage:** `https://domain.com`
2. **About:** `https://domain.com/about`
3. **Team:** `https://domain.com/team`
4. **Contact:** `https://domain.com/contact`

## 📈 Monitoramento

### Status das APIs

Use a função `getApiStatus()` para verificar o status:

```typescript
import { getApiStatus } from './services/externalApiService';

const status = getApiStatus();
console.log('APIs configuradas:', status);
```

### Logs do Sistema

O sistema fornece logs detalhados:

```
🔌 Trying external APIs for: example.com
📋 Configured APIs: Hunter.io, Apollo.io
🔍 Trying Hunter.io...
✅ Hunter.io found 5 leads
```

## 💰 Custos e Limites

| API | Tier Gratuito | Plano Básico | Limite/Mês |
|-----|---------------|--------------|-------------|
| Hunter.io | 25 buscas | $49 | 1,000 buscas |
| Apollo.io | 50 créditos | $49 | 1,000 créditos |
| Clearbit | 50 requests | $99 | 2,500 requests |
| SerpAPI | 100 buscas | $50 | 5,000 buscas |
| ZoomInfo | - | Personalizado | Personalizado |

## 🛡️ Boas Práticas

### Rate Limiting
- Respeite os limites de cada API
- Implemente delays entre requests
- Use cache quando possível

### Qualidade dos Dados
- Sempre valide os dados recebidos
- Prefira dados vazios a dados inventados
- Mantenha transparência sobre a fonte

### Segurança
- Nunca exponha chaves de API no frontend
- Use variáveis de ambiente
- Monitore o uso das APIs

## 🔧 Troubleshooting

### Problemas Comuns

1. **API Key Inválida**
   ```
   Error: 401 Unauthorized
   ```
   - Verifique se a chave está correta
   - Confirme se a API está habilitada

2. **Limite Excedido**
   ```
   Error: 429 Too Many Requests
   ```
   - Aguarde o reset do limite
   - Considere upgrade do plano

3. **Dados Não Encontrados**
   ```
   No data found in [API Name]
   ```
   - Normal para domínios pequenos
   - Sistema continuará com próxima API

### Debug

Para debug detalhado, abra o console do navegador e observe os logs durante o enriquecimento.

## 📝 Próximos Passos

1. **Implementar ZoomInfo** - API enterprise completa
2. **Cache de Resultados** - Evitar requests duplicados
3. **Métricas de Uso** - Dashboard de consumo das APIs
4. **Validação de Dados** - Verificação automática de qualidade
5. **APIs Adicionais** - Integração com outras fontes

## 🤝 Contribuição

Para adicionar novas APIs:

1. Adicione configuração em `API_CONFIGS`
2. Implemente função de integração
3. Adicione ao fluxo de fallback
4. Atualize documentação
5. Teste com dados reais 
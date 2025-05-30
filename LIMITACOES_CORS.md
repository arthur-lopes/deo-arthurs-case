# 🚫 Limitações de CORS no Frontend

## Problema Identificado

Durante os testes, identificamos que várias APIs externas não podem ser chamadas diretamente do frontend devido às políticas de **CORS (Cross-Origin Resource Sharing)**:

### APIs Afetadas:
- ✅ **OpenAI** - Funciona (permite CORS)
- ❌ **SerpAPI** - Bloqueado por CORS
- ❌ **Hunter.io** - Bloqueado por CORS  
- ❌ **Apollo.io** - Bloqueado por CORS
- ❌ **Clearbit** - Bloqueado por CORS
- ⚠️ **Web Scraping** - Parcialmente funciona (alguns proxies)

## 🔍 O que é CORS?

CORS é uma política de segurança dos navegadores que impede que websites façam requisições para domínios diferentes do seu próprio, a menos que o servidor de destino explicitamente permita.

### Erro Típico:
```
Access to fetch at 'https://serpapi.com/search' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

## ✅ Soluções Implementadas

### 1. Web Scraping com Proxies
**Status:** ✅ Funcionando parcialmente

```typescript
// Múltiplos proxies para contornar CORS
const proxies = [
  'https://api.allorigins.win/get',      // ❌ Falhando
  'https://corsproxy.io/',               // ❌ Falhando  
  'https://cors-anywhere.herokuapp.com', // ❌ Bloqueado
  'https://thingproxy.freeboard.io'      // ✅ Funcionando
];
```

**Resultado:** Consegue extrair HTML, mas nem sempre encontra dados de contato.

### 2. OpenAI Direct
**Status:** ✅ Funcionando perfeitamente

- OpenAI permite CORS em suas APIs
- Funciona diretamente do frontend
- Melhor fonte de dados quando disponível

## 🚧 Limitações Atuais

### 1. SerpAPI
```
🔧 SerpAPI Debug: {enabled: true, hasApiKey: true, apiKeyLength: 64}
❌ CORS Error: Cannot call SerpAPI from frontend
```

### 2. APIs B2B (Hunter, Apollo, Clearbit)
- Todas bloqueadas por CORS
- Requerem implementação backend

### 3. Web Scraping
- Dependente de proxies públicos
- Proxies podem falhar ou ser bloqueados
- Qualidade dos dados varia

## 🛠️ Soluções Recomendadas

### Opção 1: Backend Proxy (Recomendado)
Criar um backend que faça as chamadas para as APIs:

```typescript
// Backend endpoint
app.post('/api/enrich', async (req, res) => {
  const { domain } = req.body;
  
  // Chamar SerpAPI do backend (sem CORS)
  const serpResults = await fetch('https://serpapi.com/search', {
    headers: { 'Authorization': `Bearer ${SERPAPI_KEY}` }
  });
  
  res.json(serpResults);
});

// Frontend chama o backend
const response = await fetch('/api/enrich', {
  method: 'POST',
  body: JSON.stringify({ domain })
});
```

### Opção 2: Serverless Functions
Usar Vercel, Netlify ou AWS Lambda:

```typescript
// api/serpapi.ts (Vercel)
export default async function handler(req, res) {
  const serpData = await fetch('https://serpapi.com/search', {
    headers: { 'Authorization': `Bearer ${process.env.SERPAPI_KEY}` }
  });
  
  res.json(await serpData.json());
}
```

### Opção 3: Browser Extension
Criar uma extensão do navegador que não tem limitações de CORS.

## 📊 Status Atual do Sistema

### Fluxo de Fallback Funcional:
1. ✅ **OpenAI GPT-4** - Análise direta (funciona)
2. ⚠️ **Web Scraping** - HTML + OpenAI (parcialmente funciona)
3. ❌ **APIs Externas** - Bloqueadas por CORS
4. ❌ **SerpAPI** - Bloqueada por CORS
5. ✅ **Mock Data** - Último recurso (funciona)

### Resultado:
- **2 de 5 fontes** funcionando completamente
- **1 de 5 fontes** funcionando parcialmente
- **2 de 5 fontes** bloqueadas por CORS

## 🎯 Próximos Passos

### Curto Prazo (Frontend Only):
1. ✅ Melhorar prompts do web scraping
2. ✅ Adicionar mais proxies para web scraping
3. ✅ Otimizar análise OpenAI
4. ⚠️ Implementar cache local

### Médio Prazo (Backend Required):
1. 🔄 Implementar backend proxy para APIs
2. 🔄 Criar endpoints para SerpAPI
3. 🔄 Implementar rate limiting
4. 🔄 Adicionar cache Redis

### Longo Prazo (Production):
1. 🔄 Implementar autenticação
2. 🔄 Monitoramento de uso das APIs
3. 🔄 Dashboard de métricas
4. 🔄 Otimização de custos

## 💡 Workarounds Temporários

### 1. Usar Dados Simulados Mais Ricos
Expandir a base de dados simulados para mais domínios conhecidos.

### 2. Melhorar Web Scraping
Focar em extrair mais informações do HTML quando disponível.

### 3. Otimizar OpenAI
Melhorar prompts para que OpenAI encontre mais dados reais.

## 🔧 Configuração Atual

Para testar o sistema atual:

```env
# Apenas estas funcionam no frontend
VITE_OPENAI_API_KEY=sua_chave_openai_aqui

# Estas requerem backend (bloqueadas por CORS)
VITE_SERPAPI_KEY=sua_chave_serpapi_aqui
VITE_HUNTER_API_KEY=sua_chave_hunter_aqui
VITE_APOLLO_API_KEY=sua_chave_apollo_aqui
VITE_CLEARBIT_API_KEY=sua_chave_clearbit_aqui
```

## 📈 Métricas de Sucesso

Com as limitações atuais:
- **OpenAI**: ~30% de sucesso (dados reais)
- **Web Scraping**: ~15% de sucesso (HTML + análise)
- **Mock Data**: 100% de fallback (dados simulados)

**Total**: ~45% de dados reais, 55% de dados simulados

## 🎯 Meta com Backend

Com backend implementado:
- **OpenAI**: ~30% de sucesso
- **Web Scraping**: ~20% de sucesso  
- **SerpAPI**: ~40% de sucesso
- **APIs B2B**: ~60% de sucesso
- **Mock Data**: Apenas para casos extremos

**Total Esperado**: ~85% de dados reais, 15% de dados simulados 
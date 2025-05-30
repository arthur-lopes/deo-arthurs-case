# 🚀 Guia de Deploy do Backend DEO

Este guia explica como fazer o deploy do backend em diferentes plataformas, já que não pode mais usar a Vercel.

## 📋 Resumo da Situação

### Por que não Vercel?
- **CORS**: APIs externas bloqueadas no frontend
- **Puppeteer**: Não funciona bem em serverless
- **Funcionalidades**: Precisamos de um servidor Node.js completo

### Solução: Backend Dedicado
- **Node.js/Express**: Servidor completo
- **Puppeteer**: Web scraping real
- **APIs Externas**: Sem limitações CORS
- **Cache**: Sistema inteligente
- **Monitoramento**: Health checks completos

## 🎯 Plataformas Recomendadas

### 1. Railway (Recomendado) ⭐
**Por que escolher:**
- ✅ Deploy automático via Git
- ✅ Suporte nativo ao Node.js + Puppeteer
- ✅ Variáveis de ambiente fáceis
- ✅ Logs em tempo real
- ✅ Preço acessível ($5/mês)

**Como fazer deploy:**
```bash
# 1. Crie conta no Railway.app
# 2. Conecte seu repositório GitHub
# 3. Configure as variáveis de ambiente:
OPENAI_API_KEY=sk-your-key-here
SERPAPI_KEY=your-serpapi-key
HUNTER_API_KEY=your-hunter-key
APOLLO_API_KEY=your-apollo-key
CLEARBIT_API_KEY=your-clearbit-key
FRONTEND_URL=https://your-frontend-domain.com

# 4. Deploy automático!
```

### 2. Render ⭐
**Por que escolher:**
- ✅ Plano gratuito disponível
- ✅ Deploy via Git
- ✅ Suporte a Docker
- ✅ SSL automático

**Como fazer deploy:**
```bash
# 1. Crie conta no Render.com
# 2. Use o arquivo deploy/render.yaml
# 3. Configure as variáveis de ambiente no dashboard
# 4. Deploy automático via Git
```

### 3. DigitalOcean App Platform
**Por que escolher:**
- ✅ Infraestrutura robusta
- ✅ Escalabilidade automática
- ✅ Preço previsível

**Como fazer deploy:**
```bash
# 1. Crie conta no DigitalOcean
# 2. Use o Dockerfile
# 3. Configure via dashboard
# 4. Deploy via Git ou Docker Registry
```

### 4. Heroku
**Por que escolher:**
- ✅ Plataforma madura
- ✅ Muitos add-ons
- ✅ Documentação extensa

**Como fazer deploy:**
```bash
# 1. Instale Heroku CLI
# 2. Configure buildpacks para Puppeteer
heroku buildpacks:add --index 1 https://github.com/jontewks/puppeteer-heroku-buildpack
heroku buildpacks:add --index 2 heroku/nodejs

# 3. Configure variáveis
heroku config:set OPENAI_API_KEY=sk-your-key-here

# 4. Deploy
git push heroku main
```

## ⚙️ Configuração Obrigatória

### Variáveis de Ambiente Mínimas
```env
# Obrigatório
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
NODE_ENV=production

# Frontend (ajuste para seu domínio)
FRONTEND_URL=https://your-frontend-domain.com

# Opcionais (mas recomendadas)
SERPAPI_KEY=your-serpapi-key-here
HUNTER_API_KEY=your-hunter-api-key-here
APOLLO_API_KEY=your-apollo-api-key-here
CLEARBIT_API_KEY=your-clearbit-api-key-here
```

### Configuração do Frontend
Após o deploy do backend, configure o frontend:

```env
# .env do frontend
VITE_BACKEND_URL=https://your-frontend-domain.com
```

## 🔧 Estrutura do Backend

```
backend/
├── server.js              # Servidor principal
├── routes/
│   ├── enrichment.js      # Rotas de enriquecimento
│   └── health.js          # Health checks
├── services/
│   ├── openaiService.js   # Integração OpenAI
│   ├── serpApiService.js  # Integração SerpAPI
│   ├── webScrapingService.js # Web scraping
│   └── externalApiService.js # APIs externas
├── middleware/
│   ├── validation.js      # Validação
│   ├── cache.js          # Sistema de cache
│   └── errorHandler.js   # Tratamento de erros
├── deploy/               # Configurações de deploy
├── Dockerfile           # Container Docker
├── docker-compose.yml   # Desenvolvimento local
└── package.json         # Dependências
```

## 🚀 Processo de Deploy Passo a Passo

### Passo 1: Preparar o Código
```bash
# Clone o repositório
git clone <your-repo>
cd backend

# Teste localmente
npm install
cp env.example .env
# Configure suas chaves de API no .env
npm run dev
```

### Passo 2: Escolher Plataforma
Recomendamos **Railway** para iniciantes ou **Render** para plano gratuito.

### Passo 3: Deploy
```bash
# Railway
1. Conecte GitHub ao Railway
2. Configure variáveis de ambiente
3. Deploy automático

# Render
1. Conecte GitHub ao Render
2. Use deploy/render.yaml
3. Configure variáveis no dashboard
```

### Passo 4: Configurar Frontend
```bash
# Atualize o frontend para usar o backend
# .env do frontend
VITE_BACKEND_URL=https://your-backend-url.com

# Teste a integração
npm run dev
```

### Passo 5: Verificar Funcionamento
```bash
# Health check
curl https://your-backend-url.com/api/health

# Teste de enriquecimento
curl -X POST https://your-backend-url.com/api/enrichment/domain \
  -H "Content-Type: application/json" \
  -d '{"domain": "microsoft.com"}'
```

## 📊 Monitoramento

### Health Checks Disponíveis
```bash
# Status básico
GET /api/health

# Status detalhado
GET /api/health/detailed

# Status das APIs
GET /api/enrichment/status

# Estatísticas do cache
GET /api/cache/stats
```

### Logs Importantes
```bash
🚀 DEO Backend API running on port 3001
🔑 API Keys configured: { OpenAI: true, SerpAPI: true, ... }
🔍 Starting enrichment for: example.com
✅ OpenAI found 2 leads for: example.com
💾 Cached result for: /domain:example.com
```

## 🛡️ Segurança

### Configurações Aplicadas
- **Helmet**: Headers de segurança
- **CORS**: Apenas domínios autorizados
- **Rate Limiting**: 100 requests/15min
- **Input Validation**: Validação de domínios
- **Error Handling**: Logs seguros

### Variáveis Sensíveis
```bash
# NUNCA commite essas chaves
OPENAI_API_KEY=sk-...
SERPAPI_KEY=...
HUNTER_API_KEY=...
APOLLO_API_KEY=...
CLEARBIT_API_KEY=...
```

## 💰 Custos Estimados

### Railway
- **Hobby**: $5/mês
- **Pro**: $20/mês
- **Inclui**: 512MB RAM, SSL, domínio

### Render
- **Free**: $0/mês (limitado)
- **Starter**: $7/mês
- **Inclui**: 512MB RAM, SSL, domínio

### DigitalOcean
- **Basic**: $5/mês
- **Professional**: $12/mês
- **Inclui**: 512MB RAM, SSL, domínio

### Heroku
- **Eco**: $5/mês
- **Basic**: $7/mês
- **Inclui**: 512MB RAM, SSL, domínio

## 🔄 Fluxo Completo

### Desenvolvimento → Produção
1. **Desenvolvimento Local**
   ```bash
   npm run dev  # Frontend + Backend local
   ```

2. **Deploy Backend**
   ```bash
   # Railway/Render/DigitalOcean/Heroku
   git push origin main  # Deploy automático
   ```

3. **Configurar Frontend**
   ```bash
   VITE_BACKEND_URL=https://backend-url.com
   ```

4. **Deploy Frontend**
   ```bash
   # Netlify/Vercel/Surge
   npm run build && npm run deploy
   ```

### Resultado Final
- ✅ Frontend: Vercel/Netlify (estático)
- ✅ Backend: Railway/Render (Node.js)
- ✅ APIs: Todas funcionando sem CORS
- ✅ Cache: Sistema inteligente
- ✅ Monitoramento: Health checks

## 🆘 Troubleshooting

### Problemas Comuns

1. **Backend não inicia**
   ```bash
   # Verifique logs
   # Confirme variáveis de ambiente
   # Teste health check
   ```

2. **CORS errors**
   ```bash
   # Configure FRONTEND_URL corretamente
   # Verifique domínios permitidos
   ```

3. **APIs não funcionam**
   ```bash
   # Verifique chaves de API
   # Confirme limites de uso
   # Teste endpoints individuais
   ```

4. **Puppeteer falha**
   ```bash
   # Verifique dependências do Chrome
   # Configure PUPPETEER_EXECUTABLE_PATH
   ```

### Debug
```bash
# Logs detalhados
DEBUG=* npm start

# Health check completo
curl https://backend-url.com/api/health/detailed

# Status das APIs
curl https://backend-url.com/api/enrichment/status
```

## 🎉 Próximos Passos

1. **Deploy do Backend** ✅
2. **Configurar Frontend** ✅
3. **Testar Integração** ✅
4. **Monitorar Performance** 📊
5. **Otimizar Custos** 💰
6. **Escalar Conforme Necessário** 📈

---

**🚀 Pronto para o deploy!** Escolha sua plataforma e siga o guia. Em caso de dúvidas, consulte os logs e health checks. 
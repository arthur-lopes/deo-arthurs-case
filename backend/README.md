# DEO Data Enrichment Backend

Backend API completo para enriquecimento de dados de leads com múltiplas APIs externas.

## 🚀 Funcionalidades

- **OpenAI GPT-4**: Análise inteligente de domínios e websites
- **Web Scraping**: Extração de dados com Puppeteer + análise OpenAI
- **SerpAPI**: Busca no Google + análise de resultados
- **APIs Externas**: Hunter.io, Apollo.io, Clearbit
- **Cache Inteligente**: Sistema de cache com TTL configurável
- **Rate Limiting**: Proteção contra abuso
- **Health Checks**: Monitoramento completo do sistema
- **Docker Ready**: Containerização completa

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chaves de API (pelo menos OpenAI)

## 🛠️ Instalação

### Desenvolvimento Local

```bash
# Clone o repositório
git clone <repository-url>
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas chaves de API

# Inicie o servidor de desenvolvimento
npm run dev
```

### Docker

```bash
# Build da imagem
docker build -t deo-backend .

# Execute o container
docker run -p 3001:3001 --env-file .env deo-backend

# Ou use docker-compose
docker-compose up
```

## ⚙️ Configuração

### Variáveis de Ambiente Obrigatórias

```env
# OpenAI (Obrigatório)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Variáveis de Ambiente Opcionais

```env
# APIs Externas
SERPAPI_KEY=your-serpapi-key-here
HUNTER_API_KEY=your-hunter-api-key-here
APOLLO_API_KEY=your-apollo-api-key-here
CLEARBIT_API_KEY=your-clearbit-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache
CACHE_TTL=3600
```

## 🔌 Endpoints da API

### Enriquecimento Principal

```http
POST /api/enrichment/domain
Content-Type: application/json

{
  "domain": "example.com"
}
```

### Serviços Individuais

```http
# OpenAI apenas
POST /api/enrichment/openai
{
  "domain": "example.com"
}

# Web Scraping apenas
POST /api/enrichment/scrape
{
  "domain": "example.com"
}

# SerpAPI apenas
POST /api/enrichment/serpapi
{
  "domain": "example.com"
}

# APIs Externas apenas
POST /api/enrichment/external
{
  "domain": "example.com"
}
```

### Monitoramento

```http
# Health check básico
GET /api/health

# Health check detalhado
GET /api/health/detailed

# Status das APIs
GET /api/enrichment/status

# Estatísticas do cache
GET /api/cache/stats

# Limpar cache
DELETE /api/cache/clear?pattern=domain
```

## 📊 Fluxo de Enriquecimento

1. **OpenAI GPT-4**: Análise direta do domínio
2. **Web Scraping**: Puppeteer + OpenAI se OpenAI falhar
3. **SerpAPI**: Google Search + OpenAI se scraping falhar
4. **APIs Externas**: Hunter/Apollo/Clearbit se SerpAPI falhar
5. **Mock Data**: Dados simulados como último recurso

## 🚀 Deploy

### Railway

```bash
# Conecte seu repositório ao Railway
# Configure as variáveis de ambiente no dashboard
# Deploy automático via Git
```

### Render

```bash
# Use o arquivo deploy/render.yaml
# Configure as variáveis de ambiente no dashboard
# Deploy automático via Git
```

### Heroku

```bash
# Use o arquivo deploy/heroku.json
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your-key
git push heroku main
```

### DigitalOcean App Platform

```bash
# Use o Dockerfile
# Configure via dashboard do DigitalOcean
# Deploy via Git ou Docker Registry
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor com nodemon
npm start           # Servidor de produção
npm test            # Executar testes
npm run build       # Build (se necessário)

# Docker
docker-compose up   # Ambiente completo
docker-compose down # Parar ambiente
```

## 📈 Monitoramento

### Health Checks

- `GET /api/health` - Status básico
- `GET /api/health/detailed` - Informações completas
- `GET /api/health/ready` - Readiness probe (K8s)
- `GET /api/health/live` - Liveness probe (K8s)

### Métricas

- Tempo de resposta
- Taxa de sucesso por API
- Uso de memória
- Cache hit rate
- Rate limiting status

## 🛡️ Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração restritiva
- **Rate Limiting**: Proteção contra DDoS
- **Input Validation**: Validação de domínios
- **Error Handling**: Logs seguros

## 🔄 Cache

- **TTL**: 1 hora por padrão
- **Estratégia**: Cache apenas resultados com sucesso
- **Invalidação**: Manual via API
- **Estatísticas**: Hit rate e métricas

## 📝 Logs

```bash
# Logs estruturados com emojis
🚀 Server started
🔍 Starting enrichment for: example.com
✅ OpenAI found 2 leads
💾 Cached result for: /domain:example.com
❌ SerpAPI failed: Rate limit exceeded
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Puppeteer não funciona**
   - Instale dependências do Chrome
   - Configure PUPPETEER_EXECUTABLE_PATH

2. **APIs retornam 401**
   - Verifique as chaves de API
   - Confirme limites de uso

3. **Rate limiting**
   - Ajuste RATE_LIMIT_MAX_REQUESTS
   - Implemente retry logic

4. **Memory issues**
   - Monitore uso de memória
   - Configure limites do container

### Debug

```bash
# Logs detalhados
DEBUG=* npm run dev

# Health check das APIs
curl http://localhost:3001/api/health/apis

# Status do cache
curl http://localhost:3001/api/cache/stats
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: Use o GitHub Issues
- **Documentação**: Veja `/api/docs`
- **Health Check**: `/api/health/detailed` 
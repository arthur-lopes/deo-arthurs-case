# 🚀 Deploy no Render - DEO Platform

Este guia mostra como fazer o deploy completo da plataforma DEO no Render.com.

## 📋 Pré-requisitos

### 1. Conta no Render
- Crie uma conta gratuita em [render.com](https://render.com)
- Conecte sua conta do GitHub

### 2. Repositório GitHub
- Tenha o código em um repositório público/privado no GitHub
- Certifique-se que todos os arquivos estão commitados

### 3. API Keys Necessárias
- **OpenAI API Key** (obrigatória): Para enriquecimento com IA
- **SerpAPI Key** (opcional): Para pesquisas no Google
- **Hunter.io API Key** (opcional): Para enriquecimento de emails
- **Apollo.io API Key** (opcional): Para dados de empresas
- **Clearbit API Key** (opcional): Para informações empresariais

## 🏗️ Configuração do Deploy

### Método 1: Deploy Automático com render.yaml

O projeto já inclui um arquivo `render.yaml` que configura automaticamente todos os serviços.

1. **Conecte o repositório no Render**:
   - Acesse o dashboard do Render
   - Clique em "New +" → "Blueprint"
   - Conecte seu repositório GitHub
   - Selecione o repositório `deo-project`

2. **Configuração automática**:
   - O Render lerá o arquivo `render.yaml`
   - Criará automaticamente 2 serviços:
     - `deo-backend` (API Backend)
     - `deo-frontend` (Interface React)

### Método 2: Deploy Manual (Alternativo)

Se preferir configurar manualmente:

#### Backend (API)
1. **Criar Web Service**:
   - New + → Web Service
   - Connect repository
   - Nome: `deo-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`

#### Frontend (React)
1. **Criar Static Site**:
   - New + → Static Site
   - Connect repository  
   - Nome: `deo-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

## 🔐 Configuração de Variáveis de Ambiente

### Backend Environment Variables

Configure no painel do `deo-backend`:

```bash
# Obrigatórias
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://deo-frontend.onrender.com

# API Keys (Configure suas chaves reais)
OPENAI_API_KEY=sk-sua-chave-openai-aqui
SERPAPI_KEY=sua-chave-serpapi-aqui
HUNTER_API_KEY=sua-chave-hunter-aqui
APOLLO_API_KEY=sua-chave-apollo-aqui
CLEARBIT_API_KEY=sua-chave-clearbit-aqui

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache
CACHE_TTL=3600
CACHE_MAX_KEYS=1000
```

### Frontend Environment Variables

Configure no painel do `deo-frontend`:

```bash
# Obrigatórias
VITE_BACKEND_URL=https://deo-backend.onrender.com

# Opcionais (para funcionalidades frontend)
VITE_OPENAI_API_KEY=sk-sua-chave-openai-aqui
VITE_SERPAPI_KEY=sua-chave-serpapi-aqui
```

## 📝 Passo a Passo Detalhado

### 1. Preparar o Repositório

```bash
# Clone o repositório
git clone [seu-repositorio]
cd deo-project

# Certifique-se que todos os arquivos estão commitados
git add .
git commit -m "Preparando para deploy no Render"
git push origin main
```

### 2. Configurar no Render

1. **Acesse render.com** e faça login
2. **Conecte GitHub**: Settings → Connected Accounts → GitHub
3. **Criar Blueprint**:
   - Dashboard → New + → Blueprint
   - Selecione seu repositório
   - Branch: `main`
   - Clique "Apply Blueprint"

### 3. Configurar Environment Variables

#### Para o Backend:
1. Acesse o serviço `deo-backend`
2. Vá em "Environment"
3. Adicione as variáveis listadas acima
4. **Importante**: Use URLs reais após o deploy inicial

#### Para o Frontend:
1. Acesse o serviço `deo-frontend`
2. Vá em "Environment" 
3. Configure `VITE_BACKEND_URL` com a URL do backend

### 4. Deploy e Verificação

1. **Aguarde o build**: Pode levar 5-10 minutos
2. **Verifique logs**: Monitore os logs de ambos os serviços
3. **Teste health check**: Acesse `https://deo-backend.onrender.com/api/health`
4. **Teste frontend**: Acesse `https://deo-frontend.onrender.com`

## 🔧 URLs após Deploy

### Produção (substitua pelos seus URLs reais):
- **Frontend**: `https://deo-frontend.onrender.com`
- **Backend**: `https://deo-backend.onrender.com`
- **API Docs**: `https://deo-backend.onrender.com/api/docs`
- **Health Check**: `https://deo-backend.onrender.com/api/health`

## ⚡ Otimizações para Produção

### 1. Performance
- Build otimizado com code splitting
- Compressão gzip ativada
- Cache configurado (1 hora TTL)
- Rate limiting (100 req/15min)

### 2. Segurança
- CORS configurado corretamente
- Helmet para headers de segurança
- Rate limiting por IP
- Validação de environment

### 3. Monitoramento
- Health check endpoint
- Logs estruturados
- Error handling robusto
- Graceful shutdown

## 🐛 Troubleshooting

### Problemas Comuns

1. **Build Failed - Frontend**:
   ```bash
   # Verifique se as dependências estão corretas
   npm install
   npm run build
   ```

2. **Backend não inicia**:
   - Verifique variáveis de ambiente
   - Confirme se PORT=10000
   - Verifique logs do Render

3. **CORS Errors**:
   - Confirme FRONTEND_URL no backend
   - Verifique VITE_BACKEND_URL no frontend

4. **API Keys não funcionam**:
   - Verifique se as chaves estão corretas
   - Teste localmente primeiro
   - Confirme billing nas APIs externas

### Logs e Debug

```bash
# Ver logs no Render
1. Acesse o serviço
2. Vá em "Logs"
3. Use "Live Logs" para debug em tempo real

# Endpoints úteis para debug
GET /api/health - Status do sistema
GET /api/docs - Documentação da API
GET /api/enrichment/status - Status das APIs
```

## 📊 Monitoramento

### Métricas Importantes
- **Response Time**: < 2s para APIs
- **Uptime**: > 99%
- **Error Rate**: < 1%
- **Build Time**: < 5 minutos

### Alertas
Configure no Render:
- Build failures
- Service downtime
- High error rates

## 🔄 Atualizações

### Deploy Automático
- Push para `main` → Deploy automático
- Rollback disponível no painel
- Zero downtime deployments

### Manual Deploy
```bash
# Força novo deploy
git commit --allow-empty -m "Trigger deploy"
git push origin main
```

## 💰 Custos

### Render Free Tier
- **Frontend**: Grátis (static site)
- **Backend**: Grátis (750h/mês)
- **Limitações**: 
  - Sleep após 15min inatividade
  - Build time limitado
  - RAM: 512MB

### Upgrade para Paid
- **Starter ($7/mês)**: Sem sleep, mais recursos
- **Standard ($25/mês)**: Alta disponibilidade
- **Pro ($85/mês)**: Recursos premium

## 🚀 Próximos Passos

1. **Custom Domain**: Configure domínio próprio
2. **SSL**: Já incluído automaticamente
3. **CDN**: Para assets estáticos
4. **Database**: PostgreSQL se necessário
5. **Monitoring**: Integração com Sentry/DataDog

## 📞 Suporte

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Support**: Ticket system no dashboard

---

🎉 **Parabéns!** Sua plataforma DEO está agora rodando em produção no Render! 
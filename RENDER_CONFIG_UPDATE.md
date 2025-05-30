# 🔧 Configurações Urgentes do Render - URLs Reais

## 🚨 Ação Necessária Imediata

Você precisa atualizar as variáveis de ambiente no Render com as URLs reais dos serviços.

## 📋 Backend Service (`deo-backend-30ep`)

**URL do seu backend**: `https://deo-backend-30ep.onrender.com`

Vá para o painel do seu backend service no Render e atualize:

### Environment Variables do Backend:
```bash
# Atualize esta variável com a URL REAL do seu frontend
FRONTEND_URL=https://[SUA-URL-FRONTEND-REAL].onrender.com

# Mantenha as outras configurações
NODE_ENV=production
PORT=10000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Keys (suas chaves reais)
OPENAI_API_KEY=sk-sua-chave-openai-real
SERPAPI_KEY=sua-chave-serpapi-real
# ... outras chaves
```

## 📋 Frontend Service (`deo-frontend`)

**URL do seu frontend**: `https://[DESCUBRA-NO-RENDER].onrender.com`

Vá para o painel do seu frontend service no Render e configure:

### Environment Variables do Frontend:
```bash
# Esta já está correta
VITE_BACKEND_URL=https://deo-backend-30ep.onrender.com

# Opcionais
VITE_OPENAI_API_KEY=sk-sua-chave-openai-real
VITE_SERPAPI_KEY=sua-chave-serpapi-real
```

## 🔄 Passos Para Corrigir:

### 1. Descubra a URL do Frontend
1. Acesse o Render Dashboard
2. Clique no seu frontend service
3. Copie a URL completa (algo como: `https://deo-frontend-xyz.onrender.com`)

### 2. Atualize Backend
1. Acesse o backend service (`deo-backend-30ep`)
2. Vá em "Environment"
3. Atualize `FRONTEND_URL` com a URL real do frontend
4. Clique "Save Changes"

### 3. Confirme Frontend
1. Acesse o frontend service
2. Vá em "Environment" 
3. Confirme que `VITE_BACKEND_URL=https://deo-backend-30ep.onrender.com`
4. Se não estiver, adicione/atualize

### 4. Redeploy (se necessário)
1. Backend: Clique "Manual Deploy" → "Deploy latest commit"
2. Frontend: Clique "Manual Deploy" → "Deploy latest commit"

## 🧪 Teste Após Configuração

Após atualizar as configurações:

1. **Acesse seu frontend**: `https://[sua-url-frontend].onrender.com`
2. **Teste health check**: `https://deo-backend-30ep.onrender.com/api/health`
3. **Teste uma funcionalidade**: Enrichment de email ou domínio

## ❗ Importante

- **As duas URLs devem estar corretas** nos dois serviços
- **CORS será configurado automaticamente** com as URLs corretas
- **O build pode levar alguns minutos** após as mudanças

## 📞 Me Informe

Após fazer essas configurações, me diga:
1. Qual é a URL real do frontend?
2. Se ainda há erros de CORS?
3. Se as funcionalidades estão funcionando?

---

**As configurações dos arquivos já foram atualizadas neste projeto. Agora só falta configurar no Render!** 🚀 
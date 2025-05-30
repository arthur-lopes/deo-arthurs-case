# 🔧 Configurações Urgentes do Render - URLs Reais

## 🚨 Ação Necessária Imediata - HEALTH CHECK CORRIGIDO!

✅ **PROBLEMA DE HEALTH CHECK RESOLVIDO**: Adicionamos rota `/health` de fallback + corrigimos `render.yaml`

Você precisa atualizar as variáveis de ambiente no Render e fazer redeploy.

## 🔄 **PRIMEIRO: REDEPLOY NECESSÁRIO!**

**O código foi corrigido para resolver o problema de health check:**
1. Adicionada rota `/health` de fallback 
2. Corrigido `healthCheckPath` no `render.yaml`
3. Agora deve funcionar tanto `/health` quanto `/api/health`

**Faça commit e push das mudanças:**
```bash
git add .
git commit -m "Fix: Health check route for Render deployment"
git push origin main
```

**No Render Dashboard:**
1. Acesse o backend service (`deo-backend-30ep`)
2. Clique "Manual Deploy" → "Deploy latest commit"
3. Aguarde o deploy completar (sem mais erros 404)

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

### 1. **COMMIT E REDEPLOY (ESSENCIAL)**
```bash
git add .
git commit -m "Fix: Health check route for Render deployment"
git push origin main
```

### 2. Descubra a URL do Frontend
1. Acesse o Render Dashboard
2. Clique no seu frontend service
3. Copie a URL completa (algo como: `https://deo-frontend-xyz.onrender.com`)

### 3. Atualize Backend
1. Acesse o backend service (`deo-backend-30ep`)
2. Vá em "Environment"
3. Atualize `FRONTEND_URL` com a URL real do frontend
4. Clique "Save Changes"

### 4. Confirme Frontend
1. Acesse o frontend service
2. Vá em "Environment" 
3. Confirme que `VITE_BACKEND_URL=https://deo-backend-30ep.onrender.com`
4. Se não estiver, adicione/atualize

### 5. Redeploy Ambos (Após Environment Updates)
1. Backend: Clique "Manual Deploy" → "Deploy latest commit"
2. Frontend: Clique "Manual Deploy" → "Deploy latest commit"

## 🧪 Teste Após Configuração

Após atualizar as configurações:

1. **Health checks funcionando**: 
   - `https://deo-backend-30ep.onrender.com/health` ✅
   - `https://deo-backend-30ep.onrender.com/api/health` ✅

2. **Acesse seu frontend**: `https://[sua-url-frontend].onrender.com`
3. **Teste uma funcionalidade**: Enrichment de email ou domínio

## ❗ Importante

- **REDEPLOY É OBRIGATÓRIO** para aplicar a correção do health check
- **As duas URLs devem estar corretas** nos dois serviços
- **CORS será configurado automaticamente** com as URLs corretas
- **O build agora deve completar sem travar**

## 📞 Me Informe

Após fazer essas configurações, me diga:
1. Se o deploy completou sem erros de health check
2. Qual é a URL real do frontend?
3. Se as funcionalidades estão funcionando?

---

**✅ CORREÇÃO APLICADA! Agora faça commit, push e redeploy no Render!** 🚀 
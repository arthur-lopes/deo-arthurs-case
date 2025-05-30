# 🚀 Guia Completo de Deploy - Plataforma DEO no Render

## ✅ Status: Pronto para Deploy!

Todos os arquivos necessários foram criados e configurados. Sua plataforma DEO está **100% pronta** para deploy no Render.com.

## 📁 Arquivos Criados para Deploy

### ✅ Configuração Principal
- `render.yaml` - Configuração automática dos serviços
- `env.production` - Variáveis de ambiente do frontend
- `backend/env.production` - Variáveis de ambiente do backend
- `build.sh` - Script de build (executável)

### ✅ Configuração de Build
- `package.json` - Atualizado com scripts de produção
- `backend/package.json` - Configurado para produção
- `vite.config.ts` - Otimizado para build
- `_redirects` - Redirecionamentos para SPA

### ✅ Documentação
- `DEPLOY_RENDER.md` - Guia técnico completo
- `DEPLOYMENT_CHECKLIST.md` - Checklist passo a passo
- `README.md` - Documentação atualizada

## 🚀 Como Fazer o Deploy (Passo a Passo)

### 1. Preparar Repositório GitHub

```bash
# 1. Commitar todos os arquivos
git add .
git commit -m "Preparando para deploy no Render - Todos os arquivos configurados"
git push origin main

# 2. Verificar se todos os arquivos estão no repositório
git status
```

### 2. Configurar no Render.com

#### Opção A: Deploy Automático (Recomendado)

1. **Acesse [render.com](https://render.com)** e faça login
2. **Conecte GitHub**: Settings → Connected Accounts → GitHub
3. **Criar Blueprint**:
   - Dashboard → "New +" → "Blueprint"
   - Selecione seu repositório GitHub
   - Branch: `main`
   - Clique "Apply Blueprint"
4. **Aguarde**: O Render criará automaticamente 2 serviços:
   - `deo-backend` (API)
   - `deo-frontend` (Interface)

#### Opção B: Deploy Manual

Se preferir configurar manualmente:

**Backend:**
1. New + → Web Service
2. Connect repository → Selecione seu repo
3. Nome: `deo-backend`
4. Environment: `Node`
5. Build Command: `cd backend && npm install`
6. Start Command: `cd backend && npm start`

**Frontend:**
1. New + → Static Site
2. Connect repository → Selecione seu repo
3. Nome: `deo-frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`

### 3. Configurar API Keys

#### No Backend (`deo-backend`):
1. Acesse o serviço no dashboard
2. Vá em "Environment"
3. Adicione suas chaves reais:

```bash
# OBRIGATÓRIA
OPENAI_API_KEY=sk-sua-chave-openai-real-aqui

# OPCIONAIS (mas recomendadas)
SERPAPI_KEY=sua-chave-serpapi-aqui
HUNTER_API_KEY=sua-chave-hunter-aqui
APOLLO_API_KEY=sua-chave-apollo-aqui
```

#### No Frontend (`deo-frontend`):
1. Acesse o serviço no dashboard
2. Vá em "Environment"
3. Adicione (opcional):

```bash
VITE_OPENAI_API_KEY=sk-sua-chave-openai-aqui
VITE_SERPAPI_KEY=sua-chave-serpapi-aqui
```

### 4. Aguardar Deploy

- ⏱️ **Tempo estimado**: 5-10 minutos
- 📊 **Monitore**: Logs em tempo real
- ✅ **Sucesso**: Status "Live" em ambos os serviços

### 5. Testar Aplicação

Após deploy bem-sucedido:

```bash
# URLs que você receberá (exemplo):
Frontend: https://deo-frontend.onrender.com
Backend: https://deo-backend.onrender.com

# Testes essenciais:
1. Acesse o frontend
2. Teste: https://deo-backend.onrender.com/api/health
3. Verifique: https://deo-backend.onrender.com/api/docs
```

## 🔧 Configurações Importantes

### URLs Finais
Após o deploy, **atualize as URLs** nos serviços:

**No Backend:**
- `FRONTEND_URL` = URL real do frontend

**No Frontend:**
- `VITE_BACKEND_URL` = URL real do backend

### Funcionalidades Testadas
- ✅ Domain Search
- ✅ Email Enrichment  
- ✅ CSV Processing
- ✅ HubSpot Integration
- ✅ API Documentation
- ✅ DEO Academy

## 💰 Custos (Render Free Tier)

- **Frontend**: Grátis (static site)
- **Backend**: Grátis (750h/mês)
- **Limitação**: Sleep após 15min inatividade

## 🆘 Problemas Comuns

### Build Failed
```bash
# Solução:
1. Verifique Node.js 18+ no Render
2. Confirme package.json correto
3. Verifique logs de build
```

### API Keys não funcionam
```bash
# Solução:
1. Verifique se as chaves estão corretas
2. Confirme billing nas APIs (OpenAI, etc.)
3. Teste localmente primeiro
```

### CORS Errors
```bash
# Solução:
1. Atualize FRONTEND_URL no backend
2. Atualize VITE_BACKEND_URL no frontend
3. Redeploy ambos os serviços
```

## 📞 Suporte

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **OpenAI Status**: [status.openai.com](https://status.openai.com)
- **Issues**: GitHub Issues do seu repositório

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. **Domínio Personalizado**: Configure seu próprio domínio
2. **Monitoramento**: Configure alertas de uptime
3. **Backup**: Configure backup automático
4. **Upgrade**: Considere plano pago para sem sleep

---

## ✅ Resumo Final

**Status**: ✅ **PRONTO PARA DEPLOY**

**Arquivos Criados**: 8 arquivos de configuração
**Documentação**: 3 guias completos
**Testes**: Build funcionando perfeitamente

**Próximo Passo**: Fazer push para GitHub e seguir o passo 2 deste guia!

---

🚀 **Sua plataforma DEO está pronta para produção no Render!** 
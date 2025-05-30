# Scripts de Startup e Gerenciamento de Portas

Este documento explica os scripts criados para facilitar o desenvolvimento e evitar conflitos de porta.

## 🎯 Objetivo

Os scripts garantem que:
- **Backend** sempre rode na porta **3001**
- **Frontend** sempre rode na porta **5173**
- Processos conflitantes sejam automaticamente encerrados

## 🚀 Scripts Disponíveis

### Frontend (Porta 5173)
```bash
# Desenvolvimento normal
npm run dev

# Forçar porta 5173 (mata processos conflitantes)
npm run dev:force
```

### Backend (Porta 3001)
```bash
# Desenvolvimento normal  
npm run dev

# Forçar porta 3001 (mata processos conflitantes)
npm run start:force
```

### Iniciar Ambos os Serviços
```bash
# Comando recomendado - inicia tudo automaticamente
npm run start:all
```

## 📁 Arquivos dos Scripts

### 1. `scripts/start-all.js` (Principal)
- **Função**: Inicia backend e frontend simultaneamente
- **Portas**: Backend na 3001, Frontend na 5173  
- **Recursos**:
  - Verificação automática de portas em uso
  - Encerramento de processos conflitantes
  - Logs coloridos para identificar backend/frontend
  - Shutdown gracioso com Ctrl+C
  - Timeout de inicialização com retry automático

### 2. `backend/scripts/start-backend.js`
- **Função**: Força o backend a rodar na porta 3001
- **Recursos**:
  - Mata automaticamente processos Node.js na porta 3001
  - Compatível com Windows e Linux/Mac
  - Logs detalhados do processo
  - Tratamento robusto de erros

### 3. `scripts/start-frontend.js`
- **Função**: Força o frontend a rodar na porta 5173
- **Recursos**:
  - Mata automaticamente processos na porta 5173
  - Inicia Vite com configuração otimizada
  - Logs detalhados do processo

## 🔧 Configurações Técnicas

### Timeouts e Processamento
- **Backend Enrichment**: 90 segundos (aumentado de 60s)
- **Hybrid Processing**: 80 segundos para SerpAPI + Web Scraping
- **Frontend Timeout**: 120 segundos para aguardar backend
- **OpenAI Processing**: 8 segundos (otimizado)

### Sistema de Feedback Progressivo
O frontend agora mostra progresso detalhado durante o enrichment:
1. 🔍 Iniciando pesquisa no SerpAPI...
2. 🕷️ Coletando dados do website...
3. 🤖 Analisando dados com OpenAI...
4. ⏳ Processamento avançado - aguarde...
5. 🔄 Consolidando resultados...
6. 🎯 Finalizando análise...
7. ✅ Processando dados encontrados...

### Priorização de Dados
- **SerpAPI prioritário**: Se encontrar dados, retorna imediatamente
- **Web Scraping secundário**: Usado apenas como complemento
- **Zero dados mockados**: Sistema nunca inventa informações

## 🏥 Health Check e Monitoramento

### Backend Health Check
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/health

# PowerShell (Windows)
Invoke-WebRequest -Uri "http://localhost:3001/api/health"
```

### Frontend com Status em Tempo Real
- ✅ Backend Online (APIs Disponíveis) - Verde
- ❌ Backend Offline (Funcionalidade Limitada) - Vermelho  
- 🔄 Verificando Backend (Aguarde...) - Amarelo
- Verificação automática a cada 30 segundos
- Clique manual para verificar imediatamente

## 🚨 Solução de Problemas

### Problema: "Porto em uso" ou "EADDRINUSE"
```bash
# Use os scripts com força
npm run start:all  # Mata automaticamente processos conflitantes
```

### Problema: "Backend não responde"
```bash
# Verificar se está rodando
netstat -ano | findstr :3001  # Windows
lsof -i :3001                # Linux/Mac

# Reiniciar forçadamente
npm run start:force          # Só backend
npm run start:all            # Tudo
```

### Problema: "Frontend timeout esperando backend"
- **Motivo**: Processamento de enrichment demora mais que 60s
- **Solução**: Aguarde até 120 segundos - dados do SerpAPI são priorizados
- **Indicadores**: Acompanhe o progresso no frontend
- **Logs**: Verifique console do backend para ver progresso real

### Problema: "Puppeteer falha no Windows"
```bash
# Instalar dependências do Chrome
npm install
```

### Problema: "Dados do SerpAPI ignorados"
- **Diagnóstico**: Backend encontra dados mas frontend recebe timeout
- **Correção aplicada**: 
  - Timeout frontend aumentado para 120s
  - SerpAPI tem prioridade e retorna dados imediatamente
  - Feedback progressivo mostra status real
  - Web scraping não bloqueia retorno de dados do SerpAPI

## 📊 APIs e Configurações

### APIs Configuradas
- **OpenAI**: ✅ Configurada (backend)
- **SerpAPI**: ✅ Configurada (Google Search)  
- **Hunter.io**: ❌ Não configurada
- **Apollo.io**: ❌ Não configurada
- **Clearbit**: ❌ Não configurada

### Puppeteer 24.x
- Chrome for Testing mais recente
- Configuração otimizada para melhor performance
- Fallbacks HTTP quando necessário
- Timeouts ajustados para produção

## ⚡ Performance e Otimizações

### Hybrid Enrichment Otimizado
1. **SerpAPI executa primeiro** (5-10 segundos)
2. **Web Scraping em paralelo** (30-60 segundos)  
3. **Se SerpAPI tem dados → retorna imediatamente**
4. **OpenAI consolida dados encontrados** (5-8 segundos)
5. **Total esperado**: 15-25 segundos para casos com sucesso

### Cache Inteligente
- Resultados ficam em cache por 24 horas
- Evita reprocessamento desnecessário
- Acelera consultas repetidas

## 🎯 Uso Recomendado

### Para Desenvolvimento Diário
```bash
npm run start:all
```

### Para Debugging
```bash
# Terminal 1 - Backend com logs detalhados
cd backend && npm run start:force

# Terminal 2 - Frontend  
npm run dev:force
```

### Para Produção
- Use `npm run start:all` 
- Configure variáveis de ambiente apropriadas
- Monitor health checks regularmente

## 🔗 URLs Garantidas

Após executar os scripts, os serviços estarão disponíveis em:

- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173

## ⚙️ Configuração do .env

Certifique-se de que o arquivo `.env` na raiz do projeto contenha:

```env
VITE_BACKEND_URL=http://localhost:3001
```

## 🛑 Parar os Serviços

### Script Principal
- Pressione `Ctrl+C` no terminal onde executou `npm run start:all`
- Os dois serviços serão encerrados automaticamente

### Scripts Individuais
- Pressione `Ctrl+C` no terminal do respectivo serviço

## 🔍 Troubleshooting

### Erro: "Port still in use"
1. Execute manualmente:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /F /PID <pid>
   
   # Linux/Mac
   lsof -ti:3001 | xargs kill -9
   ```

2. Tente novamente o script

### Erro: "Failed to start"
1. Verifique se as dependências estão instaladas:
   ```bash
   npm install
   cd backend && npm install
   ```

2. Verifique se o Node.js está atualizado (>=16.0.0)

### Erro: "Backend not available"
1. Verifique se o backend está rodando na porta 3001
2. Verifique o arquivo `.env` com `VITE_BACKEND_URL=http://localhost:3001`
3. Teste manualmente: http://localhost:3001/api/health

## 📝 Logs

Os scripts mostram logs detalhados:
- `[BACKEND]` - Logs do backend
- `[FRONTEND]` - Logs do frontend
- `🔍` - Verificação de portas
- `🔪` - Encerramento de processos
- `✅` - Sucesso
- `❌` - Erro

## 🎉 Benefícios

1. **Consistência:** Sempre as mesmas portas
2. **Automação:** Não precisa matar processos manualmente
3. **Simplicidade:** Um comando para tudo
4. **Robustez:** Tratamento de erros e timeouts
5. **Desenvolvimento:** Foco no código, não na infraestrutura 
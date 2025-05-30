# 🔑 Configuração da OpenAI API

## Como Configurar a Chave da OpenAI

### 1. Obter a Chave da API

1. Acesse [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Dê um nome para sua chave (ex: "Lead Enrichment")
5. Copie a chave gerada (ela começa com `sk-`)

### 2. Configurar no Projeto

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env`:**
   ```bash
   # Substitua esta linha:
   VITE_OPENAI_API_KEY=sk-your-openai-api-key-here-ok
   
   # Por sua chave real:
   VITE_OPENAI_API_KEY=sk-proj-sua-chave-real-aqui
   ```

3. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

### 3. Verificar se Está Funcionando

- ✅ **Indicador Verde**: "OpenAI Configurada (API Real)" - Funcionando corretamente
- ⚠️ **Indicador Amarelo**: "OpenAI Não Configurada (Dados Mock)" - Usando dados simulados

### 4. Funcionalidades com API Real vs Mock

| Funcionalidade | Com API Real | Com Dados Mock |
|---|---|---|
| **Enriquecimento por Domínio** | Análise real do domínio, dados específicos e realistas | Dados genéricos baseados em palavras-chave |
| **Enriquecimento de CSV** | IA analisa cada lead individualmente | Regras pré-definidas baseadas em palavras-chave |
| **Qualidade dos Dados** | Alta - baseada em análise contextual | Média - baseada em padrões simples |
| **Variedade** | Dados únicos para cada consulta | Dados limitados e repetitivos |

### 5. Custos da OpenAI

- **Modelo usado**: GPT-4o-mini (mais econômico)
- **Custo aproximado**: ~$0.15 por 1000 tokens
- **Para enriquecimento por domínio**: ~$0.01-0.02 por consulta
- **Para enriquecimento de CSV**: ~$0.001-0.005 por lead

### 6. Solução de Problemas

#### Erro 401 - Unauthorized
- Verifique se a chave está correta
- Confirme que a chave não expirou
- Verifique se há créditos na conta OpenAI

#### Dados ainda aparecem como Mock
- Confirme que o arquivo `.env` está na raiz do projeto
- Verifique se a chave começa com `sk-`
- Reinicie o servidor (`npm run dev`)
- Abra o console do navegador para ver logs de debug

#### Rate Limit
- A OpenAI tem limites de requisições por minuto
- Aguarde alguns segundos entre consultas
- Considere upgrade do plano se necessário

### 7. Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env` no Git
- Não compartilhe sua chave da API
- Use variáveis de ambiente em produção
- Monitore o uso na dashboard da OpenAI

### 8. Logs de Debug

Para verificar se a API está sendo usada, abra o console do navegador (F12) e procure por:

- ✅ `Using OpenAI API to enrich domain: exemplo.com`
- ✅ `Successfully enriched domain exemplo.com with 4 leads using OpenAI`
- ⚠️ `OpenAI API key not properly configured. Using mock data as fallback.`

---

## Contato

Se tiver problemas com a configuração, verifique:
1. Console do navegador para mensagens de erro
2. Arquivo `.env` está configurado corretamente
3. Chave da OpenAI é válida e tem créditos 
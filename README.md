# 🚀 Lead Data Enrichment Platform

Uma plataforma moderna e inteligente para limpeza e enriquecimento de dados de leads, desenvolvida especificamente para profissionais de vendas e marketing que trabalham com dados de dentistas e outros profissionais.

## ✨ Funcionalidades

### 🔐 Autenticação Segura
- Sistema de login com credenciais admin
- Proteção de rotas sensíveis
- Sessão persistente

### 📊 Processamento Inteligente de Dados
- **Upload de CSV** com drag & drop
- **🌐 Enriquecimento por Domínio** - NOVA FUNCIONALIDADE!
  - Digite apenas um domínio (ex: empresa.com.br)
  - IA descobre automaticamente leads da empresa
  - Dados completos gerados instantaneamente
- **Limpeza automática** de dados:
  - Normalização de nomes próprios
  - Formatação de telefones
  - Padronização de empresas e cargos
- **Enriquecimento com IA**:
  - Integração real com OpenAI GPT-4/3.5-turbo
  - Identificação automática de especialidades
  - Inferência de graus de senioridade
  - Suporte específico para dentistas

### 📈 Visualização e Análise
- **Dashboard completo** com estatísticas
- **Comparação antes/depois** do processamento
- **Filtros avançados** por especialidade, grau, empresa
- **Busca em tempo real**
- **Paginação inteligente**

### 🎓 Recursos Educacionais
- **Curso HubSpot** completo e interativo
- **Tutorial passo a passo** para importação
- **Documentação técnica** detalhada

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **IA**: OpenAI GPT-4/3.5-turbo (integração real)
- **Styling**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Estado**: Context API
- **Notificações**: React Hot Toast
- **Ícones**: Lucide React
- **CSV Processing**: PapaParse
- **Upload**: React Dropzone

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- **Chave da API OpenAI** (opcional, mas recomendado)

### 1. Clone o repositório
```bash
git clone <repository-url>
cd project
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# OpenAI Configuration (IMPORTANTE!)
VITE_OPENAI_API_KEY=sk-your-real-openai-api-key-here

# Authentication
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=admin123
VITE_JWT_SECRET=your-jwt-secret-key-here

# Application Settings
NODE_ENV=development
VITE_APP_URL=http://localhost:5173

# Rate Limiting
VITE_RATE_LIMIT_MAX_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=900000

# File Upload Limits
VITE_MAX_FILE_SIZE_MB=5
VITE_MAX_LEADS_PER_FILE=1000

# Domain Enrichment Settings
VITE_DOMAIN_ENRICHMENT_ENABLED=true
VITE_MOCK_DATA_ENABLED=true
```

### 4. Execute o projeto
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📝 Como Usar

### 1. Login
- Usuário: `admin`
- Senha: `admin123`

### 2. Método 1: Upload de CSV
1. Acesse a página "Upload CSV"
2. Baixe o arquivo de exemplo se necessário
3. Faça upload do seu arquivo CSV
4. Aguarde o processamento automático

### 3. Método 2: Enriquecimento por Domínio (NOVO!)
1. Acesse a página "Busca por Domínio"
2. Digite um domínio (ex: `smiledental.com.br`)
3. Clique em "Buscar Leads"
4. A IA irá:
   - Analisar o domínio
   - Identificar o tipo de empresa
   - Gerar leads realistas com dados completos
   - Enriquecer com especialidades e graus

### 4. Visualização dos Resultados
1. Veja o resumo estatístico dos dados
2. Compare os dados antes/depois
3. Use filtros avançados para análise
4. Baixe o CSV processado

### 5. Formato do CSV
O arquivo deve conter as seguintes colunas:
- `Full Name` - Nome completo
- `Company` - Nome da empresa
- `Job Title` - Cargo/título
- `Phone Number` - Telefone
- `Email` - Email
- `Specialty` - Especialidade (opcional)

Campos adicionais como `Source`, `Lifecycle Stage`, `ZIP Code`, `Sales Status` são opcionais.

## 🤖 Integração com OpenAI

### Configuração da API
1. Obtenha sua chave da API em: https://platform.openai.com/api-keys
2. Adicione a chave no arquivo `.env`:
   ```env
   VITE_OPENAI_API_KEY=sk-your-real-api-key-here
   ```

### Funcionalidades com IA
- **Enriquecimento de CSV**: Melhora dados existentes
- **Descoberta por Domínio**: Gera leads completos a partir de um domínio
- **Classificação Inteligente**: Identifica especialidades e graus automaticamente
- **Fallback Inteligente**: Se a API falhar, usa dados mock realistas

### Modelos Utilizados
- **GPT-4**: Para enriquecimento por domínio (análise complexa)
- **GPT-3.5-turbo**: Para enriquecimento de CSV (mais rápido e econômico)

## 🎯 Especialidades Suportadas

### Odontologia (Foco Principal)
- **Ortodontia** - Correção de dentes e mandíbula
- **Odontopediatria** - Odontologia infantil
- **Odontologia Estética** - Procedimentos cosméticos
- **Clínica Geral** - Atendimento geral

### Outras Áreas
- **Tecnologia** - Desenvolvedores, engenheiros
- **Marketing** - Profissionais de marketing
- **Vendas** - Representantes comerciais
- **Finanças** - Analistas financeiros

## 🏗️ Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal
│   ├── DataTable.tsx   # Tabela de dados
│   ├── DataSummary.tsx # Resumo estatístico
│   ├── AdvancedFilters.tsx # Filtros avançados
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── UploadPage.tsx  # Upload de CSV
│   ├── DomainEnrichmentPage.tsx # Enriquecimento por domínio
│   ├── ResultsPage.tsx # Resultados
│   └── ...
├── services/           # Lógica de negócio
│   ├── csvService.ts   # Processamento CSV
│   ├── enrichmentService.ts # Enriquecimento IA
│   ├── domainEnrichmentService.ts # Enriquecimento por domínio
│   └── ...
├── config/             # Configurações
│   └── env.ts         # Variáveis de ambiente
├── context/            # Gerenciamento de estado
├── types/              # Definições TypeScript
└── utils/              # Utilitários
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente (especialmente `VITE_OPENAI_API_KEY`)
3. Deploy automático

### Netlify
1. Build: `npm run build`
2. Publish directory: `dist`
3. Configure redirects para SPA
4. Adicione variáveis de ambiente

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting
npm run type-check   # Verificação de tipos
```

## 📊 Métricas e Analytics

A plataforma coleta métricas importantes:
- Taxa de enriquecimento de dados
- Distribuição de especialidades
- Qualidade dos dados processados
- Performance do processamento
- Uso da API OpenAI

## 🔒 Segurança

- Autenticação baseada em JWT
- Validação de entrada de dados
- Sanitização de uploads
- Rate limiting configurável
- Logs de auditoria
- Chaves de API protegidas

## 💡 Exemplos de Uso

### Enriquecimento por Domínio
```
Entrada: "smiledental.com.br"
Saída: 3-5 leads completos com:
- Nomes realistas
- Cargos apropriados
- Emails no domínio
- Telefones formatados
- Especialidades odontológicas
- Graus de senioridade
```

### Upload de CSV
```
Entrada: CSV com dados básicos
Saída: CSV enriquecido com:
- Dados limpos e formatados
- Especialidades identificadas
- Graus de senioridade inferidos
- Informações padronizadas
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte técnico ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação técnica em `/src/documentation/`
- Entre em contato com a equipe de desenvolvimento

## 🎯 Roadmap

### ✅ Funcionalidades Implementadas
- [x] Upload e processamento de CSV
- [x] Enriquecimento por domínio com IA
- [x] Integração real com OpenAI
- [x] Dashboard com estatísticas
- [x] Filtros avançados
- [x] Comparação antes/depois
- [x] Sistema de autenticação
- [x] Interface responsiva

### 🔄 Próximas Funcionalidades
- [ ] Integração com APIs externas (LinkedIn, ZoomInfo)
- [ ] Processamento em lote via API
- [ ] Dashboard de analytics avançado
- [ ] Exportação para múltiplos formatos
- [ ] Integração direta com CRMs
- [ ] Machine Learning para melhor enriquecimento
- [ ] Histórico de processamentos
- [ ] Relatórios de qualidade de dados

### 🛠️ Melhorias Técnicas
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] CI/CD pipeline
- [ ] Monitoramento e observabilidade
- [ ] Cache inteligente
- [ ] Otimização de performance
- [ ] PWA (Progressive Web App)
- [ ] Modo offline

---

**Desenvolvido com ❤️ para profissionais de vendas e marketing**

> 🌟 **Nova funcionalidade**: Agora você pode descobrir leads completos digitando apenas um domínio! Experimente a busca por domínio e veja a magia da IA em ação. 
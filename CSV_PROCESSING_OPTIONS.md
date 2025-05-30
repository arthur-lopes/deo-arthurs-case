# Opções de Processamento de CSV

## Funcionalidade

Na página de **Upload de CSV**, agora é possível escolher entre **três opções** de processamento:

### 1. 🗃️ Apenas Limpeza
- **Descrição**: Limpa e padroniza os dados sem usar IA
- **O que faz**:
  - Normaliza nomes próprios (joão silva → João Silva)
  - Formata telefones corretamente ((11)98765-4321 → +55 11 98765-4321)
  - Padroniza nomes de empresas e cargos
  - Remove espaços extra e caracteres inválidos
- **Vantagens**:
  - ⚡ Processamento rápido
  - 💰 Sem custos de IA
  - 📊 Ideal para grandes volumes
- **Quando usar**: 
  - Você já possui informações de especialidade
  - Quer apenas padronizar os dados
  - Precisa processar grandes volumes rapidamente

## 📁 Gerenciamento de Arquivos

### Upload de Arquivos
- **Arrastar e Soltar**: Arraste um arquivo CSV diretamente para a área de upload
- **Seleção Manual**: Clique na área de upload para abrir o seletor de arquivos
- **Validação Automática**: Apenas arquivos CSV são aceitos
- **Tamanho Máximo**: 5MB por arquivo

### Remoção de Arquivos ✨ **NOVO!**
- **Botão de Remoção**: Quando um arquivo é selecionado, aparece um botão ✕ vermelho no canto superior direito
- **Limpeza Completa**: Remove o arquivo e limpa todos os dados processados
- **Confirmação Visual**: Mensagem de sucesso confirma a remoção
- **Reset do Estado**: Volta ao estado inicial para novo upload

### 2. 🤖 Limpeza + Enriquecimento
- **Descrição**: Limpa os dados e adiciona informações com IA
- **O que faz**:
  - Tudo da limpeza básica +
  - Adiciona campo **Especialidade** usando IA
  - Adiciona campo **Grau** (senioridade) usando IA
  - Analisa cargo e empresa para inferir área de atuação
- **Vantagens**:
  - 📈 Dados mais completos
  - 🎯 Segmentação melhor
  - 🤖 Inteligência artificial
- **Quando usar**:
  - Quer dados completos com especialidade e grau
  - Não possui informações de área de atuação
  - Volume menor de dados (devido ao tempo de processamento)

### 3. 🧠 Processamento Avançado (NOVO!)
- **Descrição**: Deduplicação inteligente + limpeza + consolidação com IA
- **O que faz**:
  - **SEMPRE** aplica limpeza básica de dados (capitalização, formatação de telefones, etc.)
  - Identifica automaticamente pessoas **duplicadas** usando algoritmo inteligente otimizado
  - Consolida informações duplicadas em um único registro
  - Escolhe as **melhores informações** de cada campo usando IA
  - Mantém **email principal e secundário**
  - Consolida **fontes de marketing** (source)
  - Prioriza hierarquia de cargos (CEO > Owner > Manager)
  - Unifica informações de **lifecycle stage** e **sales status**
  - **Detecta variações de empresa** (ex: "Total Dental" vs "Total Dental Solutions")
  - **Reconhece domínios similares** (ex: company.com vs company.net)
  - **Sistema de boost inteligente**: prioriza nome + empresa idênticos
  - **Detecção flexível de telefones**: reconhece números similares com pequenas diferenças
- **Vantagens**:
  - 🔄 Remove duplicatas automaticamente
  - 🧠 IA avançada para consolidação
  - 📊 Dados limpos e únicos
  - 💎 Qualidade superior dos dados
  - 📈 Relatórios de duplicatas encontradas
  - ✨ **Limpeza básica aplicada em TODOS os registros**
  - 🎯 **Algoritmo ultra-sensível** para detectar duplicatas óbvias
  - 🚀 **Sistema de boost**: mesmo nome+empresa = 90%+ similaridade garantida
- **Quando usar**:
  - **Datasets com muitas duplicatas** (ex: múltiplas campanhas)
  - Dados inconsistentes que precisam ser **unificados**
  - **Mesma pessoa** com informações em registros diferentes
  - Quer a **melhor versão** de cada informação
  - **Dados com pequenas variações** (telefones ligeiramente diferentes, etc.)

## Interface

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ○ Apenas Limpeza                                                           │
│    🗃️ Normaliza dados sem usar IA                                           │
│    ⚡ Rápido • 💰 Sem custos                                                │
│                                                                             │
│  ○ Limpeza + Enriquecimento                                                │
│    🤖 Adiciona especialidade e grau com IA                                  │
│    📈 Dados completos • 🎯 Melhor segmentação                               │
│                                                                             │
│  ● Processamento Avançado                                                  │
│    🧠 IA Avançada • 🔄 Remove duplicatas • 📊 Consolidação inteligente      │
│    ✨ Limpeza básica aplicada sempre                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Campos Processados

### Limpeza (todas as opções):
- **Nome**: Capitalização correta
- **Empresa**: Padronização de nomes
- **Título/Cargo**: Normalização de cargos
- **Telefone**: Formatação padrão brasileira
- **Email**: Validação e limpeza

### Enriquecimento (opções 2 e 3):
- **Especialidade**: Área de atuação inferida por IA
- **Grau**: Nível de senioridade (Junior, Pleno, Senior, etc.)

### Deduplicação Avançada (apenas opção 3):
- **Email Secundário**: Mantém múltiplos emails da mesma pessoa
- **Source Consolidado**: Todas as fontes de marketing unificadas
- **Lifecycle Stage**: Prioriza Customer > Lead > Prospect
- **Sales Status**: Prioriza Won > Lost
- **ZIP Code**: Mantém informação mais completa
- **Estatísticas**: Quantas duplicatas foram encontradas e consolidadas

## Exemplo de Deduplicação

### Dados Originais (Duplicados):
```csv
john doe,Smile Dental,Owner,FB Ad,john@smiledental.com,General Dentistry,Lead,12345,(555) 123-4567,Won
John Doe,Smile Dental Inc.,Lead Dentist,Facebook.com,j.doe@smiledental.org,general dentistry,Prospect,12346,5552345679,Lost
JOHN DOE,Smile Dental LLC,CEO,facebook,johndoe@smile.net,General,Customer,12345,555-123-4567,Won
```

### Após Processamento Avançado:
```csv
John Doe,Smile Dental Inc.,CEO,FB Ad; Facebook.com; facebook,john@smiledental.com,j.doe@smiledental.org,General Dentistry,Customer,12345,(555) 123-4567,Won,Senior,2
```

**Resultado**: 3 registros duplicados consolidados em 1 registro com as melhores informações!

## Performance Comparativa

| Opção | Tempo por Lead | Custo IA | Deduplicação | Volume Recomendado |
|-------|----------------|----------|--------------|-------------------|
| Apenas Limpeza | ~50ms | ❌ Sem custo | ❌ Não | Ilimitado |
| Limpeza + Enriquecimento | ~2-5s | ✅ Médio | ❌ Não | Até 500 leads |
| **Processamento Avançado** | ~5-10s | ✅ Alto | ✅ Sim | Até 200 leads |

## Quando Usar Cada Opção

### 🗃️ Apenas Limpeza
- ✅ Dados já limpos, sem duplicatas
- ✅ Grandes volumes (1000+ leads)
- ✅ Orçamento limitado
- ✅ Não precisa de enriquecimento

### 🤖 Limpeza + Enriquecimento  
- ✅ Dados únicos, sem duplicatas
- ✅ Precisa de especialidade e grau
- ✅ Volume médio (até 500 leads)
- ✅ Quer dados completos

### 🧠 Processamento Avançado
- ✅ **Muitas duplicatas** (várias campanhas)
- ✅ **Dados inconsistentes** (mesmo lead, infos diferentes)
- ✅ **Quer a melhor versão** de cada informação
- ✅ **Precisa de dados únicos e limpos**
- ✅ Volume menor, mas **qualidade máxima**

## Exemplos de Uso

```bash
# Cenário 1: Lista limpa de leads únicos
→ Use: "Limpeza + Enriquecimento"

# Cenário 2: Dados de múltiplas campanhas com duplicatas  
→ Use: "Processamento Avançado"

# Cenário 3: Base grande, apenas padronizar
→ Use: "Apenas Limpeza"
```

## Arquivo de Exemplo

- **exemplo_leads.csv**: Para dados únicos
- **exemplo_leads_duplicados.csv**: Para testar deduplicação ⬅️ **NOVO!** 
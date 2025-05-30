PRD: Upload e Limpeza de CSV de Leads
Objetivos
Facilitar a limpeza de dados: Permitir que o usuário carregue uma planilha (CSV) de leads extraída de outra fonte (por exemplo, HubSpot ou Excel) e receba os dados padronizados e corrigidos automaticamente, economizando tempo em tarefas manuais de formatação.
Garantir consistência: Aplicar transformações consistentes nos campos (nome, empresa, título, telefone, especialidade), melhorando a qualidade dos dados (ex.: nomes propriamente capitalizados, telefones em formato internacional, etc.), o que aumenta a confiabilidade para uso posterior (como importação em CRM ou geração de relatórios).
Preparar para enriquecimento: Antes de enriquecer (Funcionalidade 1), garantir que os dados básicos estejam limpos. Por exemplo, eliminar espaços extras, corrigir capitalização, para que o processo de enriquecimento seja mais preciso e para que o output final seja apresentável.
Usabilidade e rapidez: Oferecer uma interface simples onde, em poucos cliques (selecionar arquivo e enviar), o usuário obtém de volta um conjunto de dados tratado, sem necessidade de conhecer scripts ou planilhas complexas.
Usuários-alvo
Profissionais de Marketing/Vendas: Usuários que exportam listas de leads de sistemas legados ou planilhas e precisam preparar esses dados para campanhas ou análises. Eles podem não ter habilidades técnicas para limpar dados programaticamente, então essa ferramenta os auxilia de forma self-service.
Operações de CRM/Analistas: Pessoas responsáveis por manter a qualidade dos dados no CRM (ex.: HubSpot). Eles podem usar essa funcionalidade para padronizar dados antes de importá-los em massa, garantindo conformidade com as regras do sistema (por exemplo, evitando duplicatas por diferença de formatação).
Educadores/Consultores (secundário): No contexto de um curso de automação de leads (ver funcionalidade 5), instrutores ou alunos podem usar essa ferramenta como prática demonstrativa de como a automação pode agilizar o tratamento de dados, comparando o "antes e depois" do CSV.
Escopo
Upload de Arquivo: Suportar upload de arquivos CSV (comma-separated values) contendo colunas de Nome, Empresa, Título, Telefone e Especialidade. Poderão existir outras colunas no arquivo, mas o foco de limpeza será nestes campos-chave.
Limpeza e Normalização:
Nome: Padronizar em Capitalização de Nome Próprio (primeira letra de cada nome maiúscula, resto minúscula). Ex.: "MARIA da silva" -> "Maria da Silva". Remover espaços em excesso ou caracteres estranhos.
Empresa: Padronizar o nome da empresa em formato Título (salvo siglas conhecidas que devem permanecer maiúsculas). Ex.: "acme S/A" -> "ACME S/A" (siglas como S/A mantidas). Remover sufixos desnecessários se for padrão (por ex., "Ltda." pode ou não ser removido conforme necessidade de consistência).
Título (Cargo): Padronizar capitalização conforme convenção (possivelmente cada palavra com inicial maiúscula, exceto preposições/artigos). Ex.: "gerente de vendas sênior" -> "Gerente de Vendas Sênior". Poderá também normalizar abreviações comuns (p.ex., "Sr." -> "Sênior", "JR" -> "Júnior"), e remover títulos honoríficos que não sejam parte do cargo (p. ex.: "Dr.", "Prof.", para não confundir a especialidade; isso dependeria do contexto dos leads).
Telefone: Normalizar formato telefônico. Detectar o país/região a partir do número ou suposições (p.ex., se todos números têm 11 dígitos provavelmente Brasil, ou usar formatação internacional E.164 padrão começando com +countrycode). Ex.: "(11) 91234-5678" -> "+55 11 91234-5678". Remover caracteres não numéricos (traços, parênteses) e então reformatar. Se algum telefone estiver incompleto ou inválido, marcar ou deixar como está (não inventar números).
Especialidade: Padronizar texto de especialidade se existente. Ex.: se o CSV tem uma coluna "Especialidade" preenchida manualmente, pode haver variações (ex.: "Financas", "finanças", "Financeiro"). O sistema deve uniformizar ortografia e capitalização ("Finanças"). Se a especialidade for um valor categórico conhecido, mapear variações para um padrão (ex.: "TI", "Tecnologia da Informação" -> consolidar em um só termo padrão).
Detecção de Inconsistências: Identificar entradas obviamente inválidas e tratá-las:
Nomes com caracteres fora do alfabeto (ex.: emojis ou números no campo nome) – remover ou alertar.
Telefones muito curtos ou contendo letras – podem ser movidos para um campo separado de "Observação" ou sinalizados. (Nesse MVP, possivelmente apenas marcar com algum indicador, mas sem interface complexa para isso).
Linhas duplicadas exatas – se o CSV tiver duplicatas idênticas, podemos opcionalmente eliminá-las ou sinalizar (escopo opcional, mas benéfico).
Transformação de Estrutura (se necessário): Se o CSV vier com colunas desordenadas ou cabeçalhos diferentes, o sistema tentará mapear para os campos conhecidos. Por exemplo, se o cabeçalho for em inglês ("Name, Company, Title, Phone, Specialty"), reconhecer e tratar igualmente. Se faltar algum dos cinco campos, processar os existentes e ignorar colunas extras não reconhecidas (mas idealmente, avisar o usuário).
Processamento Automático Pós-Upload: Assim que o arquivo for enviado, inicia-se automaticamente a limpeza e, em seguida, o enriquecimento (Funcionalidade 1), combinando os processos. Do ponto de vista do usuário, é uma única etapa de upload para obter o resultado final (limpo + enriquecido). Porém, no PRD destacamos a limpeza como parte separada para clareza.
Feedback ao Usuário: Após upload, o usuário deve receber algum feedback (ex.: "Processando X registros...") e, ao concluir, poder visualizar os dados transformados (Funcionalidade 3). Não há necessidade de intervenção manual durante o processamento, a não ser aguardar.
Critérios de Aceitação
Upload funcional: O usuário consegue selecionar um arquivo .CSV do sistema local e enviá-lo pela interface. Critério: arquivos de, por exemplo, até 5MB ou 1000 linhas devem ser aceitos e processados sem falhar.
Parsing correto: O sistema interpreta corretamente as colunas esperadas. Se o arquivo tem cabeçalhos diferentes, o sistema mapeia ou informa claramente quais colunas não foram reconhecidas. Ex.: se a coluna de telefone vier nomeada "Contato_Telefone", o sistema ainda assim consegue identificar ou pelo menos não descartá-la inadvertidamente.
Limpeza aplicada: Ao visualizar o resultado (ou inspecionar o CSV de saída), os campos transformados apresentam formatação consistente:
100% dos nomes próprios iniciados em maiúsculo (salvo exceções como "da, de" minúsculos no meio).
Telefones em um formato único (e.g., todos começando com "+" country code ou todos com um padrão nacional consistente).
Cargos com capitalização uniforme e sem abreviaturas inconsistentes.
Especialidades uniformes em linguagem (ex.: não misturar "TI" e "Tecnologia da Informação" como valores diferentes se representam a mesma coisa).
Integridade dos dados: Nenhum lead deve "perder" informações durante a limpeza. Ou seja, exceto remoção de espaços e caracteres inválidos, os valores permanecem representando o mesmo conteúdo. Critério: se um nome era "João" com espaço extra, continua "João" sem o espaço; se um telefone tinha formato diferente, continua com os mesmos dígitos apenas reorganizados.
Velocidade de processamento: A limpeza e transformação de, por exemplo, 500 leads deve ocorrer em poucos segundos (idealmente <5s local parse + alguns segundos de rede se incluir enriquecimento). A interface deve atualizar o status dentro de um tempo razoável para não parecer travada.
Mensagem de conclusão: Após o processamento, o sistema exibe uma mensagem ou simplesmente redireciona à tela de resultados indicando sucesso. Se houver falhas não-críticas (ex.: "5 números de telefone estavam em formato inválido e não puderam ser padronizados"), essas informações são apresentadas ao usuário de forma clara, possivelmente junto aos dados (marcando campos problemáticos) ou em um resumo de notificações.
Segurança: O sistema deve tratar corretamente arquivos malformados ou potencialmente maliciosos:
Se um arquivo não for CSV (ex.: usuário envia por engano um PDF), deve rejeitar com erro amigável.
Se houver conteúdo com scripts ou fórmulas (caso de CSVs do Excel com fórmula), não deve executar nada disso (apenas tratar como texto).
Tamanho excessivo: se um arquivo exceder o limite suportado, recusar com mensagem clara ("Arquivo muito grande...").
Exclusões (Fora de Escopo)
Edição Manual na Plataforma: O usuário não poderá editar os dados dos leads diretamente na interface web antes ou depois da limpeza (não haverá um editor de planilha online). Qualquer ajuste pontual deverá ser feito no arquivo fonte ou após baixar o resultado. A funcionalidade foca na automação completa, sem etapas manuais intermediárias.
Suporte a Formatos além de CSV: Arquivos XLS/XLSX ou outros formatos de tabela não serão aceitos diretamente (o usuário teria que convertê-los para CSV fora da aplicação). Da mesma forma, integração direta com Google Sheets ou APIs de outras fontes está fora do escopo.
Transformações Complexas: Não serão realizadas normalizações avançadas que exijam fontes de dados extras (por exemplo, validar telefones consultando uma API de telefonia, padronizar nomes de empresas consultando banco de dados externo de razão social, etc.). A transformação será baseada em regras simples e quaisquer bases de referência simples embutidas (por ex., uma tabela interna de abreviações comuns para cargos).
Armazenamento Prolongado do Arquivo: O CSV enviado não será armazenado permanentemente no servidor. Ele pode ser mantido em memória durante processamento e descartado em seguida. Não há um repositório de arquivos do usuário ou histórico de uploads na versão atual.
Conflitos de Mesclagem: Se o CSV tiver dados conflitantes ou duplicados (ex.: duas entradas para mesmo lead com diferenças), o sistema não tentará mesclá-los ou decidir qual é correto. Cada linha é tratada individualmente.
Internacionalização de Conteúdo: A limpeza (especialmente de nomes próprios e cargos) estará baseada em convenções de PT-BR. Se o CSV contiver dados em outro idioma, as regras podem não se aplicar perfeitamente (ex.: nome todo em kanji, ou cargos em inglês – o sistema pode apenas capitalizar, não traduzir).
Wireframes (Descrição)
Tela de Upload de CSV: Esta é uma das telas principais do aplicativo. Wireframe imaginado:
Cabeçalho: Título da página, por ex: "Limpeza e Enriquecimento de Leads". Logo abaixo, uma breve descrição instruindo o usuário: "Faça upload do arquivo CSV de leads para limpeza automática dos dados."
Área de Seleção de Arquivo: Um componente central com um ícone de arquivo/CSV. Pode haver um botão "Selecionar arquivo" e/ou suporte a arrastar e soltar (drag & drop) o arquivo sobre uma área pontilhada. O wireframe indicaria essa área claramente.
Informações do CSV: Após seleção, exibir o nome do arquivo selecionado e talvez número de registros detectados (se possível calcular no cliente rapidamente).
Botão de Envio: Um botão destacado "Processar Leads" ou "Enviar" abaixo do campo de arquivo.
Opções adicionais: Poderia haver checkboxes opcionais, por exemplo:
"Aplicar enriquecimento de dados externos (OpenAI)" – se marcado (por padrão marcado se queremos sempre enriquecer).
"Remover duplicatas" – caso a funcionalidade fosse oferecida opcionalmente.
Estas opções seriam representadas no wireframe como elementos abaixo do botão ou na lateral.
Estado de Processamento: Depois de clicar em processar, o wireframe mostraria um indicador:
Uma barra de progresso linear no topo, ou um spinner central, com texto "Processando... isso pode levar alguns instantes".
Também podemos mostrar etapas se sequencial: ex.: "1. Limpando dados... 2. Enriquecendo dados...".
Erros de validação imediata: Se o usuário tentar enviar sem selecionar arquivo, exibir um aviso ao lado do campo. Se selecionou um arquivo com extensão errada, mostrar erro "Formato inválido". Essas mensagens seriam pequenas caixas vermelhas próximas ao campo de upload no wireframe.
Tela de Resultado (pré-visualização): Embora a visualização completa seja tratada na Funcionalidade 3, o wireframe da tela de upload poderia incluir uma prévia de sucesso:
Após processamento, em vez de uma página separada imediatamente, talvez aparecer um resumo acima do botão, tipo um alerta verde: "Sucesso! 100 leads processados. [Botão: Visualizar resultados]"
O wireframe apresentaria esse alerta de sucesso e o botão levando à página de visualização, indicando claramente o próximo passo.
Layout geral: Simples e focado:
Provavelmente centrado na página, com largura moderada (não tela cheia) para enfatizar a ação de upload.
Texto de ajuda mínimo mas suficiente (podemos usar placeholders no input do arquivo como "Arraste o CSV aqui ou clique para selecionar").
Seguindo boas práticas de UX, pode haver um link "Baixar modelo de CSV" se quiséssemos fornecer um template, mas não obrigatório.
Exemplo Visual: Imaginar um exemplo:
Título: Upload de Leads CSV.
Ícone de upload no centro (um desenho de arquivo com seta).
Legenda: "Arraste seu arquivo aqui ou clique para escolher".
Após escolher, o ícone pode mudar para um símbolo de pronto, e o nome do arquivo aparece.
Botão azul "Processar".
Wireframe indicaria também o menu de navegação do app (onde a opção "Upload de CSV" estaria destacada já que é essa tela).
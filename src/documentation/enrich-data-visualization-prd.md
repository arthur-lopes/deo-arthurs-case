PRD: Visualização e Download de Dados Enriquecidos
Objetivos
Apresentar resultados de forma clara: Fornecer ao usuário uma visualização tabular dos leads após a limpeza e enriquecimento, para que possa verificar e validar os dados processados. Isso dá confiança de que o processo funcionou corretamente e permite identificar rapidamente eventuais anomalias em algum campo.
Facilitar o download: Permitir que o usuário baixe o resultado final em formato CSV com um clique, para que possa utilizar esses dados fora da aplicação – seja importando de volta no HubSpot, analisando em Excel ou carregando em outras ferramentas.
Interatividade mínima útil: Oferecer pequenas conveniências na visualização, como ordenar ou filtrar a tabela, se for trivial, para ajudar o usuário a navegar pelos dados (especialmente se a lista for longa). O objetivo principal, porém, é apresentação estática do resultado e confirmação da qualidade.
Consistência com o restante da aplicação: Manter o mesmo estilo visual e experiência simples. Essa tela conclui o fluxo iniciado pelo upload, funcionando quase como um relatório final da operação de enriquecimento.
Usuários-alvo
Usuário primário (marketing/vendas): Quem realizou o upload de leads agora visualiza os resultados. Eles vão conferir, por exemplo, se todos os nomes ficaram corretamente formatados, se os campos de especialidade e grau fazem sentido, etc. Este usuário pode não revisar linha por linha se houver muitos registros, mas quer ter uma visão geral da qualidade após processamento.
Gerente ou Supervisor: Em um contexto de uso interno, um gerente pode querer ver o resultado para aprovar antes de prosseguir (por ex., antes de importar ao CRM). Essa pessoa usaria a visualização para QA rápido.
Instrutor/Aluno (no contexto educacional): Se isso fizer parte de um treinamento (Funcionalidade 5), o instrutor pode projetar essa tela para demonstrar o que foi feito, e alunos podem comparar com o input original.
Escopo
Tabela de Leads Enriquecidos: Exibir os dados transformados em formato de tabela (grid):
Colunas principais: Nome, Empresa, Título, Telefone, Especialidade, Grau. (Se houver outras colunas no CSV original ou adicionadas, podemos exibi-las também ou ignorar; mas como focamos nesses campos, provavelmente a tabela terá essas colunas fixas).
Todas as colunas são preenchidas com os dados pós-limpeza e pós-enriquecimento. Por exemplo, Nome e Empresa já limpos, Especialidade e Grau possivelmente preenchidos via enriquecimento.
A tabela deve ser paginada ou rolável se registros > um certo número (evitar uma página muito comprida). Ex.: paginação a cada 50 registros, ou scroll interno com cabeçalho fixo.
Suporte a ordenação clicando no cabeçalho de colunas (por conveniência, não obrigatório, mas melhora a usabilidade para verificar coisas – ex.: ordenar por nome para ver se capitalização ficou consistente).
Possibilidade de filtro/pesquisa simples: talvez um campo de busca acima da tabela que filtra por nome ou empresa, útil se o usuário quer encontrar um lead específico para conferir. Isso é “nice-to-have” e dependerá da facilidade de implementação (pode ser feito no front facilmente já que os dados estão ali).
Destaque de campos modificados/enriquecidos: Se possível, evidenciar de alguma forma os valores que foram alterados ou preenchidos. Por exemplo, texto em itálico ou cor diferente para Especialidade/Grau adicionados, ou um tooltip “valor sugerido”. Entretanto, isso pode exigir ter armazenado meta-informação durante processamento. Como MVP, podemos não destacar, apenas mostrar final.
Informação Resumida: Acima ou abaixo da tabela, apresentar um pequeno resumo:
Quantidade de leads processados.
Talvez quantos foram enriquecidos com sucesso vs não (ex: “Enriquecimento obtido para 45 de 50 leads”).
Quantos telefones formatados, etc., se acharmos relevante.
Esse resumo dá uma visão do impacto da limpeza (por ex., “10 nomes ajustados, 3 telefones inválidos não alterados, etc.”). Novamente, isso depende de termos coletado estatísticas durante o processo. Podemos planejar que o backend envie alguns metadados junto com o resultado para esse fim.
Botão de Download CSV: Proeminente na tela, um botão “Baixar CSV” que quando clicado gera o download do arquivo CSV contendo todas as colunas mostradas, na máquina do usuário.
O arquivo deve estar codificado em UTF-8 e formatado adequadamente para re-importação no HubSpot ou abertura no Excel sem problemas de caracteres.
O nome do arquivo pode ser algo padrão como leads_enriquecidos.csv ou derivado do nome original acrescido de “_resultado”.
Retomar/Refazer: Talvez incluir um botão de “Voltar” ou “Novo Upload” que leva o usuário de volta à tela de upload para processar outro arquivo, caso desejado. Assim o fluxo continua se ele tiver múltiplas listas.
Segurança da visualização: Garantir que esta página também esteja protegida por login (mas isso é global). Dados confidenciais dos leads só devem ser visíveis para usuários autorizados.
Responsividade: Se o usuário acessar em diferentes tamanhos de tela, a tabela deve ser responsiva ou pelo menos scroll horizontal. Em dispositivos móveis, tabelas largas são difíceis; possivelmente usamos um design alternativo (cartões para cada lead, por exemplo). Entretanto, dado que este é um uso corporativo e provavelmente desktop, não priorizaremos mobile, mas devemos prever scroll horizontal ou empilhamento de colunas se necessário.
Critérios de Aceitação
Visualização completa e correta: Todos os leads enviados aparecem na tabela com todos os campos pós-processamento. Critério: o número de linhas na tabela deve igualar o número de linhas no CSV original (menos possíveis duplicatas removidas, se essa funcionalidade existir e for comunicada).
Formato consistente: Os valores exibidos refletem exatamente o output esperado da limpeza/enriquecimento. Por exemplo, nenhum nome aparece todo em maiúsculo (indicando falha de formatação), nenhum campo de especialidade que deveria existir está vazio sem explicação (se vazio, deve ser porque realmente não havia dado e não conseguimos enriquecer).
Download funcionando: Ao clicar em “Baixar CSV”, o download do arquivo inicia no navegador e o arquivo contém os mesmos dados da tabela. Ao abrir esse CSV em Excel ou outro editor, as colunas e caracteres devem aparecer corretamente. Critério: teste com ao menos um arquivo, verificando que acentos em nomes saem corretamente, que quebras de linha não estragam o CSV, etc.
Performance de renderização: A página de visualização não deve congelar o navegador mesmo com, digamos, centenas de linhas. Utilizar técnicas de renderização virtual se necessário para muitas linhas. Critério: abrir uma tabela de 1000 linhas e conseguir rolar suavemente.
Ordenação/Busca (se implementadas): Clicar em cabeçalho reorganiza os dados adequadamente; usando o campo de busca filtra as linhas imediatamente. Sem bugs como linhas sumindo indevidamente ou ordenação incorreta (ex.: ordem lexicográfica vs numérica errada em telefone).
Usabilidade: O usuário médio consegue identificar facilmente o botão de download e entende que a tabela é o resultado final. O layout deve ser intuitivo: por exemplo, se mostramos estatísticas, devem estar claramente separadas para não confundir com os dados. Uma breve explicação ou legenda pode ser fornecida (ex.: “Campos Especialidade e Grau foram adicionados automaticamente pelo sistema.”).
Proteção de dados: Verificar que após logout (se houver um logout funcional), os dados não permanecem visíveis (ex.: se alguém apertar “voltar” no navegador após logout, idealmente exigir login de novo). Ou pelo menos a sessão expira corretamente.
Exclusões (Fora de Escopo)
Edição Inline: A tabela de visualização não terá funcionalidade de edição direta dos valores (ex.: não será um Excel online). Quaisquer correções deverão ser feitas externamente, dado que o objetivo aqui é visualizar e baixar.
Salvar alterações: Consequentemente, não há um recurso de “Salvar” dentro da tabela – já se assume que o download é o método para extrair os dados. Não há versão 2 ou comparação de antes/depois dentro da interface (embora poderia ser interessante ver antes e depois lado a lado, isso não foi requerido).
Visualizações Gráficas: Não serão fornecidos gráficos ou análises visuais (ex.: distribuição de especialidades) – a saída permanece tabular. (Qualquer análise faz parte do que o usuário fará possivelmente no HubSpot ou outra ferramenta).
Exportar para outros formatos: Apenas CSV será oferecido. Não há botão direto para “Exportar para HubSpot” ou “Salvar em Google Sheets” – isso estaria fora do escopo. O usuário manualmente pega o CSV e faz o que precisar.
Paginação avançada no backend: Se a tabela tiver paginação, será no front-end (carregando todos os dados e particionando localmente). Não implementaremos paginação via backend ou loading incremental de dados; o dataset esperado é suficientemente pequeno para carregar todo em memória no cliente.
Compartilhamento da visualização: Não há um link público ou funcionalidade de compartilhar os resultados com outros usuários via app. Qualquer compartilhamento seria via envio do arquivo CSV baixado.
Wireframes (Descrição)
Tela de Resultados (Tabela): O wireframe desta tela mostraria:
Cabeçalho/Título: Algo como “Resultados do Processamento” ou “Leads Enriquecidos”. Poderia incluir um ícone de check indicando conclusão. Ao lado do título, o botão “Baixar CSV” bem destacado (talvez estilo botão primário, cor chamativa).
Resumo/Notificação: Logo abaixo do título, um texto breve: “50 leads processados com sucesso.” Se tivermos estatísticas: “Especialidade adicionada em 45 leads; 5 leads permanecem sem especialidade.” etc., possivelmente em fonte menor ou estilo informativo.
Tabela de Dados: Uma grade com cabeçalho de coluna. O wireframe indicaria 6 colunas (Nome, Empresa, Título, Telefone, Especialidade, Grau) e algumas linhas de exemplo preenchidas. Se houver paginação, mostrar controle abaixo da tabela (ex.: “<< < 1 2 3 > >>”). Se for scroll, indicar uma barra de rolagem.
Cada célula exibindo texto alinhado (provavelmente à esquerda para texto, talvez telefone alinhado ao centro). Cabeçalhos talvez em negrito.
Se implementamos ordenação: no wireframe, poderíamos adicionar um pequeno triângulo ▲▼ no cabeçalho clicado.
Campo de Busca: Opcionalmente desenhar uma caixa de texto com ícone de lupa no canto superior direito da seção da tabela, indicando que o usuário pode filtrar.
Botões adicionais: Um botão “Novo Upload” ou “Processar outro arquivo” poderia estar abaixo ou acima, permitindo recomeçar. O wireframe poderia colocá-lo no topo ao lado do botão de download, ou no fim da página.
Exemplo de Conteúdo: No wireframe, ilustrar uma linha:
Nome: “Maria da Silva”
Empresa: “ACME S/A”
Título: “Gerente de Vendas Sênior”
Telefone: “+55 11 91234-5678”
Especialidade: “Vendas”
Grau: “Sênior”
Isso mostraria claramente campos preenchidos. Se quisermos mostrar um caso de campo vazio (ex.: algum lead sem especialidade encontrada), poderíamos mostrar “-” ou vazio em alguma célula para representar.
Layout geral: O design deve ser limpo:
Provavelmente com bordas discretas nas células ou linhas zebra (alternar fundo claro/cinzento) para facilitar leitura de linhas largas.
O wireframe deve transmitir legibilidade: fonte suficientemente pequena para caber as colunas, mas não minúscula. Talvez suporte a scroll horizontal se a tela for estreita.
Na paleta de cores, podemos usar a mesma do restante do app: por exemplo, azul para cabeçalhos, etc. Indicar isso no wireframe não textual é difícil, mas podemos descrever que segue identidade visual.
Responsividade Indicação: Podemos ter um segundo wireframe mental para mobile: talvez as colunas se empilhem tipo cartão (cada lead vira um bloco com labels e valores em linhas). Mas novamente, isso é opcional e não principal foco.
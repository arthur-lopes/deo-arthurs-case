PRD: Seção Educativa – Criar Datasets no HubSpot
Objetivos
Educar o usuário: Fornecer um conteúdo textual de aprendizado dentro da aplicação explicando passo a passo como criar datasets (conjuntos de dados) no HubSpot. O objetivo é capacitar os usuários a utilizarem melhor o HubSpot, possivelmente para que integrem ou utilizem os dados enriquecidos do aplicativo em relatórios no HubSpot.
Servir como referência rápida: A seção deve ser escrita de forma clara, em português, servindo como um guia que o usuário possa consultar sem sair da aplicação. Isso evita que ele precise buscar documentação externa enquanto está usando o produto, aumentando conveniência e valor agregado.
Complementar a funcionalidade principal: Esta seção não é interativa além da navegação, mas complementa o contexto do aplicativo (que lida com leads e dados). Ensinar sobre datasets no HubSpot faz sentido caso o usuário queira importar o CSV final e criar relatórios; assim, damos o conhecimento necessário.
Atualizado e Conciso: Garantir que a informação fornecida sobre HubSpot datasets seja atual (baseada nas práticas vigentes até 2025) e focada nas principais etapas, sem se tornar prolixa. A experiência deve ser semelhante a ler um artigo de knowledge base diretamente, mas personalizado para nossa aplicação.
Usuários-alvo
Usuários do aplicativo (Marketing/Ops): Provavelmente o mesmo perfil que enriquece os leads também lida com relatórios no HubSpot. Esse usuário pode conhecer superficialmente HubSpot, mas não necessariamente o recurso de datasets. Ouviu falar e quer aprender como criar um dataset para combinar dados, etc. Então é uma página de ajuda direcionada a esse profissional de marketing de dados ou operações que usa HubSpot.
Iniciantes no HubSpot: Se algum usuário for novo na plataforma HubSpot, essa seção serve como tutorial básico, cobrindo: o que é um dataset, para que serve, e como criar um do zero.
Equipes de Produto/CS: (Indiretamente) Caso essa aplicação seja entregue a um cliente ou equipe, esta seção educacional melhora a percepção de valor, pois mostra não só a ferramenta mas ensina boas práticas (o que pode ser algo que um CS – Customer Success – gostaria que os clientes soubessem).
Escopo
Conteúdo Textual Didático:
Explicação do conceito: Definir o que é um dataset no contexto do HubSpot (coleção de dados de objetos do CRM para uso em relatórios). Por exemplo: “Um conjunto de dados é uma coleção de propriedades e cálculos que você prepara para facilitar a criação de relatórios no HubSpot”
knowledge.hubspot.com
.
Passo a Passo de Criação: Fornecer etapas claras de como criar um dataset:
Navegar até a área correta no HubSpot (Relatórios > Gerenciamento de dados > Conjuntos de dados)
knowledge.hubspot.com
.
Clicar em “Criar conjunto de dados”.
Selecionar as fontes de dados (explicar que podem ser contatos, empresas, negócios, etc., até 5 fontes, e como funcionam fontes primárias e relacionadas)
knowledge.hubspot.com
knowledge.hubspot.com
.
Adicionar campos: escolher quais propriedades incluir no dataset e adicionar campos calculados/fórmulas se necessário
knowledge.hubspot.com
knowledge.hubspot.com
.
Salvar o dataset, dar um nome significativo.
Usar o dataset para criar relatórios personalizados (mencionar que depois de criar, pode ir em Criar relatório a partir do dataset)
knowledge.hubspot.com
.
Dicas e Boas Práticas: Por exemplo:
Nomear dataset de forma descritiva para equipe reconhecer.
Verificar permissões (quem tem acesso a criar datasets – requer certas assinaturas/produtos, e.g. Operations Hub Professional
knowledge.hubspot.com
).
Atualizações refletem em todos relatórios: se editar o dataset depois, todos relatórios baseados nele atualizam
knowledge.hubspot.com
 (importante para entender manutenção).
Limites: citar que há limites de quantos datasets podem ser criados dependendo da assinatura
knowledge.hubspot.com
.
Conexão com nossa aplicação: Destacar brevemente como isso se relaciona: por exemplo, sugerir que “após limpar e enriquecer seus leads e importar de volta ao HubSpot, você pode criar um dataset combinando os contatos enriquecidos com objetos de negócio para analisar desempenho”. Isso torna o conteúdo mais relevante ao usuário atual.
Formato da Seção:
Deve ser apresentado no frontend como uma página estática ou semi-estática. Pode ter subtítulos, bullet points, e possivelmente imagens ilustrativas (screenshots do HubSpot interface) se disponíveis e permitidas. Se não incluirmos imagens, usaremos descrição textual vívida.
O tom é instrucional, mas dentro do app provavelmente estilizado igual a outras páginas (mesmo header/nav, etc.). Como é bastante texto, deve ter boa formatação: parágrafos curtos, listas para passos, talvez blocos citando botões ou itens da interface HubSpot em itálico ou negrito para destacar.
Navegação e Acesso:
Essa seção terá uma entrada no menu, por exemplo “Aprendizado” ou “Tutorial HubSpot”. O usuário clica e vê o conteúdo diretamente.
Não requer conexão com HubSpot ou qualquer API – é puramente informacional.
Deve estar disponível apenas após login (pois conteúdo interno da aplicação, e possivelmente porque a existência dela é parte do valor que pode ser restrito a usuários autorizados do app).
Atualização do Conteúdo:
Como HubSpot pode mudar, idealmente o conteúdo deveria ser fácil de atualizar por não-desenvolvedores. Mas não teremos CMS; possivelmente ficará hardcoded ou em arquivo markdown. Isso é ok para agora, mas ciente de manutenção futura manual pelo time técnico se necessário.
Incluir uma data ou versão (p.ex., “Atualizado em 2025”) para situar temporalmente o conteúdo. (Pode ser rodapé: "Conteúdo atualizado até janeiro/2025").
Linguagem e Estilo:
Português claro, usando termos do HubSpot em PT (a HubSpot em português usa termos como “Conjunto de dados” para dataset, “Fonte de dados” etc., devemos manter consistentes).
Evitar jargões muito técnicos além do necessário; escrever como documentação de usuário final.
Pode usar voz explicativa e direta: “Para criar um conjunto de dados: vá em..., clique..., selecione...”.
Critérios de Aceitação
Conteúdo completo e correto: A seção deve cobrir os pontos principais do processo de criar um dataset no HubSpot de maneira sequencial. Critério: se um usuário seguir as instruções fornecidas, ele consegue criar um dataset básico sem precisar de informações adicionais. Isso implica que não faltam passos importantes (por exemplo, não pular o passo de salvar ou de escolher fonte principal).
Facilidade de compreensão: O texto deve ser de fácil leitura. Frases curtas, parágrafos objetivos. Pode ser testado com alguém do time: ler e perguntar se entendeu como faria no HubSpot.
Organização lógica: Uso apropriado de headings e listas: por exemplo, passos enumerados 1-5 para as etapas, pequenos parágrafos explicativos entre. Critério: visualmente, o usuário consegue escanear os passos ou tópicos rapidamente (conforme boas práticas de formatação exigidas pelo usuário nas diretrizes).
Consistência terminológica: Todos os termos referentes ao HubSpot estão corretos em português (ex.: "Gerenciamento de dados > Conjuntos de dados" exatamente como aparece na interface HubSpot
knowledge.hubspot.com
). Critério: comparar com a interface real ou docs oficiais (como as citadas) para garantir nomenclatura exata.
Semelhante à documentação oficial: Embora escrito por nós, deve estar alinhado ao que a HubSpot Knowledge Base informa, para não induzir erro. Podemos verificar com um usuário teste: se seguir e for no HubSpot, os menus e botões citados existem e com aqueles nomes.
Acesso dentro do app: Verificar que o menu/rota está funcionando e a página carrega rapidamente. Como é estática, deve ser instantâneo.
Responsividade e Scroll: Como é texto possivelmente longo, garantir que em telas menores ele possa ser lido (texto quebra linhas corretamente, etc.). Critério: em um navegador mobile, a seção é legível (mesmo que o app não seja focado em mobile, o texto em si deve fluir).
Segurança: Não expõe nada sensível, é geral. Mas garantir que a página só é visível a usuários autenticados (no sentido que route guard protege, porém mesmo se não fosse protegido não teria dados privados).
Exclusões (Fora de Escopo)
Interatividade: Esta seção não terá vídeos incorporados, simulações ou elementos interativos da UI do HubSpot. Será puramente texto (e imagens ilustrativas estáticas se possível). Não haverá, por exemplo, um sandbox de HubSpot dentro do app.
Cobrir outros tópicos: Limitaremos o conteúdo a criação de datasets. Não entraremos em detalhes de criação de relatórios (além de mencionar superficialmente usar o dataset no relatório), nem de outros recursos de HubSpot (como eventos, ou outros itens de “Gerenciamento de dados” exceto o necessário para contexto).
Feedback ou Quiz: Não haverá mecanismo para o usuário responder perguntas ou marcar passos como concluídos. Não é um curso interativo, apenas material de leitura.
Atualização Dinâmica: O conteúdo não se atualiza de forma automatizada da fonte HubSpot. Ou seja, se a HubSpot mudar algo, precisaremos atualizar manualmente em uma próxima versão; não é escopo integrar via API ou scraping a documentação oficial para mantê-la atualizada em tempo real.
Download do conteúdo: Não vamos oferecer um PDF ou algo do gênero do tutorial. O usuário poderia copiar/colar se quiser guardar. Se isso fosse pedido, seria fora do escopo atual.
Conteúdo multilíngue: Será somente em português. Não há opção de trocar idioma do tutorial dentro do app.
Wireframes (Descrição)
Tela da Seção de Aprendizado: O wireframe desta seção seria semelhante a uma página de artigo:
Título: Em destaque no topo, por ex.: “Como criar conjuntos de dados (datasets) no HubSpot”.
Corpo do texto: Múltiplas seções com subtítulos. O primeiro parágrafo definindo dataset. Depois um subtítulo “Passo a passo:” seguido de uma lista numerada 1, 2, 3... cada item representando um passo (com 1-2 frases e possivelmente sub-listas se um passo tiver detalhes).
Subtítulos possíveis no wireframe: “O que é um Dataset?”, “Criando um dataset passo a passo”, “Dicas e Boas Práticas”. Esses seriam talvez de nível 2 (##) e destacados em negrito maior.
Lista numerada de passos: Representada no wireframe claramente alinhada e com números 1., 2., etc.
Capturas de tela (opcional): Se incluirmos, o wireframe mostraria caixas retangulares com um ícone de imagem indicando um screenshot. Por exemplo, uma captura da tela de navegação do HubSpot ou do botão “Criar conjunto de dados”. Se não tivermos imagens, ignorar essa parte.
Destaques visuais: o wireframe indicaria uso de formatação, como palavras-chave em negrito (ex.: nomes de menus ou botões) e itálico para talvez termos em inglês ou notas.
Exemplo: Poderíamos inserir um exemplo de um dataset, então o wireframe poderia ter um pequeno bloco “Exemplo:” em itálico ou coloração diferente, contendo um cenário ilustrativo (por ex.: “Ex: Criar um dataset unindo Contatos e Negócios para ver receita por lead”). Isso destacaria do texto principal.
Layout similar ao site HubSpot KB: Talvez margens laterais para não ficar muito largo, e texto preto sobre fundo branco para facilitar leitura. O wireframe mostraria o texto fluindo em coluna central.
Navegação: O menu principal do app estaria visível (talvez na esquerda ou topo, dependendo do design geral). Nele, o item “Aprendizado” estaria ativo.
Scroll: O wireframe deve considerar que é uma página scrollável verticalmente. Provavelmente com ~2-3 telas de altura de conteúdo.
Rodapé: Poderíamos incluir um rodapé pequeno indicando fonte ou recomendando ver a documentação oficial da HubSpot para mais detalhes. No wireframe, isso seria texto menor no fim, possivelmente com um link (ex.: “Saiba mais na HubSpot Knowledge Base.”).
Mobile consideration: Em mobile/responsivo, o wireframe adaptaria o texto em uma coluna única, menu possivelmente hambúrguer. Mas novamente, não principal.
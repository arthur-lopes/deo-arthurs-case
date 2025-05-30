PRD: Enriquecimento de Dados de Leads
Objetivos
Completar informações de leads: Enriquecer os dados de leads com campos adicionais de especialidade e grau (como área de atuação e senioridade do contato) para fornecer um perfil mais completo de cada lead.
Automatizar a pesquisa de dados externos: Utilizar inteligência artificial (OpenAI GPT) e scraping web automatizado para obter informações relevantes dos leads de fontes externas, simulando pesquisa manual porém de forma mais rápida.
Melhorar a segmentação e qualificação: Com dados enriquecidos (especialmente área de especialidade e nível/senioridade), permitir que equipes de marketing e vendas segmentem e priorizem leads de forma mais eficaz, focando nos contatos mais qualificados.

Usuários-alvo
Equipe de Marketing: Profissionais de marketing que desejam melhorar a qualidade dos leads em campanhas, obtendo mais dados para segmentação (por exemplo, focar em leads de determinado cargo ou setor).
Equipe de Vendas/SDRs: Representantes de vendas que usam listas de leads e precisam de contexto adicional (como posição hierárquica do lead e setor de atuação) para abordagens mais personalizadas.
Analistas de Dados/BI: Usuários que desejam agregar dados externos nos perfis de leads para análises avançadas (por exemplo, correlacionar especialidade do lead com conversões).

Escopo
Entrada de Dados: O sistema receberá dados básicos do lead (ex.: nome, empresa, título/cargo, possivelmente e-mail ou domínio da empresa, telefone).
Enriquecimento com IA e Scraping: Para cada lead, o backend consumirá serviços externos para determinar:
Especialidade (área de atuação) do lead, inferida a partir do cargo, descrição pública ou perfil disponível (via scraping de fontes públicas ou site da empresa, se aplicável). Será usado um modelo da OpenAI (GPT) para interpretar textos e identificar o campo de atuação do profissional ou setor da empresa.
Grau (senioridade) do lead, inferido do cargo (por exemplo, Júnior, Pleno, Sênior, Diretoria, C-level), ou possivelmente formação acadêmica/título profissional, caso pertinente. O modelo de IA pode classificar o nível hierárquico a partir do título (ex.: "Head of Marketing" -> especialidade Marketing, grau Sênior/Diretor).

Algoritmo de Decisão: Combinar as abordagens:
Dados existentes/HubSpot: Se o lead exportado do HubSpot já contém o campo de especialidade ou grau, usar essas informações diretamente (prioridade para dados internos confiáveis).
OpenAI: Se faltar especialidade ou grau, usar OpenAI para inferir via análise do cargo/título. Por exemplo, enviar o cargo/título para a API do OpenAI com prompt para retornar a área de especialidade e senioridade.
Scraping (opcional): Se necessário, fazer scraping básico do site da empresa para obter informações adicionais sobre o setor de atuação, que podem complementar a análise da IA.

Critérios de Aceitação
Enriquecimento bem-sucedido: Para um dado lead com informações básicas, o sistema retorna os campos "Especialidade" e "Grau" preenchidos ou atualizados automaticamente. Ex.: Dado um lead "João Silva – Engenheiro de Software na ACME Tech", o sistema poderia retornar Especialidade: Tecnologia/Engenharia de Software; Grau: Sênior.
Uso de IA e fontes externas: O sistema deve demonstrar que utilizou pelo menos uma fonte externa (OpenAI/scraping) quando os dados internos forem insuficientes. Por exemplo, se o cargo for genérico, o OpenAI deve complementar com interpretação contextual.
Tempo de processamento aceitável: O enriquecimento de um conjunto de leads deve ocorrer em um tempo razoável (por exemplo, enriquecer 100 leads em até poucos minutos). Se uma chamada externa falhar ou demorar, o sistema registra a falha e continua com os demais, evitando travar todo o processo.
Precisão básica: Embora seja difícil medir automaticamente a acurácia, espera-se que a especialidade corresponda ao setor/cargo do lead de forma consistente e que o grau reflita apropriadamente sua senioridade. Durante testes, pelo menos 80% dos enriquecimentos manuais conferidos devem fazer sentido com base nas informações públicas do lead.

Exclusões (Fora de Escopo)
Verificação humana de dados: O sistema não realizará validação manual ou curadoria humana das informações obtidas. Erros de inferência da IA ou dados incorretos de APIs externas não serão corrigidos manualmente na aplicação.
Garantia de 100% de precisão: Não é escopo do produto garantir que todos os campos enriquecidos estejam absolutamente corretos ou atualizados – trata-se de um auxílio automatizado, sujeito a limitações de fontes públicas e IA.
Enriquecimento além de especialidade e grau: Outros enriquecimentos como obter foto do lead, perfil completo do LinkedIn, pontuação de lead (lead score) ou intenção de compra não estão inclusos nesta versão. Somente os campos definidos (especialidade e grau) serão adicionados.
Armazenamento de longo prazo: O sistema não servirá como base de dados CRM persistente. Os dados enriquecidos serão apresentados e exportáveis, mas não há módulo de sincronização automática de volta para o HubSpot ou armazenamento permanente robusto (a não ser armazenamento temporário para exibição/download).
Volume massivo ou tempo real: Enriquecimento em lote de volumes extremamente grandes (milhares de leads simultâneos) ou processamento contínuo em tempo real (streaming) está fora de escopo. A funcionalidade destina-se a conjuntos moderados de leads enviados ocasionalmente para limpeza.

Wireframes (Descrição)
Tela de Enriquecimento de Leads: A interface de usuário para essa funcionalidade seria simples e integrada ao fluxo de upload de CSV (Funcionalidade 2). Não há uma tela separada apenas para "enriquecer"; em vez disso, após o upload do arquivo, o enriquecimento acontece automaticamente em segundo plano. Caso projetássemos uma tela dedicada:
Seção de Configuração: Poderia haver um formulário ou opções antes do processamento, onde o usuário confirma se deseja aplicar enriquecimento de dados externos. Ex.: uma caixa de seleção "Enriquecer dados dos leads automaticamente via IA".
Indicador de Processamento: Após iniciar o processo (upload do arquivo e clicar em "Processar"), uma barra de progresso ou spinner é exibido indicando que os leads estão sendo enriquecidos. Mensagens de status podem aparecer, ex.: "Consultando dados externos…" ou "Enriquecendo lead 5 de 50…".
Resumo de Resultados: Após concluído, na tela de visualização de dados transformados (ver Funcionalidade 3), os novos campos Especialidade e Grau aparecem como colunas adicionais. Talvez um destaque visual (ex.: ícone "✨" ou cor diferente) nos campos enriquecidos para indicar que foram gerados automaticamente.
Notificações de Erro: Se alguns leads não puderam ser enriquecidos (ex.: API do OpenAI não retornou resultados), a interface pode mostrar uma notificação discreta listando quais registros falharam no enriquecimento, sugerindo verificação manual posterior.

Layout esperado: O wireframe seria semelhante a um painel de processamento:
Cabeçalho com título "Enriquecimento de Leads" e botão de voltar ao menu principal.
Corpo dividido em duas partes: à esquerda, lista ou contagem de leads processados; à direita, status ou log de ações (por exemplo: "Lead X – especialidade inferida via IA; Lead Y – grau determinado via análise de cargo").
Após o término, um botão "Visualizar Dados Enriquecidos" aparece para o usuário prosseguir para a tabela de visualização (Funcionalidade 3).
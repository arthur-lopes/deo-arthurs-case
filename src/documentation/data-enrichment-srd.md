SRD: Enriquecimento de Dados de Leads
Arquitetura Lógica
Arquitetura Serverless: Esta funcionalidade será implementada como parte do backend serverless na Vercel. Cada operação de enriquecimento ocorrerá dentro de uma função serverless disparada por solicitações HTTP do frontend (por exemplo, ao processar o upload CSV). A escolha por serverless garante escalabilidade automática conforme a demanda e elimina a necessidade de gerenciar servidores.
Frontend e Integração: O frontend React (Vite) não executa a lógica de enriquecimento diretamente; ele apenas envia os dados (ou aciona a função de processamento) e exibe os resultados. Todo o processamento pesado (chamadas a APIs externas, lógica de inferência) reside no backend (função serverless) por segurança (chaves de API protegidas) e para evitar expor lógica proprietária.
Processamento em Lote: A função de enriquecimento será capaz de iterar sobre uma lista de leads. Pode ser a mesma função responsável pela limpeza e transformação do CSV (ver Funcionalidade 2) ou um módulo separado invocado durante aquele fluxo. Internamente:
Carrega os registros do CSV (provavelmente já em forma de array de objetos após o parse).
Para cada lead, verifica campos necessários e enriquece conforme lógica (IA -> scraping opcional).
Módulos de Enriquecimento: Organizado de forma modular:
Módulo AIEnricher: Implementa chamadas à API do OpenAI (ex.: GPT-4 ou GPT-3.5) para inferir especialidade e grau. Prepara um prompt com contexto (nome, cargo, empresa) e instrui o modelo a responder com algo como Especialidade: X; Grau: Y. Pode usar temperatura baixa para manter resposta objetiva.
Módulo WebScraper: Implementa tentativa de scraping básico. Usa uma biblioteca HTTP (e.g. axios/fetch) para obter HTML de uma página relevante:
Empresa: se o domínio está disponível, pode buscar a página "Sobre Nós" ou homepage para ver setor de atuação (ex.: palavras-chave da empresa).
Este módulo é opcional e simples devido a limitações: pode ser apenas fornecer dados complementares (ex.: nenhuma garantia de scraping robusto).

Fluxo Condicional: A lógica decide em tempo de execução qual fonte usar:
Ex.: if (!especialidade or !grau) { try AIEnricher(); }
if (needsMoreContext) { try WebScraper(); }
Possivelmente combina resultados: ex., usar scraping para contexto da empresa e OpenAI para especialidade e grau específicos do lead.

APIs envolvidas e Endpoints
Endpoint Interno (Backend): Provavelmente POST /api/enrich-leads (ou parte do /api/process-csv) – Endpoint que recebe uma lista de leads (JSON) ou referência a um arquivo e retorna os leads com campos enriquecidos.
Entrada: JSON contendo array de objetos de lead, com campos como nome, empresa, titulo, email (se disponível), telefone, especialidade (possivelmente vazio) e grau (possivelmente vazio). Alternativamente, o endpoint pode receber diretamente o conteúdo do CSV já parseado.
Saída: JSON com o mesmo array de leads, porém agora com os campos especialidade e grau preenchidos quando possível. Pode incluir também um campo de log/metadata por lead (ex.: fonteEnriquecimento: "OpenAI" ou "Scraping" para auditoria).
APIs Externas:
OpenAI API: Uso do endpoint de completions/chat (por ex. POST https://api.openai.com/v1/chat/completions com um prompt adequado) para inferência de texto. Necessita da chave secreta da OpenAI configurada no backend.

Serviços Terceiros Utilizados
OpenAI GPT: Fornecedor de IA para compreensão de linguagem natural, utilizado para interpretar cargos e textos e retornar informações estruturadas. A escolha se deve à capacidade de LLMs em converter dados não estruturados em insights estruturados. Modelo provável: GPT-3.5-turbo (por custo e velocidade) ou GPT-4 (por melhor compreensão, se necessário e dentro das limitações de tempo).
Biblioteca de Scraping/HTTP: Poderá ser usado Node-fetch, Axios ou similar para fazer requisições HTTP diretas a páginas web (no caso de implementarmos scraping de HTML). Em ambiente serverless, é permitido fazer essas requisições desde que dentro do tempo limite. Caso seja necessário renderizar páginas com JavaScript (pouco provável para pegar textos simples), poderíamos avaliar um serviço externo ou API de scraping, mas provavelmente não entraremos nesse nível de complexidade.
Biblioteca CSV Parser: Embora não um "serviço", usaremos uma biblioteca como Papaparse (no frontend) ou um parser CSV no backend (ex.: csv-parser para Node) para ler o arquivo CSV fornecido, separar colunas e transformar em JSON para processamento.

Estrutura de Banco de Dados
Armazenamento Temporário em Memória: Esta funcionalidade, devido ao caráter serverless e processamento em tempo real, não utiliza um banco de dados relacional ou NoSQL persistente. Os dados dos leads são mantidos em memória durante a execução da função (por exemplo, em arrays/objetos Javascript) enquanto são enriquecidos. Assim que o processo termina e os dados são enviados de volta ao cliente, a instância da função é descartada pelo ambiente serverless.
Cache Opcional (Não Persistente): Poderíamos usar um cache em memória (por exemplo, variável estática no escopo da função ou cache in-memory do Vercel Function, ciente de que pode não persistir entre execuções) para armazenar temporariamente resultados de API externos, a fim de evitar chamadas repetidas para dados iguais. Exemplo: se dois leads forem da mesma empresa X, após buscar uma vez informações dessa empresa via scraping, guardar o resultado e reutilizar para o segundo lead. Esse cache seria volátil e válido apenas durante a execução atual.
Log de Processamento: Em vez de banco de dados, logs de execução podem ser armazenados usando serviços de logging da Vercel ou soluções como LogDNA, etc., para auditoria e debugging. Isso não faz parte do produto em si, mas da infraestrutura.
Possibilidade de Extensão: Se no futuro fosse necessário armazenar leads enriquecidos para comparações ou histórico, poderíamos integrar um banco de dados (Firebase Firestore, por exemplo, ou Postgres via Vercel integration) para salvar registros com um ID de usuário ou timestamp. No escopo atual, não será implementado.

Fluxos de Dados
Fluxo 1 – Enriquecimento durante processamento de CSV:
O usuário (frontend) envia uma requisição com o arquivo CSV para o endpoint de processamento (ver Funcionalidade 2 SRD).
O backend parseia o CSV e para cada linha (lead) chama internamente a rotina de enriquecimento (pode ser uma função separada ou inline).
Para cada lead, o backend verifica dados existentes. Exemplo: Lead tem campo "Especialidade" vazio:
Backend faz requisição para OpenAI API com o prompt do cargo e contexto do lead. Recebe resposta e extrai especialidade e grau sugeridos.
Se necessário, pode fazer scraping básico do site da empresa para obter contexto adicional sobre o setor.
Integra resultados: preenche os campos necessários no objeto do lead.
Após processar todos os leads, o backend compila o array final de objetos enriquecidos e retorna ao frontend em formato JSON.
O frontend então prossegue para exibir estes dados (Funcionalidade 3). O download do CSV final pode ser feito convertendo esse JSON de volta para CSV no cliente ou via um outro endpoint.

Fluxo 2 – Enriquecimento de um lead individual (se aplicável):
(Nota: Não foi explicitamente solicitado, mas poderíamos ter um caso de uso interno para testar enriquecimento em um único lead.)
Usuário entra com dados de um lead individual em um formulário de teste e clica em "Enriquecer".
Frontend envia POST /api/enrich-lead com os campos do lead.
O backend executa o mesmo processo (IA -> scraping opcional) para aquele objeto único e retorna os campos preenchidos.
Frontend mostra os resultados na tela imediatamente (por exemplo, em um modal ou seção de pré-visualização).

Manipulação de Erros:
Se a chamada ao OpenAI falhar (timeout ou erro), o sistema registra no log e pode tentar scraping se possível, ou marca aquele lead como não enriquecido por AI.
Se scraping falhar ou não retornar informações úteis, o sistema deixa campos em branco ou usa apenas os resultados da IA.
Em todos os casos, o pipeline de enriquecimento deve ser fault-tolerant por lead: um erro em um registro não interrompe o processamento dos demais.
Erros gerais da função (ex.: falta de memória ou erro inesperado) retornam uma resposta HTTP de falha genérica para o frontend, que então exibirá uma mensagem de erro ao usuário ("Não foi possível enriquecer os dados, tente novamente").

Autenticação
Autenticação Básica: Toda a aplicação é protegida por login simples. Antes de acessar as telas de upload ou qualquer funcionalidade, o usuário deverá se autenticar. Os credenciais (usuário e senha) são pré-definidos e armazenados de forma segura no backend:
Poderão ser definidos via variáveis de ambiente no Vercel (por exemplo, ADMIN_USER e ADMIN_PASS hashed ou em plain se for protótipo).
O processo de login envolve o frontend enviar as credenciais para um endpoint de login (ex.: POST /api/login com JSON { username, password }).
O backend verifica se coincidem com os valores esperados. Se válido, gera um token de sessão (um JWT assinado, ou até um simples token em memória) e retorna ao frontend.
O frontend armazena este token (em localStorage ou cookie HTTP-Only, preferível por segurança).
Para chamadas subsequentes (como upload CSV, visualizar dados, etc.), o token deve ser enviado (ex.: via header Authorization: Bearer <token> ou cookie automaticamente). O backend, em cada endpoint protegido (/api/*), valida o token antes de proceder.
Controle de Sessão: Como é um único usuário (ou pouquíssimos) com credenciais fixas, não há gerenciamento complexo de múltiplas contas. Mas haverá, por exemplo, expiração de sessão (um JWT com validade de algumas horas) para evitar uso indevido.
Autorização no Frontend: As rotas da aplicação React serão restritas:
Página de Login é pública.
As demais páginas (upload, visualização, seções de aprendizado e curso) exigem que o usuário esteja logado. Isso pode ser implementado verificando a existência de um token válido no carregamento da página (em uma estrutura de Protected Route do React Router, por exemplo).
Armazenamento de Credenciais: Nenhuma senha em texto plano será exposta no front. A senha predefinida pode ser armazenada com hash no backend ou pelo menos não exposta nos bundles do front. Dado que é uma autenticação básica, podemos simplificar com uma comparação de hash BCrypt no serverless.
Camada de Criptografia: Recomenda-se que a aplicação esteja servida sob HTTPS (o que será, pois Vercel fornece HTTPS), garantindo que as credenciais não trafeguem em texto plano.
Observação: Essa autenticação básica visa apenas impedir acesso não autorizado casual, já que as credenciais são estáticas. Para um produto real, integraríamos com um IdP ou um sistema de usuários gerenciável, mas fora do escopo aqui.
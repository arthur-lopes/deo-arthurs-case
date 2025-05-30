SRD: Upload e Limpeza de CSV de Leads
Arquitetura Lógica
Arquitetura Cliente-Servidor: A interface de upload (cliente) e o processamento de limpeza (servidor) operam de forma desacoplada. O React/Vite serve a página de upload e lida com a seleção de arquivo; quando o usuário confirma, o arquivo é enviado via requisição HTTP para uma função serverless no backend.
Serverless Backend: Uma função serverless (por exemplo, api/process-csv.js ou similar) é responsável por receber o arquivo, processá-lo e retornar a resposta. Na Vercel, funções serverless escalam automaticamente e suportam operações de I/O como leitura de arquivos e chamadas de rede dentro dos limites de tempo
vercel.com
.
Parse e Transformação: Dentro da função:
Leitura do CSV: Pode usar streaming ou carregar todo conteúdo em memória (dependendo do tamanho esperado). Para arquivos até alguns MB, carregar inteiro é viável.
Parser CSV: Utilização de biblioteca ou lógica custom para separar linhas e colunas. Convertendo para uma estrutura de dados (lista de dicionários, por exemplo).
Aplicação de regras de limpeza:
Para cada linha (representada como objeto/dicionário), aplicar funções puras de transformação em cada campo alvo. Ex.: cleanName(nome), cleanCompany(empresa), cleanTitle(titulo), cleanPhone(telefone), cleanSpecialty(especialidade). Essas funções implementam a lógica descrita (capitalização, remoção de caracteres, substituição de termos).
Poderemos ter um módulo utils/cleaning.js com essas funções para organização.
O resultado da limpeza é uma nova lista de objetos com os campos modificados conforme necessário.
(Em seguida, o fluxo invoca a parte de enriquecimento – se integrado – mas vamos focar na limpeza aqui.)
Formatação para retorno: A função pode retornar já o JSON dos objetos limpos (que possivelmente já incluem enriquecimento). O front-end então usa esse JSON para exibir os dados. Alternativamente, poderíamos gerar um CSV pronto para download no backend e enviar como arquivo, mas isso complicaria a visualização imediata. Preferimos retornar JSON para visualização e permitir download separado.
Fluxo Assíncrono vs Síncrono: Considerando que o processamento pode envolver chamadas externas demoradas (enriquecimento), poderíamos ter optado por um processamento assíncrono (ex.: usuário envia arquivo, recebe um ID de tarefa e consulta o status depois). Contudo, dado o escopo e a expectativa de volumes moderados, implementaremos de forma síncrona – a requisição de upload só finaliza quando tudo estiver pronto, e então já devolve os dados. Durante esse período, o usuário vê um loader.
Vercel funções têm limite de execução (por ex., ~10s no plano hobby, maior no enterprise). Precisamos garantir que mesmo com enriquecimento não exceda esse tempo para o número típico de leads. Se houver risco, uma estratégia poderia ser paginar o processamento (não implementado inicialmente).
Integração no Front:
O componente React de upload usa a API FileReader ou FormData para ler o arquivo e submetê-lo via fetch/Axios para o endpoint.
Poderemos optar por ler o CSV no front para contar linhas ou validar cabeçalhos antes do envio (opcional, para feedback imediato). Entretanto, para simplificar, podemos enviar direto e deixar a validação a cargo do backend.
Após receber a resposta do backend (dados limpos), o front armazena esses dados (por exemplo, em contexto global ou estado local) e redireciona o usuário para a página de visualização (Funcionalidade 3). O redirecionamento pode ser programático (React Router navigation).
Também possivelmente guardamos o resultado no estado para permitir o download sem outra chamada. Ou fornecemos um endpoint de download separado. (Ver Funcionalidade 3 SRD para detalhes).
APIs e Endpoints
Endpoint de Upload/Limpeza: POST /api/process-csv (ou nome semelhante). Responsabilidades:
Aceitar um arquivo enviado via formulário (multipart/form-data) ou dados CSV em texto bruto.
Validar o tipo de arquivo (ver extensão ou content-type, deve ser text/csv).
Ler e parsear o conteúdo.
Realizar transformações de limpeza nos campos conforme descrito.
(Chamar rotina de enriquecimento de leads – integração com Funcionalidade 1 – antes de finalizar, se for parte do mesmo endpoint).
Retornar dados transformados. Formato de retorno preferido: JSON com um array de objetos (cada objeto representando um lead transformado). Se houver erro, retornar código HTTP apropriado e mensagem (ex.: 400 se arquivo inválido).
Endpoint de Enriquecimento: Poderá ser interno (a própria função acima chama internamente) ou exposto separadamente como POST /api/enrich-leads (ver Funcionalidade 1 SRD). No design atual, consideramos unificar por simplicidade: um único endpoint faz tudo. Mas separar logicamente ajuda em manutenção:
Possibilidade: /api/clean-leads faz só limpeza e retorna JSON; /api/enrich-leads toma JSON limpo e retorna enriquecido. Porém, isso exige duas chamadas do cliente.
Optamos pela experiência de uma chamada única (/process-csv) que internamente executa ambos (clean + enrich) e retorna já completo para o front.
Segurança do Endpoint: O endpoint requer autenticação (ver Autenticação comum). Provavelmente protegido por middleware que verifica o token de sessão antes de aceitar o processamento. Caso não autenticado, retorna 401.
Limites e Restrições: Poderemos implementar limites:
Tamanho máximo do arquivo (ex.: verificar Content-Length ou contar linhas > X, retornar 413 Payload Too Large com mensagem).
Timeout: se o processamento demorar demais, a função pode expirar. Nesse caso, deve haver um tratamento (talvez Vercel aborte automaticamente). O front deve lidar com nenhuma resposta dentro de X segundos mostrando erro genérico.
Concurrency: Vercel Functions escalam, mas para evitar abuso, poderíamos limitar a 1 processamento por vez por usuário (embora como só há um usuário, isso não é problema no escopo atual).
Logs e Debug: Não é um endpoint separado, mas consideramos adicionar logs (não expostos via API). Por exemplo, GET /api/last-log não será exposto; logs serão acessados via console Vercel for debugging by developers.
Serviços Terceiros
Nenhum serviço externo obrigatório para limpeza básica: Toda a funcionalidade de limpeza pode ser implementada com lógica local, sem dependências de APIs de terceiros, pois trata-se de manipulação de strings e formatação. Isso garante rapidez e operação offline.
Bibliotecas NPM Utilizadas:
csv-parse/csv-parser: biblioteca para ler CSV de forma robusta (considera separador, escape de vírgulas, etc.). Alternativamente, poderíamos usar PapaParse no frontend para dividir e enviar JSON, mas preferimos fazer no backend para centralizar lógica e evitar enviar JSON gigante via rede (embora enviar CSV ou JSON seja similar em tamanho, o parse no backend é mais confiável em termos de tipos).
lodash ou similar: para ajudar em capitalização de palavras (ex.: _.startCase ou criar nossas funções). Também para debouncing/limiting if needed.
libphonenumber-js: para normalização de telefones internacionalmente. Essa biblioteca pode formatar números, verificar validade e inserir código de país. Se incluída, facilita padronização de telefone (e reconhecer que “(11)9...” é Brasil, por exemplo). Caso não usemos, implementamos uma simplificada assumindo padrões do público-alvo.
Clearbit/OpenAI: Não são utilizados diretamente nesta etapa de limpeza, apenas em conjunto via Funcionalidade 1 (que é integrada, ver acima). Então, listados lá.
Plataforma Vercel: O serviço serverless da Vercel lida com o recebimento do arquivo e fornece o ambiente para execução. Vale notar limites de Vercel Functions, como tamanho máximo do request (que influencia o tamanho do arquivo CSV suportado). De acordo com documentação, a payload máxima por request pode ser ~4MB por padrão. Isso serve como parâmetro para nossos limites.
Estrutura de Banco de Dados
Sem banco de dados persistente: Similar à Funcionalidade 1, a limpeza de CSV é feita em tempo real em memória. Não há armazenamento dos dados dos leads em banco após processamento; o resultado é entregue e esquecido pelo servidorless.
Possível uso de armazenamento temporário (opcional):
Se o arquivo for muito grande para caber em memória ou processar de uma vez, poderíamos gravar temporariamente em disco (no storage ephemeral da função) linha a linha. Vercel permite escrita em /tmp dentro da execução, se necessário. Porém, isso normalmente não é preciso para CSVs moderados.
Não usaremos Firebase ou outro para armazenar leads – não é necessário para funcionalidade de ETL simples.
Dados de Configuração: Não exatamente “banco”, mas teremos configurações fixas para padronização, por exemplo:
Lista de abreviações de cargo e suas expansões (poderia ser um objeto em código: {"Sr": "Sênior", "Jr": "Júnior", ...}).
Regras de formatação de nome (ex.: palavras que devem ficar minúsculas: "de", "da", "do", etc.).
Estes atuam como uma mini base de dados, porém embutida no código. Fácil manutenção pelo time de devs se precisarem adicionar casos.
Fluxos de Dados
Fluxo Principal (Upload):
Usuário seleciona arquivo na UI e aciona “Processar”.
Frontend coleta o arquivo e envia via POST multipart para /api/process-csv junto com token de autenticação.
Backend recebe a requisição, valida autenticidade e tipo do arquivo.
Backend lê o arquivo:
Pode usar streaming: ler linha a linha para não sobrecarregar memória, já transformando e acumulando resultado. Ou ler inteiro se tamanho for ok.
Converte CSV em lista de objetos.
Aplica as transformações em cada objeto conforme regras de limpeza. (Ex.: obj.nome = formatName(obj.nome), etc.).
(Integração: Chama rotina de enriquecimento para adicionar especialidade/grau se for parte do mesmo endpoint).
Após processamento completo, envia resposta HTTP 200 com corpo contendo os dados resultantes (JSON).
Frontend recebe o JSON:
Oculta o indicador de progresso.
Armazena os dados (por exemplo, no state ou Context).
Redireciona para página de visualização, ou renderiza diretamente a tabela de resultados na mesma página (depende do design; preferimos navegação para manter a URL distinta e lógica separada).
O arquivo original não é armazenado, apenas processado em trânsito.
Fluxo Alternativo (Erro):
Se o arquivo não for válido (ex.: não é CSV ou está vazio):
Backend retorna um erro (400 ou 415).
Frontend exibe a mensagem de erro (pode ser tratada e exibida num componente de alerta).
Usuário permanece na tela de upload para tentar novamente.
Se ocorrer erro interno durante parse ou limpeza:
Backend retorna 500 com mensagem “Erro ao processar o arquivo”.
Frontend exibe erro similar e possivelmente logs (no console dev).
Se autenticação falhar (token inválido/ausente):
Backend retorna 401.
Frontend redireciona para tela de login.
Pós-processamento/download:
Após visualização, se o usuário solicitar download (Funcionalidade 3), o front já tem os dados. Ele pode formatar um CSV local e acionar download (usando blob URL, etc.). Alternativamente, o front poderia chamar um endpoint de download passando os dados ou an ID.
Provavelmente implementaremos o download no cliente mesmo (menos carga no server).
Volume e desempenho:
Para garantir boa performance, se houver muitos registros, poderíamos paginar a exibição (no front). O processamento em si, se caber em memória e dentro do tempo, deve ser ok.
Em caso de volumes maiores que o esperado, poderíamos fatiar o CSV e processar em partes, enviando resultados parciais (mas isso não foi solicitado).
Autenticação
(A autenticação básica já foi detalhada em Funcionalidade 1 e é aplicável globalmente, mas repetiremos pontos específicos se necessário)
O endpoint /api/process-csv verifica o token de sessão do usuário antes de processar. Implementação: um middleware ou verificação no início da função serverless. Se inválido, retorna erro sem tentar ler o arquivo (importante para não processar dados de usuários não autorizados).
A interface de upload estará inacessível caso o usuário não esteja logado. Por exemplo, o componente de upload pode checar if (!auth) { navigate('/login') } ou renderizar nada.
A segurança do upload também implica em evitar que terceiros mal-intencionados usem nosso endpoint de processamento para fins indevidos (por ex., um stranger enviando um CSV enorme repetidamente). Como mitigação básica, as credenciais de acesso limitam isso. Em cenário de um único usuário conhecido, isso é suficiente.
A transmissão do arquivo CSV acontece sob HTTPS, e o token de autenticação (JWT) via header/cookie também está protegido nessa camada.
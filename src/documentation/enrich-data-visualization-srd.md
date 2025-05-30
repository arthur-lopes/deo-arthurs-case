SRD: Visualização e Download de Dados Enriquecidos
Arquitetura Lógica
Renderização no Cliente: A visualização dos dados é realizada inteiramente no frontend React. Após receber os dados processados do backend (via Funcionalidade 2/1), o cliente armazena esses dados (por exemplo, no state global ou em um context) e renderiza uma página de resultados. Não há necessidade de o frontend solicitar dados do servidor para esta tela, já que eles já foram obtidos. Isso significa que, se o usuário der refresh na página de resultado sem refazer o upload, os dados podem se perder (a não ser que optemos por armazenar em localStorage ou ter um endpoint que retorne o último resultado, o que não está especificado).
Componente de Tabela: Utilizaremos um componente de tabela para exibir os dados:
Pode ser implementado manualmente com <table> HTML clássico, mapeando cada objeto a uma <tr>.
Ou utilizar uma biblioteca de tabela React (como Material-UI Table, Ant Design Table, ag-Grid, etc.) para facilitar recursos de ordenação e paginação. Dado que queremos rapidez e não temos restrição forte de usar libs, poderíamos usar uma leve (por ex.: TanStack Table – antiga react-table – para recursos client-side). Mas também é possível implementar ordenação e filtro manualmente sem muita dificuldade para o escopo.
Lógica de ordenação: manter no state qual coluna e ordem foi selecionada, e sortear a array de dados correspondentes antes de renderizar ou usar sort no render.
Lógica de filtro: manter string de filtro no state e filtrar a array por algum campo (ou todos) antes de renderizar.
Download do CSV:
Esta ação pode ser implementada no frontend para evitar carga no servidor. Basicamente:
Formatar os dados (que estão em JSON) de volta para CSV string. Isso pode ser feito manualmente (iterando colunas e linhas e concatenando com vírgulas, cuidando de escapar vírgulas em campos, etc.) ou usando um helper (algumas libs como Papaparse podem também fazer unparse).
Criar um objeto Blob com MIME text/csv;charset=utf-8; e usar a API do navegador (URL.createObjectURL) para criar um link de download dinamicamente, clicando nele via script para iniciar download.
Assim, quando o usuário clica no botão, ele baixa imediatamente, sem ir ao servidor.
Alternativamente, poderíamos ter um endpoint no backend que gera um CSV e devolve com header content-disposition forcing download. Mas isso consome recursos e é desnecessário já tendo os dados no cliente.
Estado de Aplicação:
Poderemos armazenar os dados enriquecidos em um contexto global (por ex., ResultsContext) ao recebê-los, de modo que a página de resultados possa acessá-los mesmo via refresh. Esse contexto poderia também armazenar as estatísticas (número de leads, etc.).
Se não fizermos isso, um refresh perderia dados (pois não foram salvos em servidor). Para mitigar, podemos usar localStorage: ao receber os resultados, salvar localStorage.setItem('lastResults', JSON.stringify(data)). A página de resultados, ao montar, checa se lastResults existe e se sim, usa esses dados (e talvez limpa depois se não quiser persistir além).
Segurança: armazenar leads no localStorage significa dados potenzialmente sensíveis no navegador, mas dado que é um app restrito e uso pontual, o risco é pequeno. Ainda assim, poderíamos limpar ao logout.
Navegação:
A React app deve ter uma rota configurada para resultados, digamos /resultados ou similar. Essa rota componente verifica se há dados para mostrar. Se não houver (por ex., acesso direto), pode redirecionar de volta para upload com uma mensagem "Por favor, processe um CSV primeiro".
O botão "Novo Upload" simplesmente navega de volta para a página de upload (/upload) para reiniciar o fluxo, possivelmente limpando dados antigos.
Estilos e Layout:
Usaremos CSS (ou framework UI) para dar estilo à tabela. Deve ser scrollável ou paginada.
Se muitos dados, consideraremos performance: em React, rendering 1000 rows x 6 cols = 6000 cells, que é manejável. Mas se 10k rows, pode ficar pesado – não esperamos CSV tão grande. Se ocorresse, poderíamos incorporar técnica de windowing (render only visible rows, e.g. using react-window library). Provavelmente desnecessário para volumes esperados.
Resumo de métricas:
Caso decidamos mostrar estatísticas (quantos enriquecidos etc.), precisamos que o backend tenha enviado essas informações. Podemos modificar a resposta do endpoint /process-csv para incluir meta, por exemplo: { results: [...], stats: { total: X, enriched: Y, phonesFixed: Z, ... } }.
O front então exibe stats.total etc. Isso requer ajustar pouco a lógica de processamento para coletar contagens. Fácil de adicionar (increment counters during loop).
Se não enviado, front poderia inferir algumas (ex.: count how many leads have especialidade not empty now vs before, but o front não sabe o "antes"). Melhor o backend mandar se quisermos acurácia.
Incluiremos isso no design para enriquecimento, já que melhora a apresentação.
APIs e Endpoints
Nenhum endpoint adicional é estritamente necessário para esta funcionalidade, pois os dados já estão no cliente.
Podemos considerar um endpoint GET /api/download-csv que retorna o último resultado em CSV:
Implementação: talvez armazenar o último resultado no contexto de sessão (em memory cache keyed by session ID) e quando esse GET é chamado, formatar CSV e devolver com headers (Content-Type: text/csv, Content-Disposition: attachment; filename="leads_result.csv").
Isso seria útil se quisermos aliviar a responsabilidade do front para formatação CSV ou para permitir re-download via link compartilhável. Porém, dado um único usuário e facilidade de gerar no front, provavelmente não faremos isso agora.
Proteção: Se implementássemos /api/download-csv, ele também exigiria token auth.
Front-End Routing: No React app, teremos rotas:
/upload (por exemplo) -> Tela da funcionalidade 2.
/resultados -> Tela funcionalidade 3.
As seções 4 e 5 talvez em rotas /aprendizado e /curso ou similares.
O login em /login.
Ensure using React Router or similar to handle navigation without full reload.
Integration: The download button on the front either triggers the front logic (no API call) or navigates to an endpoint (if we choose to have one). We'll choose front logic for simplicity.
Serviços Terceiros
Não há consumo de serviços externos nesta etapa, somente possivelmente bibliotecas UI:
React Table library (TanStack/react-table) if needed for easier table features.
FileSaver.js or simply vanilla approach for file download if needed (FileSaver is a tiny lib to save blobs on client, but we can do without it using standard DOM APIs).
CSV string encoding: One minor concern is encoding the CSV properly in Excel. Often adding a BOM (Byte Order Mark) or using \ufeff at start can help Excel on Windows open UTF-8 correctly. We might do that. It's an implementation detail, not a service.
Testing Tools: Not exactly a service, but we would test the downloaded CSV by opening in Excel/Google Sheets to ensure format is correct.
Estrutura de Banco de Dados
Nenhum banco de dados: Os resultados não são armazenados em servidor, então não há DB. O “estado” dos dados pós-processados vive no cliente ou em tempo de execução curta.
Armazenamento em Sessão (opcional): Como mencionado, poderíamos manter último resultado no servidor por conveniência. Isso seria em memória (por exemplo, a função de processamento poderia push o resultado para um cache global keyed by a session or user id). Mas isso é complexo em serverless (pois instâncias não compartilham facilmente memória a não ser usando externos).
Poderia usar um KV store ou database para isso, mas não justifica a não ser que vários usuários precisassem recuperar mais tarde. Com um usuário, mais simples manter no front.
LocalStorage (cliente): Atua como mini armazenamento se quisermos persistir a última visualização. Esse não é um DB do servidor, mas cabe mencionar que no cliente vamos usar possivelmente localStorage para persistir o JSON temporariamente, como mencionado.
Fluxos de Dados
Fluxo de Exibição:
Usuário chega à tela de resultados (após redirecionamento automático do fluxo de upload, ou manual via link se implementado).
O componente React verifica se tem dados disponíveis (ex.: context or localStorage).
Se não, redireciona para upload (para evitar tela vazia/confusa).
Se sim, o componente de tabela é renderizado com esses dados.
Poderá executar efeito useEffect para ordenar de início ou apenas mostrar na ordem original do CSV (provavelmente manter a ordem original, que é a ordem do arquivo).
O usuário pode interagir: clicar nas colunas para ordenar (modifica state, re-renders table sorted), digitar no filtro (update state, filter data subset to display). Estes são inteiramente ações no front, sem envolvimento do backend.
O usuário clica em “Baixar CSV”:
O front-end invoca a rotina de geração de CSV string e inicia download. Não há comunicação com servidor.
Se o usuário clicar em “Novo upload”:
O app navega de volta à tela de upload. Poderíamos limpar o contexto de resultados ao fazer isso, para evitar confusão (ex.: set results = null).
Se desejado, também poderíamos limpar localStorage ‘lastResults’.
Erro/Edge cases:
Se por acaso a quantidade de dados for enorme e o navegador enfrentar lentidão, poderíamos avisar: por exemplo, se >1000 linhas, poderia sugerir usar o filtro em vez de rolar tudo.
Se download falhar (pouco provável, já que é local), podemos verificar compatibilidade (older IE might need polyfill, not relevant likely).
If any data value has a comma or line break, ensure CSV is properly quoted. We should test one to avoid a bug where a comma in a company name shifts columns in CSV.
If the user stays on the results page a long time and then tries to download or navigate, nothing bad should happen as data is static.
Logout flow:
If the user logs out while on results page (assuming we have a logout button somewhere), we should ideally hide the data (since unauthorized now). Possibly upon logout, we clear results and redirect to login.
If user tries to directly access /resultados without login, the route guard should send them to login.
Autenticação
Proteção da Rota: A rota de visualização segue protegida pela mesma lógica de login:
React Router can have a guard that checks auth token existence before rendering the results component. If not present, redirect.
Since results might be stored in localStorage, even if token expired, the data could still be in browser. But we should not show it if not logged in. So definitely check token. Possibly clear localStorage on logout to be safe.
Backend Access: This page technically doesn’t call backend (except maybe not at all). So the main auth enforcement is on the client side. However, to avoid any chance of data leakage, we ensure the initial fetch (the one that got the data) was authed. That we did in the upload stage. After that, the data is in front-end memory only.
Download Security: The CSV generation is local, so no new security checks. But note: if multiple users were supported, one user should not see another's data. In our single-user scenario, irrelevant. If multi-user in future, the data context would be per user session anyway.
Session Expiration: If a token expires while on the results page, and the user clicks "Novo Upload" causing a call to upload endpoint, that call will fail (401). We might then prompt re-login. But on the results page itself, user could still see data because it's already fetched. It's probably okay; the data they see is their own from earlier. If we wanted, we could perhaps warn "session expired, please login for new operations". But not needed now.
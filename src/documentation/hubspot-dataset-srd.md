SRD: Seção Educativa – Criar Datasets no HubSpot
Arquitetura Lógica
Aplicação Frontend: Esta seção é implementada inteiramente no frontend, sendo essencialmente uma página de conteúdo estático. Não há necessidade de backend específico para fornecer esses dados, a não ser o serviço estático que já serve os arquivos do front.
Rota do Frontend: Configuramos uma rota em React (por ex., /aprendizado ou /hubspot-datasets). Quando o usuário navega para essa rota (clicando no menu), o app carrega o componente correspondente que contém o conteúdo do tutorial.
Carregamento do Conteúdo: O conteúdo pode ser inserido diretamente no JSX/HTML do componente, ou podemos mantê-lo separado em um arquivo markdown/JSON e fazer o React buscar e renderizar (para facilitar edição).
Simples: Escrever o HTML estático dentro do componente (com tags <h1>, <p>, <ul> etc.). Isso é direto, mas qualquer alteração exige redeploy.
Modular: Armazenar o texto em formato markdown num arquivo e usar um parser (ex.: remark or simple markdown-to-jsx library) para renderizar. Dado que a equipe dev provavelmente vai criar o conteúdo e não espera edições frequentes por não-devs, podemos optar pelo simples.
Estilo e Formatação: Usar CSS do app para estilizar headings e lists. Talvez definiremos classes ou usaremos estilo global (ex.: h1 in that component for main title, etc.).
Imagens (se incluídas): Se inserirmos imagens (capturas de tela):
Precisamos armazená-las no projeto (na pasta public/ ou importar para bundler).
O componente então referencia <img src="...">. Em Vercel, imagens estáticas serão servidas junto.
Temos que considerar tamanho e formatar para responsividade (ex.: max-width: 100%).
Check license: presumably screenshots of HubSpot UI for instructive purpose is okay (especially if user has HubSpot, it's internal use).
No State / No Interaction: This page likely uses no React state (except maybe for an accordion or something if we wanted to hide/show content, but not needed). It's mostly static content, possibly scroll.
Integration:
The nav menu or a link on another page leads here.
The page could also be accessible via direct URL if logged in (since the front is a single-page app, direct URL loads the app then shows that route).
Ensure a user can easily navigate back (maybe include a "Voltar" link or just rely on the main menu to go to upload or results).
Internationalization: The content is specifically in Portuguese, and we are not providing other languages or a toggle. If needed, we would replicate this page in English, etc., but out of scope as noted.
Performance: The content is mostly text, negligible load. Maybe some small images. It's likely shipped as part of the JS bundle or separate chunk. Possibly we can code-split such that this route is loaded on demand (since reading it is optional). But it's small enough that preloading isn't an issue.
Maintainability: Document for future developers that this page exists and might need updates if HubSpot changes. Perhaps even link the knowledge base for reference in comments.
Error handling: There's virtually none needed. At most, if images fail to load (broken link), ensure alt text so user knows what should be there.
APIs e Endpoints
Nenhum endpoint backend é necessário para este conteúdo.
A única “API” relevante é the React route. We could consider an endpoint to fetch content if we stored content in database or CMS, but that’s out of scope.
If we decided to integrate with HubSpot API (just an idea: maybe fetch via API a list of objects or fields to illustrate something), não faremos isso. Keeping it static.
Possibly external link: We might include a hyperlink in the text to HubSpot's official docs or community. These are just anchor tags that open a new tab to knowledge.hubspot.com or similar (like references).
If including an embed or something (like a video from YouTube about datasets), that would be an external content but loaded in an iframe. This wasn't specified, so likely not.
Serviços Terceiros
Nenhum serviço externo ativo.
Possibly usage of a markdown parser library if we choose that route for content management. It's a third-party library but runs within frontend. For example, react-markdown to render content from a .md file.
If we include references or links to HubSpot knowledge base, that's just a link (the user might click and go to HubSpot site which is external, but that's user-initiated). We might caution the user that leaving the app happens in new tab.
If any icon or styling library is used for layout, mention but likely we just use our CSS.
No analytics or tracking specifically for this content. Unless we want to track if user viewed it, but not mentioned. If we did, maybe simple Google Analytics event or similar, but out of scope.
Estrutura de Banco de Dados
Não se aplica: This is static content, no DB.
We do not store any user progress or feedback on reading it, so no need.
At most, if content were dynamic from CMS, that CMS could have data, but we are not using that.
The only relevant "data" is maybe if we had a version number of the tutorial to check. But again, no.
Fluxos de Dados
Fluxo de Navegação:
Usuário clica no menu “Aprendizado” (ou nome similar) na aplicação.
O Router do front mapeia para <AprendizadoPage> component.
O componente aprensenta o conteúdo imediatamente (talvez after a small mount).
Usuário lê o conteúdo, pode rolar a página. Se há links e ele clica, se externos abrirão fora.
Depois de ler, usuário pode clicar em outro menu item (por ex., voltar para upload ou etc.).
No form submission or data input, so not much else.
If images are present and they are not cached, the browser will fetch them (HTTP GET to static file on Vercel CDN).
The only slight logic: if we want to ensure authentication:
Possibly check on mount if user token present, if not, redirect to login. (Though realistically if not auth, they shouldn't be able to see this route due to overall app guard).
Flow for updates:
Developer updates text in code and redeploys. There's no dynamic flow for content updates in-app.
If we had multiple subtopics, we might have anchored links in the page (like a mini ToC at top linking to "Step by Step", "Tips" sections via anchor). It's possible to implement easily with anchor ids. That improves navigation in a long doc.
This is static content, so minimal flows.
Autenticação
Proteção por Login: As mencionado, esta seção também requer que o usuário esteja logado para acessar (principalmente porque queremos o app inteiro fechado atrás do login).
Implementado via guard no router ou a lógica geral do aplicativo.
Assim, se alguém tenta acessar /aprendizado sem login, é redirecionado ao /login.
Autorização: Não há níveis de permissão diferenciados – assumimos se você tem acesso ao app, pode ler esse conteúdo. Não há dados confidenciais aqui, então não há distinção de roles.
Sessão: Se a sessão expirar enquanto o usuário lê (raro, pois leitura pode demorar), e se ele não navegar até uma parte que requer API, ele não perceberá.
Poderíamos não forçar logout enquanto lendo, mas se ele tentar usar outra funcionalidade depois, vai pedir login novamente.
Isso é aceitável.
Segurança de Conteúdo: Mesmo que alguém conseguisse acessar a página sem login via hack (pouco provável se app is spa with guard), não seria um grande problema de vazamento, pois é apenas instrução. Mas mantemos consistente com requiring login.
No confidential info: This content presumably contains no private data, just how-to. So no additional encryption or storage concerns.
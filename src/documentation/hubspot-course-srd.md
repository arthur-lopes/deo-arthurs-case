SRD: Seção de Apresentação de Curso – Automação e Análise de Leads
Arquitetura Lógica
Frontend-Only Implementation: Similar à seção 4, esta página é entregue 100% no front-end, sem necessidade de backend dinâmico. Será um componente React contendo texto e possivelmente imagens, formatação estática, linkando para externos se necessário.
Rota do Frontend: Ex.: /curso ou /treinamento. O roteador do app direciona para o componente do Curso quando essa rota é acessada ou menu clicado.
Conteúdo do Curso: Escrito dentro do componente ou carregado via arquivo externo (p.ex., JSON ou markdown) dependendo do approach:
Provavelmente inserido no JSX com elementos <h1>, <p>, <ul>, etc., e estilizado via CSS. Isso facilita incorporar botões e imagens as needed.
Poderíamos externalizar alguns dados (ex.: nome do curso, datas) para facílima atualização, mas se são estáticos e raramente mudam, não compensa a complexidade.
Componentes Visuais:
Botão CTA: Podemos usar um componente de botão comum (talvez estilizado manualmente). Se clicado, e se link externo, pode usar <a href="..." target="_blank"> para abrir o site do curso. Ou, se quisermos um componente clique -> script (ex.: window.open(url)).
Possível Form vs Link: Se futuramente integrassem inscrição, podia ser form modal. Mas não no escopo atual, então a lógica do botão é simples hyperlink.
Imagens: Qualquer imagem (banner, instrutor foto) deve estar disponível no build:
Colocar imagens em public/ or import in code. Ensure they are optimized (not huge).
Possibly use Next/image if next.js, but we are Vite/React, so just an <img>.
If user provided an image in the PDF or we find one in Bing, could embed that, but likely we'll not do that automatically.
We'll rely on generic representation in our description. Actually including actual images in answer might not be straightforward unless we found them, but anyway not needed to mention in SRD beyond architecture.
Icons: We can use icon libraries (e.g., FontAwesome, or Heroicons) for small icons like checkmarks or time icon. If none integrated, we can use emoji or pure text (like "✔" or "⏱" for duration).
If using an icon set, include it via CDN or npm (FontAwesome might require a kit or import as SVG).
Perhaps simpler: embed small SVGs manually for a couple icons if needed. Or use Unicode checkmark for minimalism.
Styling/CSS: The CSS for this page might be slightly custom to achieve a nice layout:
Could create a CSS module for it or global styles (like a .course-page class for scoping).
Example: .course-page .banner { background: #123456; color: #fff; padding: 20px; text-align: center; } etc.
We'll ensure responsiveness with flex or grid for the info boxes, and appropriate media queries or flex wrap for mobile.
Integration Considerations:
The link to the course (CTA) might be external; ensure it does not conflict with the SPA navigation (for instance, if using <Link> from React Router for internal, use <a> for external).
Possibly, track click of CTA if we had analytics (not requested, but business might want to know interest). If so, we could fire an event to Google Analytics or a simple console log.
Because it's just text, no data flows from backend, the integration with rest of app is mainly navigation and theming.
No State: There's no interactive state, except maybe toggling something like show/hide of extended content. But likely not needed (all content visible).
Maintainability: If the course info changes (like new date or updated program), devs must update code. Could consider a config file if expecting changes, but out-of-scope likely because they'd just redeploy a small change.
APIs e Endpoints
Nenhum endpoint específico para esta página.
If in future they wanted pulling dynamic data (like next course date from an API), that could be integrated, but not in current spec.
So no fetch calls in this component. Possibly only an external link as mentioned.
Hypothetical extension: If course info was stored in a CMS (Contentful or even HubSpot CMS), we could call that API to get content. But building that is far beyond scope and not needed given static prompt.
The button's link might be considered an endpoint in user experience if it goes to an external registration page (which we assume exists elsewhere).
We ensure that if any external link is used, it includes full https:// to properly open, and target="_blank" plus rel="noopener" for safety.
Serviços Terceiros
Possíveis serviços:
If including an external link for signup, that's outside. e.g., link to a Landing Page on a marketing site or a Google Forms or Eventbrite registration. The service depends on what they'd use for sign-ups. We might not know, but at least mention e.g.: maybe "Página do curso na plataforma X".
If images or icons are from an external CDN, we note that. But likely we'll package images with our app to not depend on external loads.
If we consider using a video embed (just thinking: maybe a promo video?), that would involve YouTube or Vimeo embed code. If it was to be included, in SRD we'd mention embed code with an iframe, and note the trade-offs (embedding third-party content from YouTube, ensure responsiveness with aspect ratio box).
Not specifically needed unless we had such media.
Perhaps mention if the PDF had content about "Relatório de Automação e Análise de Leads – DEO", if that was a case study, maybe the course relates to that. It's possible the course is built around that case study. If so, referencing that as part of content is fine, but it doesn't require a service, just mention if needed.
Tracking (again, optional): if the company wanted, integration with Google Analytics or similar to track views/clicks. Usually, the front-end already has GA snippet if needed, so just triggering events. Not a full service integration to detail here unless explicitly asked. Not asked, so skip.
Estrutura de Banco de Dados
Nenhum banco de dados envolvido localmente.
The only data is static content.
If the number of signups was to be stored, that would be external (like if integrated with an LMS or something).
But currently, no DB read or write.
The app doesn't store user interest or any action. Possibly, if we had login, we might want to mark that user clicked "Interested", but that's scope creep not in prompt.
So no DB structure for this.
Fluxos de Dados
Fluxo de Navegação:
Usuário autenticado clica no menu “Curso de Automação/Leads” na aplicação.
O router carrega o componente CoursePage, que renderiza o conteúdo.
Usuário lê a página.
Se interessado, clica no CTA:
O app abre o link de inscrição (nova aba).
Se é um mailto, então abre o cliente de email do usuário.
O app em si não recebe nenhum retorno dessa ação (a não ser que quiséssemos track event).
Usuário pode voltar ou navegar para outra funcionalidade do app via menu.
Caso de uso alternativo: Usuário não clica, só leu e sai. App does nothing special, just sits idle.
Erro:
The content being static, errors are unlikely. Perhaps broken image link is one possibility (should test them).
Broken external link (maybe page moved), beyond our app control - we could update if noticed.
If the user is not logged and tries to access, route guard kicks to login.
Performance:
Minimal data to load (some text and maybe an image).
Could consider preloading the image if it's big (not necessary if properly sized).
Transitions:
Could add a nice scroll or fade when showing content, but not needed.
Possibly ensure if user scrolls down, they can scroll back easily (maybe a "back to top" link if content is very long, but likely not needed if moderate length).
System Integration:
If the app had global state or context that, for instance, fetches some config on load (like from user account), we might pass e.g. user name to greet in course page (like "Olá [Name], inscreva-se no curso..."). But we won't do personalization as not mentioned.
The course page stands alone, beyond requiring auth.
Asynchronous:
Only asynchronous part could be loading an image or waiting for user to click link. No special asynchronous code needed.
Autenticação
Proteção: Igual aos demais, a rota do curso também requer login.
So if a non-auth user tries app.com/curso, they'd be redirected to login.
No separate roles: Everyone logged in sees same content. If the course was for advanced users only, maybe restrict by role, but not indicated.
Security:
There might be contact info (like an email) on the page; ensure it's not harvestable easily (though if in HTML, it could be scraped by bots if site not behind login).
Actually, since app is behind login, search engines and bots won't see it unless credentials leak, so fine.
If the CTA is a link to an external site, that site might require login or payment, but that's outside our scope/responsibility.
Privacy:
The course page might have mention of e.g. contacting someone, which might be an email. If that email is personal or not meant to be public, ensure it's generic or authorized. But likely it's a business contact, so okay.
Session:
If user is idle reading, and token expired, if they then click "inscreva-se" (which goes outside), our app might not notice. Only if they come back and try other features they might need to re-login. Acceptable as before.
Logout:
If user logs out, they should no longer access course page. Implementation like other pages.
The content has no sensitive personal data, so risk is minimal even if cached on client.
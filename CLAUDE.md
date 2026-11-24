# Portfólio — Gerson (Ayazin)

Site estático publicado em https://ayazin.github.io/portfolio/ (GitHub Pages, branch `main`).

## Idioma

- Responda sempre em **português do Brasil**: mensagens, planos, resumos, commits e textos do site.

## Regras do projeto

- Sem etapa de compilação: HTML, CSS e JavaScript puros.
- Não quebrar nada em `demos/`: links e demos interativas devem continuar funcionando.
- `referencias/` fica fora do git (está no `.gitignore`) e nunca deve ser publicada.
- Nada do empregador nas páginas públicas: nome, logo, cores ou layout que imitem os sistemas internos, nomes de pessoas, fazendas, obras, cidades, códigos de projeto ou valores reais. As demos usam dados fictícios, com nomes e visual neutros, e devem continuar assim.
- Nunca fazer `git push` sem o Gerson aprovar os screenshots antes.

## Estrutura

- `index.html` + `style.css`: página inicial.
- `demos/pecuaria/`: app Power Apps recriado (Centros de Custo, Categorias de Animais, Preços de Mercado).
- `demos/resultadosobras/`: relatório Power BI recriado (capa, Resultado dos Projetos, Custos das Obras).
- `img/`: miniaturas JPEG 1280x800 dos projetos usadas na página inicial. Regere quando o visual de uma demo mudar.
- `rascunhos/` e `referencias/`: só locais, ignorados pelo git.

## Identidade visual (Direção B · "painel escuro")

- Tokens (iguais em todos os CSS, em `:root`):
  - Fundos: `--bg #121417`, `--bg2 #1a1d22`, `--bg3 #23272e`, linhas `--line #2a2f36`.
  - Texto no escuro: `--ink #eceae4`, secundário `--mut #a3a8b0`.
  - Destaques: âmbar `--ac #f2b544` (ação principal, item ativo) e menta `--ac2 #7fd1ae` (rótulos e séries positivas).
- Fontes: **IBM Plex Sans** (texto) e **IBM Plex Mono** (rótulos, tags, navegação), via Google Fonts.
- Página inicial: fundo grafite com grade de 56px, títulos 700 com `letter-spacing` negativo, rótulos em mono no formato `// texto` e `01 · demo`.
- Demos: estrutura fiel a Power Apps e Power BI (menu lateral, breadcrumb em caixa alta, tabelas com linhas finas, cartões de KPI, gráficos de barras e mapas de calor), mas sempre com os tokens acima. Área de conteúdo clara para leitura de tabelas, com moldura e navegação em grafite.
- Botão principal: fundo âmbar com texto `#121417`. Nunca use âmbar como cor de texto sobre branco, porque o contraste é insuficiente.
- Ícones: SVG de traço (`stroke-width` 1.8), sem emojis nem caracteres especiais como ícone.
- Proibido: azul institucional, logos e capas que imitem o empregador.

## Validação (antes de todo commit)

Use Playwright com o Edge instalado (`channel: 'msedge'`) e `@axe-core/playwright`, instalados fora do projeto. Sirva a pasta por HTTP local, porque em `file://` o axe gera erros de CORS falsos. Verifique:

1. Screenshots em **375px e 1280px** da página inicial, das 3 telas da Pecuária (consulta, modal, Preços de Mercado) e das 3 telas de Resultado das Obras.
2. **Nenhum erro no console** e nenhuma requisição falhando (inclusive favicon).
3. **Sem rolagem horizontal** (`scrollWidth` igual à largura).
4. **axe** sem violações WCAG 2.1 A/AA em todas essas telas.
5. **Links**: arquivos locais existem, âncoras existem e externos respondem abaixo de 400 (o LinkedIn responde 999 para robôs; isso é aceito).
6. **Funcionamento das demos**: filtros, criar/editar/excluir, validações, Esc fecha modal, edição na linha de preços, expandir grupos, ocultar filtros, configuração de recebimentos.
7. Para mudanças visuais nas demos: comparar lado a lado com `referencias/` e mostrar ao Gerson antes do commit.

BRASIL IMERSIVO — site inicial interativo

COMO USAR
1. Extraia todos os arquivos do ZIP mantendo a pasta assets.
2. Abra index.html no navegador para testar (a cena 3D precisa de internet para carregar Three.js pelo CDN).
3. Para publicar no GitHub Pages, envie o conteúdo desta pasta para a raiz do repositório e ative Pages em Settings > Pages.

O QUE JÁ FUNCIONA
- Layout responsivo para celular e computador.
- Navegação por seções.
- Mapa SVG ilustrativo com seis áreas clicáveis e seleção por teclado.
- Cartões dos seis biomas que atualizam o painel selecionado.
- Modal com cenários 3D procedurais feitos com Three.js; arraste para girar e use a roda para aproximar.
- Conteúdo em português.

IMPORTANTE SOBRE O MAPA
O mapa SVG desta primeira versão é uma ilustração interativa aproximada, não uma camada cartográfica oficial. Para publicação didática/científica, substitua os polígonos por limites georreferenciados oficiais dos biomas do IBGE. O mapa e as cenas 3D são componentes demonstrativos; os ambientes não são modelos científicos detalhados.

PERSONALIZAÇÃO
- Textos e informações dos biomas: objeto BIOMES em app.js.
- Cores, fontes e layout: styles.css.
- Estrutura da página: index.html.
- Imagens PNG de referência: pasta assets (não são necessárias para o funcionamento atual).
